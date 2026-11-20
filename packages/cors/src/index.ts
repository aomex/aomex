import { HttpError, type WebContext, type WebMiddleware } from '@aomex/web';
import { middleware } from '@aomex/common';
import vary from 'vary';
import { i18n } from './i18n';

export interface CorsOptions {
  /**
   * 设置报头 Access-Control-Allow-Origin，表示该响应的资源是否被允许与给定的来源（origin）共享。
   * 默认值：未开启凭证时回写请求报头 `Origin`；开启凭证时必须显式配置，否则抛错
   * - 字符串：直接作为允许来源；空字符串表示禁用 CORS；不包含凭据时也可设为 `*`，表示同意任意跨源请求
   * - 数组：白名单模式；仅当请求 `Origin` 命中列表时回写该来源（精确匹配，无 URL 规范化）
   * - 函数：按请求动态返回允许来源（或 `undefined` / `''` 禁用）；开启凭证时勿盲反射请求 `Origin`
   */
  origin?:
    | string
    | string[]
    | ((ctx: WebContext) => string | undefined | Promise<string | undefined>);

  /**
   * 设置报头 Access-Control-Allow-Methods，表示客户端所要访问的资源允许使用的方法或方法列表。
   * 默认值：`GET,HEAD,PUT,POST,DELETE,PATCH`
   */
  allowMethods?: string[] | string;

  /**
   * 设置报头 Access-Control-Expose-Headers，指示哪些响应报头可暴露给浏览器脚本。
   * 默认值：不设置该报头（浏览器仅暴露 CORS 安全列表：`Cache-Control`、`Content-Language`、`Content-Length`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`）
   *
   * ```typescript
   * cors({
   *   exposeHeaders: ['Content-Encoding', 'Kuma-Revision'],
   * });
   * ```
   *
   * @see https://developer.mozilla.org/zh_CN/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
   */
  exposeHeaders?: string[] | string;

  /**
   * 设置报头 Access-Control-Allow-Headers。
   * 默认值：镜像请求报头 `Access-Control-Request-Headers`
   */
  allowHeaders?: string[] | string;

  /**
   * 设置报头 Access-Control-Max-Age，表示 `Access-Control-Allow-Methods` 与 `Access-Control-Allow-Headers` 可被缓存的最长时间。
   * 默认值：`3600`（单位：秒）
   *
   * 若为 `-1`，表示禁用缓存，每次请求前都需要 OPTIONS 预检
   */
  maxAge?: number | string;

  /**
   * 设置报头 Access-Control-Allow-Credentials。Credentials 可代表 cookies、authorization headers 或 TLS client certificates，需与客户端 `XMLHttpRequest.withCredentials` 或 Fetch `credentials` 配合使用。
   * 默认值：`false`
   *
   * 规范禁止 `Access-Control-Allow-Origin: *` 与凭证同时出现。开启凭证时必须显式配置具体来源（字符串 / 白名单 / 返回具体来源的函数）：
   * - 未配置 `origin`：直接抛错（静态 `credentials: true` 在创建时抛；`credentials` 为函数且返回 `true` 时在请求阶段抛）
   * - 解析结果为 `*`（含静态配置与函数返回）：直接抛错
   */
  credentials?: ((ctx: WebContext) => boolean | Promise<boolean>) | boolean;

  /**
   * 响应增加 `Cross-Origin-Opener-Policy` 与 `Cross-Origin-Embedder-Policy` 报头。
   * 默认值：`false`
   *
   * @see https://developer.mozilla.org/en_US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
   */
  secureContext?: boolean;

  /**
   * 处理请求报头 `Access-Control-Request-Private-Network`，并返回 `Access-Control-Allow-Private-Network`。
   * 默认值：`false`
   *
   * @link https://github.com/WICG/private-network-access
   */
  privateNetworkAccess?: boolean;
}

/**
 * `CORS`，全称Cross-Origin Resource Sharing，是一种允许当前域（domain）的资源（比如html/js/web service）被其他域（domain）的脚本请求访问的机制，通常由于同域安全策略（the same-origin security policy），浏览器会禁止跨域请求。
 */
export const cors = (options: CorsOptions = {}): WebMiddleware => {
  // 是否显式传了 origin（含空数组 / 函数）；与「漏配」区分
  const originConfigured = options.origin !== undefined;

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

  // 静态非法组合尽早失败，避免带着错误配置启动
  if (options.credentials === true) {
    if (!originConfigured) {
      throw new Error(i18n.t('credentials_without_origin'));
    }
    if (options.origin === '*') {
      throw new Error(i18n.t('credentials_with_wildcard_origin'));
    }
  }

  return middleware.web(async (ctx, next) => {
    const { request, response } = ctx;
    const originHeader = request.headers['origin'];
    // 多值 Origin 视为不可信，不参与匹配与回写
    const requestOrigin = typeof originHeader === 'string' ? originHeader : undefined;

    // 如果服务器未使用通配符“*”，而是指定了明确的来源，那么为了向客户端表明服务器的返回会根据 Origin 请求报头而有所不同，必须在 Vary 响应报头中包含 Origin
    response.vary('Origin');

    let credentials: boolean;
    if (typeof options.credentials === 'function') {
      credentials = await options.credentials(ctx);
    } else {
      credentials = !!options.credentials;
    }

    // credentials 为函数且返回 true、同时又漏配 origin：请求阶段抛错
    if (credentials && !originConfigured) {
      throw new Error(i18n.t('credentials_without_origin'));
    }

    let origin: string | undefined;
    if (typeof options.origin === 'function') {
      origin = await options.origin(ctx);
    } else if (Array.isArray(options.origin)) {
      // 白名单精确匹配，命中后回写请求 Origin（规范不允许对凭证请求返回多个来源）
      origin =
        requestOrigin && options.origin.includes(requestOrigin)
          ? requestOrigin
          : undefined;
    } else if (typeof options.origin === 'string') {
      // 含空字符串：显式禁用，不得落到默认反射
      origin = options.origin || undefined;
    } else {
      // 未配置 origin：回写请求 Origin（公开跨域默认；开凭证时已在上方抛错）
      origin = requestOrigin;
    }
    if (!origin) return next();
    // 动态解析后仍可能出现 credentials + *（函数返回）
    if (credentials && origin === '*') {
      throw new Error(i18n.t('credentials_with_wildcard_origin'));
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

    return next().catch((e) => {
      const err = HttpError.from(e);
      const errHeaders = err.headers || {};
      const varyWithOrigin = vary.append(
        String(errHeaders['vary'] || errHeaders['Vary'] || ''),
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
