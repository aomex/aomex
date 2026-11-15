import { WebContext, type OpenApiInjector } from '@aomex/web';
import { createHash } from 'node:crypto';
import { AuthError } from '../auth-error';
import { Strategy } from '../strategy';

export type AuthApiKeyLoaderItem =
  | {
      /**
       * 从报文中读取裸值作为 API Key（不解析 Bearer 等 scheme）
       */
      type: 'header';
      key: `x-api-key` | (string & {});
    }
  | {
      /**
       * 从查询字符串中读取 API Key。可能进入访问日志与 Referer，生产环境慎用
       */
      type: 'query';
      key: `api_key` | (string & {});
    }
  | {
      /**
       * 从 cookie 中读取 API Key
       */
      type: 'cookie';
      key: `api_key` | (string & {});
    };

export namespace AuthApiKeyStrategy {
  export type Options<T extends object | string | number, AuthorizeArgs extends any[]> = {
    /**
     * 找到 API Key 后的回调，解析并返回真正的身份数据
     */
    onLoaded: (
      apiKey: string,
      ctx: WebContext,
    ) => T | AuthError | false | Promise<T | AuthError | false>;

    /**
     * 按从左到右的顺序获取 API Key。默认：`[{ type: 'header', key: 'x-api-key' }]`
     */
    keyLoaders?: AuthApiKeyLoaderItem[];
  } & ({
    /**
     * 身份认证后的权限判断，如果权限不足，则返回`false`，系统会自动响应`403`状态码
     *
     * 有两种方式可以获得认证的身份数据
     * ```
     * {
     *   onLoaded(apiKey) {
     *     return { appId: 1, role: 1 };
     *   },
     *   // 方式一：
     *   onAuthorize(role: number) {
     *     const identity = this.getIdentity();
     *     return identity.role === role;
     *   },
     *   // 方式二：
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
      | ((data: T) => boolean | AuthError | Promise<boolean | AuthError>);
  } & ThisType<{ getIdentity: () => T }>);
}

/**
 * 从请求中获取 API Key
 *
 * 默认从报头 `x-api-key` 读取裸值；也可配置 query / cookie。不支持 body，避免密钥进入请求体日志。
 */
export class AuthApiKeyStrategy<
  T extends object | string | number,
  AuthorizeArgs extends any[],
> extends Strategy<
  {
    readonly key: string;
    readonly data: T;
  },
  AuthorizeArgs
> {
  protected readonly loaders: AuthApiKeyLoaderItem[];

  constructor(protected readonly opts: AuthApiKeyStrategy.Options<T, AuthorizeArgs>) {
    super();
    this.loaders = opts.keyLoaders || [{ type: 'header', key: 'x-api-key' }];
  }

  /**
   * 生成 API Key 字符串
   * @param algorithm 签名算法
   * @param uniqueKey 加入唯一的值（比如应用 id）降低重复风险
   */
  signature(
    algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512' | (string & {}),
    uniqueKey?: string | number,
  ): string {
    return createHash(algorithm)
      .update(String(uniqueKey))
      .update(process.hrtime().toString())
      .update(process.pid.toString())
      .update(Math.random().toString())
      .digest('hex');
  }

  protected loadKey(ctx: WebContext) {
    let apiKey: string | false = false;
    for (const { type, key } of this.loaders) {
      switch (type) {
        case 'header':
          apiKey = this.loadFromHeader(ctx, key);
          break;
        case 'query':
          apiKey = this.loadFromQuery(ctx, key);
          break;
        case 'cookie':
          apiKey = this.loadFromCookie(ctx, key);
          break;
      }
      if (apiKey) break;
    }
    return apiKey;
  }

  protected loadFromHeader(ctx: WebContext, key: string): string | false {
    if (!key) return false;
    const headerValue = ctx.request.headers[key.toLowerCase()];
    if (headerValue == null) return false;
    const raw = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (typeof raw !== 'string') return false;
    const apiKey = raw.trim();
    return apiKey || false;
  }

  protected loadFromQuery(ctx: WebContext, key: string): string | false {
    if (!key) return false;
    const value = ctx.request.query[key];
    if (typeof value !== 'string') return false;
    const apiKey = value.trim();
    return apiKey || false;
  }

  protected loadFromCookie(ctx: WebContext, key: string): string | false {
    if (!key) return false;
    const value = ctx.request.cookies[key];
    if (typeof value !== 'string') return false;
    const apiKey = value.trim();
    return apiKey || false;
  }

  protected async authenticate(
    ctx: WebContext,
  ): Promise<{ readonly key: string; readonly data: T } | false> {
    const { onLoaded } = this.opts;
    const apiKey = this.loadKey(ctx);
    const data = apiKey ? await onLoaded(apiKey, ctx) : false;
    if (data instanceof AuthError) throw data;
    return data !== false && apiKey !== false ? { key: apiKey, data } : false;
  }

  protected override authorize(
    payload: { readonly key: string; readonly data: T },
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
    const primary = this.loaders[0]!;
    const scheme = {
      type: 'apiKey' as const,
      in: primary.type,
      name: primary.key,
    };

    return {
      ...super.openapi(),
      onDocument(document) {
        document.components ||= {};
        document.components.securitySchemes ||= {};
        document.components.securitySchemes['apiKey'] ||= scheme;
      },
      onMethod(methodItem) {
        methodItem.security ||= [];
        methodItem.security.push({ apiKey: [] });
      },
    };
  }
}
