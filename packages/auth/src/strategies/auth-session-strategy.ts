import { randomBytes } from 'node:crypto';
import { CacheAdapter, Caching } from '@aomex/cache';
import { sleep } from '@aomex/common';
import {
  type CookieSerializeOptions,
  type OpenApiInjector,
  type WebContext,
} from '@aomex/web';
import { AuthError } from '../auth-error';
import { i18n } from '../i18n';
import { Strategy } from '../strategy';

/** Cookie 中 sessionId 允许的字符集（与 `base64url` 一致） */
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export namespace AuthSessionStrategy {
  export type CookieOptions = Omit<CookieSerializeOptions, 'encode' | 'maxAge'> & {
    /**
     * Cookie 名。默认：`sessionId`
     */
    name?: string;
    /**
     * 有效期（秒）。同时作为缓存 TTL
     */
    maxAge: number;
  };

  export type Options<
    Stored extends object | string | number,
    Loaded extends object | string | number,
    AuthorizeArgs extends any[],
  > = {
    /**
     * 会话存储适配器（`@aomex/cache` 的 `CacheAdapter`，如 memory / redis）
     */
    store: CacheAdapter;
    /**
     * 生成会话缓存键。默认：`auth:session:${sessionId}`
     */
    generateCacheKey?: (sessionId: string) => Caching.Key;
    /**
     * Cookie 配置。`maxAge` 必填
     */
    cookie: CookieOptions;
    /**
     * 每次认证成功后刷新缓存 TTL 与 Cookie 过期时间。默认：`false`
     */
    sliding?: boolean;
    /**
     * 从存储数据解析出请求上下文中的身份。可在此查库校验（如用户已注销则返回 `false`）并变换形状。
     *
     * 请在形参上标注存储类型，返回值类型即为 `ctx.auth.*.data`
     * ```ts
     * onLoaded(data: { userId: number }) {
     *   return db.user.findActive(data.userId); // 或 false
     * }
     * ```
     */
    onLoaded(
      data: Stored,
      ctx: WebContext,
      sessionId: string,
    ): Loaded | AuthError | false | Promise<Loaded | AuthError | false>;
  } & ({
    /**
     * 身份认证后的权限判断，如果权限不足，则返回`false`，系统会自动响应`403`状态码
     *
     * 有两种方式可以获得认证的身份数据
     * ```
     * {
     *   onAuthorize(role: number) {
     *     const identity = this.getIdentity();
     *     return identity.role === role;
     *   },
     *   onAuthorize: (role: number) => (identity) => {
     *     return identity.role === role;
     *   }
     * }
     * ```
     */
    onAuthorize?: (
      ...args: AuthorizeArgs
    ) =>
      | boolean
      | Promise<boolean>
      | ((data: Loaded) => boolean | AuthError | Promise<boolean | AuthError>);
  } & ThisType<{ getIdentity: () => Loaded }>);
}

/**
 * Cookie 会话策略：Cookie 保存不透明 `sessionId`，存储数据与加载后的身份可为两种形态（对齐 JWT 的 payload / verified）
 */
export class AuthSessionStrategy<
  Stored extends object | string | number,
  Loaded extends object | string | number,
  AuthorizeArgs extends any[],
> extends Strategy<
  {
    readonly sessionId: string;
    readonly data: Loaded;
  },
  AuthorizeArgs
