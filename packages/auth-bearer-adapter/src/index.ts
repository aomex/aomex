import { AuthenticationAdapter } from '@aomex/auth';
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

export interface BearerAdapterOptions<T extends object | string> {
  /**
   * 找到token后的回调，解析并返回真正的身份数据
   */
  onLoaded: (token: string, ctx: WebContext) => Promise<T | false>;
  /**
   * 按从左到右的顺序获取token。默认：`[{ type: 'header', key: 'authorization' }]`
   */
  tokenLoaders?: TokenLoaderItem[];
}

export abstract class BaseBearerAdapter<
  T extends object | string,
> extends AuthenticationAdapter<T> {
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

/**
 * 从请求中获取token
 *
 * 解析优先级： 自定义 -> header -> body -> query -> cookie
 */
export class BearerAdapter<T extends object | string> extends BaseBearerAdapter<T> {
  constructor(protected readonly opts: BearerAdapterOptions<T>) {
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

  protected async authenticate(ctx: WebContext): Promise<T | false> {
    const { onLoaded } = this.opts;
    const token = this.loadToken(ctx);
    return token ? onLoaded(token, ctx) : false;
  }
}
