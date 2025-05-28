import type { HttpError, WebContext, WebMiddleware } from '@aomex/web';
import { middleware } from '@aomex/common';
import vary from 'vary';

export interface CorsOptions {
  /**
   * 设置报头 Access-Control-Allow-Origin，表示该响应的资源是否被允许与给定的来源（origin）共享。对于不包含凭据的请求，也可以设为星号(\*)，表示同意任意跨源请求
   */
  origin?:
    | ((ctx: WebContext) => string | undefined | Promise<string | undefined>)
    | string;

  /**
   * 设置报头 Access-Control-Allow-Methods，表示客户端所要访问的资源允许使用的方法或方法列表。
   * 默认值：`GET,HEAD,PUT,POST,DELETE,PATCH`
   */
  allowMethods?: string[] | string;

  /**
   * 响应报头 Access-Control-Expose-Headers 允许服务器指示那些响应报头可以暴露给浏览器中运行的脚本。
   * 默认情况下，只暴露安全列表的响应报头：
   * - Cache-Control
   * - Content-Language
   * - Content-Length
   * - Content-Type
   * - Expires
   * - Last-Modified
   * - Pragma
   *
   * 也支持自定义：
   * ```typescript
   * cors({
   *   exposeHeaders: ['Content-Encoding', 'Kuma-Revision'],
   * });
   * ```
   *
   * 更多详细信息请参考[MDN](https://developer.mozilla.org/zh_CN/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
   */
  exposeHeaders?: string[] | string;

  /**
   * 设置报头 Access-Control-Allow-Headers
   */
  allowHeaders?: string[] | string;

  /**
   * 设置报头 Access-Control-Max-Age，表示 Access-Control-Allow-Methods 和 Access-Control-Allow-Headers 提供的信息可以被缓存的最长时间。默认值：`3600`（单位：`秒`）
   *
   * 如果值为`-1`，表示禁用缓存，则每次请求前都需要使用 OPTIONS 预检请求
   */
  maxAge?: number | string;

  /**
   * 设置报头 Access-Control-Allow-Credentials，Credentials可以代表 cookies、authorization headers 或 TLS client certificates，需要与客户端 XMLHttpRequest.withCredentials 或 Fetch API 的 credentials 选项结合使用
   */
  credentials?: ((ctx: WebContext) => boolean | Promise<boolean>) | boolean;

  /**
   * 响应头部增加 Cross-Origin-Opener-Policy 和 Cross-Origin-Embedder-Policy 这两个个报头。默认值：`false`
   *
   * @see https://developer.mozilla.org/en_US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
   */
  secureContext?: boolean;

  /**
   * 处理请求报头 Access-Control-Request-Private-Network 并返回报头 Access-Control-Allow-Private-Network。默认值：`false`
   *
   * @link https://github.com/WICG/private-network-access
   */
  privateNetworkAccess?: boolean;
}

/**
 * `CORS`，全称Cross-Origin Resource Sharing，是一种允许当前域（domain）的资源（比如html/js/web service）被其他域（domain）的脚本请求访问的机制，通常由于同域安全策略（the same-origin security policy），浏览器会禁止跨域请求。
 */
export const cors = (options: CorsOptions = {}): WebMiddleware => {
  options = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    secureContext: false,
    maxAge: 3600,
    ...options,
  };

  (<const>['exposeHeaders', 'allowMethods', 'allowHeaders']).forEach((key) => {
    const value = options[key];
    if (Array.isArray(value)) {
      options[key] = value.join(',');
    }
  });

  if (options.maxAge !== undefined) {
    options.maxAge = String(options.maxAge);
  }

  return middleware.web(async (ctx, next) => {
    const { request, response } = ctx;
    const requestOrigin = request.headers['origin'];

    // 如果服务器未使用通配符“*”，而是指定了明确的来源，那么为了向客户端表明服务器的返回会根据 Origin 请求报头而有所不同，必须在 Vary 响应报头中包含 Origin
    response.vary('Origin');

    let origin: string | undefined;
    if (typeof options.origin === 'function') {
      origin = await options.origin(ctx);
    } else {
      origin = options.origin || requestOrigin;
    }
    if (!origin) return next();

    let credentials: boolean;
    if (typeof options.credentials === 'function') {
      credentials = await options.credentials(ctx);
    } else {
      credentials = !!options.credentials;
    }

    if (request.method === 'OPTIONS') {
      if (!request.headers['access-control-request-method']) return next();

      response.setHeader('Access-Control-Allow-Origin', origin);
      credentials && response.setHeader('Access-Control-Allow-Credentials', 'true');
      options.maxAge && response.setHeader('Access-Control-Max-Age', options.maxAge);
      options.privateNetworkAccess &&
        request.headers['access-control-request-private-network'] &&
        response.setHeader('Access-Control-Allow-Private-Network', 'true');
      options.allowMethods &&
        response.setHeader('Access-Control-Allow-Methods', options.allowMethods);
      if (options.secureContext) {
        response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      }
      const allowHeaders =
        options.allowHeaders || request.headers['access-control-request-headers'];
      if (allowHeaders) {
        response.setHeader('Access-Control-Allow-Headers', allowHeaders);
      }

      return ctx.send(204);
    }

    const corsHeaders: Record<string, any> = {};
    function setAndRecordHeader(key: string, value: any) {
      response.setHeader(key, value);
      corsHeaders[key] = value;
    }

    setAndRecordHeader('Access-Control-Allow-Origin', origin);
    credentials && setAndRecordHeader('Access-Control-Allow-Credentials', 'true');
    options.exposeHeaders &&
      setAndRecordHeader('Access-Control-Expose-Headers', options.exposeHeaders);
    if (options.secureContext) {
      setAndRecordHeader('Cross-Origin-Opener-Policy', 'same-origin');
      setAndRecordHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    }

    return next().catch((err: HttpError) => {
      const errHeaders = err.headers || {};
      const varyWithOrigin = vary.append(
        errHeaders['vary'] || errHeaders['Vary'] || '',
        'Origin',
      );
      delete errHeaders['Vary'];
      err.headers = {
        ...errHeaders,
        ...corsHeaders,
        ...{ vary: varyWithOrigin },
      };
      return Promise.reject(err);
    });
  });
};
