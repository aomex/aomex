import { AuthError, Strategy } from '@aomex/auth';
import { WebContext } from '@aomex/web';
import { createHash } from 'node:crypto';

export type TokenLoaderItem =
  | {
      /**
       * 从报文中寻找指定的值作为token
       */
      type: 'header';
      key: `authorization` | (string & {});
    }
  | {
      /**
       * 从请求实体中寻找指定的值作为token
       */
      type: 'body';
      key: `access_token` | (string & {});
    }
  | {
      /**
       * 从查询字符串中寻找指定的值作为token
       */
      type: 'query';
      key: `access_token` | (string & {});
    }
  | {
      /**
       * 从cookie中寻找指定的值作为token
       */
      type: 'cookie';
      key: `access_token` | (string & {});
    };

export abstract class BaseBearerStrategy<
  T extends object | string | number,
  AuthorizeArgs extends any[],
> extends Strategy<T, AuthorizeArgs> {
  protected readonly loaders: TokenLoaderItem[];

  constructor(loaders?: TokenLoaderItem[]) {
    super();
    this.loaders = loaders || [{ type: 'header', key: 'authorization' }];
  }

  protected loadToken(ctx: WebContext) {
    let token: string | false = false;
    for (const { type, key } of this.loaders) {
      switch (type) {
        case 'header':
          token = this.loadFromHeader(ctx, key);
          break;
        case 'body':
          token = this.loadFromBody(ctx, key);
          break;
        case 'query':
          token = this.loadFromQuery(ctx, key);
          break;
        case 'cookie':
          token = this.loadFromCookie(ctx, key);
          break;
      }
      if (token) break;
    }
    return token;
  }

  protected loadFromHeader(ctx: WebContext, key: string): string | false {
    const headerValue = ctx.request.headers[key];
    if (!headerValue) return false;
    const parts = String(headerValue).split(' ');
    if (parts.length !== 2) return false;
    if (parts[0]!.toLowerCase() === 'bearer') {
      return parts[1]!;
    }
    return false;
  }

  protected loadFromBody(ctx: WebContext, key: string): string | false {
    if (!key) return false;
    const token = ctx.request.body[key];
    return typeof token === 'string' && token;
  }

  protected loadFromQuery(ctx: WebContext, key: string): string | false {
    if (!key) return false;
    const token = ctx.request.query[key];
    return typeof token === 'string' && token;
  }

  protected loadFromCookie(ctx: WebContext, key: string): string | false {
    if (!key) return false;
    const token = ctx.request.cookies[key];
    return typeof token === 'string' && token;
  }
}

export namespace BearerStrategy {
  export type Options<T extends object | string | number, AuthorizeArgs extends any[]> = {
    /**
     * 找到token后的回调，解析并返回真正的身份数据
     */
    onLoaded: (
      token: string,
      ctx: WebContext,
    ) => T | AuthError | false | Promise<T | AuthError | false>;

    /**
     * 按从左到右的顺序获取token。默认：`[{ type: 'header', key: 'authorization' }]`
     */
    tokenLoaders?: TokenLoaderItem[];
  } & ({
    /**
     * 身份认证后的权限判断，如果权限不足，则返回`false`，系统会自动响应`403`状态码
     *
     * 有两种方式可以获得认证的身份数据
     * ```
     * {
     *   onLoaded(token) {
     *     return { userId: 1, role: 1 };
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
 * 从请求中获取token
 *
 * 解析优先级： 自定义 -> header -> body -> query -> cookie
 */
export class BearerStrategy<
  T extends object | string | number,
  AuthorizeArgs extends any[],
> extends BaseBearerStrategy<
  {
    readonly token: string;
    readonly data: T;
  },
  AuthorizeArgs
> {
  constructor(protected readonly opts: BearerStrategy.Options<T, AuthorizeArgs>) {
    super(opts.tokenLoaders);
  }

  /**
   * 生成token字符串
   * @param algorithm 签名算法
   * @param uniqueKey 加入唯一的值（比如用户id，手机号）降低token重复风险
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

  protected async authenticate(
    ctx: WebContext,
  ): Promise<{ readonly token: string; readonly data: T } | false> {
    const { onLoaded } = this.opts;
    const token = this.loadToken(ctx);
    const data = token ? await onLoaded(token, ctx) : false;
    if (data instanceof AuthError) throw data;
    return data !== false && token !== false ? { token, data } : false;
  }

  protected override authorize(
    payload: { readonly token: string; readonly data: T },
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
}