> {
  protected readonly caching: Caching;
  protected readonly cookieName: string;
  protected readonly ttlMs: number;

  constructor(
    protected readonly opts: AuthSessionStrategy.Options<Stored, Loaded, AuthorizeArgs>,
  ) {
    super();
    if (!(opts.cookie.maxAge > 0)) {
      throw new Error(i18n.t('session_max_age_invalid'));
    }
    this.caching = new Caching(opts.store);
    this.cookieName = opts.cookie.name || 'sessionId';
    this.ttlMs = opts.cookie.maxAge * 1000;
  }

  /**
   * 建立登录态：写入存储数据并设置 Cookie。若请求已带旧 `sessionId`，会在新会话写入成功后删除旧会话
   */
  async login(ctx: WebContext, data: Stored): Promise<string> {
    return this.issue(ctx, data);
  }

  /**
   * 轮换会话 id，防止 session fixation。默认沿用 store 中已有 Stored；
   * 传入 `data` 时可在轮换时一并更新存储。无有效会话时返回 `false`
   */
  async regenerateSessionId(ctx: WebContext, data?: Stored): Promise<string | false> {
    const previous = this.readSessionId(ctx);
    if (!previous) return false;
    const stored =
      data !== undefined
        ? data
        : await this.caching.get<Stored>(this.getSessionKey(previous));
    if (stored === null) return false;
    return this.issue(ctx, stored);
  }

  /**
   * 清除登录态：删除缓存中的会话并移除 Cookie
   */
  async logout(ctx: WebContext): Promise<void> {
    const sessionId = this.readSessionId(ctx);
    if (sessionId) {
      await this.deleteSession(sessionId);
    }
    const { path, domain } = this.opts.cookie;
    ctx.response.removeCookie(this.cookieName, {
      ...(path !== undefined ? { path } : {}),
      ...(domain !== undefined ? { domain } : {}),
    });
  }

  /**
   * 在已有会话上刷新 TTL 与 Cookie 过期时间。无会话时返回 `false`
   */
  async touch(ctx: WebContext): Promise<boolean> {
    const sessionId = this.readSessionId(ctx);
    if (!sessionId) return false;
    if (!(await this.renewSession(sessionId))) return false;
    this.writeCookie(ctx, sessionId);
    return true;
  }

  protected async issue(ctx: WebContext, data: Stored): Promise<string> {
    const previous = this.readSessionId(ctx);
    const sessionId = await this.createSession(data);
    this.writeCookie(ctx, sessionId);
    // 先建后删：新会话写入失败时旧会话仍可用；删旧失败靠 TTL 回收
    if (previous && previous !== sessionId) {
      await this.deleteSession(previous);
    }
    return sessionId;
  }

  /**
   * 用 `setNX` 写入新会话；若 id 已占用则重新生成后重试（最多 10 次，防适配器异常死循环）
   */
  protected async createSession(data: Stored): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const sessionId = randomBytes(32).toString('base64url');
      const key = this.getSessionKey(sessionId);
      if (await this.caching.setNX(key, data, this.ttlMs)) {
        return sessionId;
      }
      await sleep(10);
    }
    throw new Error(i18n.t('session_create_failed'));
  }

  protected getSessionKey(sessionId: string): Caching.Key {
    return this.opts.generateCacheKey?.(sessionId) ?? `auth:session:${sessionId}`;
  }

  /** 仅刷新过期时间，不改存储内容（对应 `Caching.expire`） */
  protected async renewSession(sessionId: string): Promise<boolean> {
    return this.caching.expire(this.getSessionKey(sessionId), this.ttlMs);
  }

  protected async deleteSession(sessionId: string): Promise<void> {
    await this.caching.delete(this.getSessionKey(sessionId));
  }

  /**
   * 读取并校验 Cookie 中的 sessionId：trim 后须为 base64url 字符集，长度 1–128
   */
  protected readSessionId(ctx: WebContext): string | false {
    const value = ctx.request.cookies[this.cookieName];
    if (typeof value !== 'string') return false;
    const sessionId = value.trim();
    if (!sessionId || sessionId.length > 128 || !SESSION_ID_PATTERN.test(sessionId)) {
      return false;
    }
    return sessionId;
  }

  protected writeCookie(ctx: WebContext, sessionId: string) {
    const { name: _name, ...attrs } = this.opts.cookie;
    ctx.response.setCookie(this.cookieName, sessionId, attrs);
  }

  protected async authenticate(
    ctx: WebContext,
  ): Promise<{ readonly sessionId: string; readonly data: Loaded } | false> {
    const sessionId = this.readSessionId(ctx);
    if (!sessionId) return false;

    const stored = await this.caching.get<Stored>(this.getSessionKey(sessionId));
    if (stored === null) return false;

    const loaded = await this.opts.onLoaded(stored, ctx, sessionId);
    if (loaded instanceof AuthError) throw loaded;
    if (loaded === false) return false;

    if (this.opts.sliding) {
      if (!(await this.renewSession(sessionId))) return false;
      this.writeCookie(ctx, sessionId);
    }

    return { sessionId, data: loaded };
  }

  protected override authorize(
    payload: { readonly sessionId: string; readonly data: Loaded },
    ...args: AuthorizeArgs
  ) {
    if (!this.opts.onAuthorize) return false;
    const result = this.opts.onAuthorize.call(
      { getIdentity: () => payload.data },
      ...args,
    );
    if (typeof result === 'function') {
      return result(payload.data);
    }
    return result;
  }

  protected override openapi(): OpenApiInjector {
    const name = this.cookieName;
    return {
      ...super.openapi(),
      onDocument(document) {
        document.components ||= {};
        document.components.securitySchemes ||= {};
        document.components.securitySchemes['sessionCookie'] ||= {
          type: 'apiKey',
          in: 'cookie',
          name,
        };
      },
      onMethod(methodItem) {
        methodItem.security ||= [];
        methodItem.security.push({ sessionCookie: [] });
      },
    };
  }
}
