import { randomBytes, timingSafeEqual } from 'node:crypto';
import { middleware } from '@aomex/common';
import {
  HttpError,
  type CookieSerializeOptions,
  type WebContext,
  type WebMiddleware,
} from '@aomex/web';
import { i18n } from './i18n';

/** Cookie / Header 中 token 允许的字符集（与 `base64url` 一致） */
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
/** `randomBytes(32).toString('base64url')` 的固定长度 */
const TOKEN_LENGTH = 43;

export namespace Csrf {
  export type CookieOptions = Omit<CookieSerializeOptions, 'encode' | 'httpOnly'> & {
    /**
     * Cookie 名。默认：`csrfToken`
     *
     * 该 Cookie 必须可被前端 JS 读取（强制 `HttpOnly=false`），以便写入请求头与 Cookie 做双提交校验。
     */
    name?: string;
  };

  export type Options = {
    /**
     * CSRF Cookie 配置。默认名 `csrfToken`；强制 `httpOnly: false`
     */
    cookie?: CookieOptions;
    /**
     * 客户端提交 token 的请求头名。默认：`x-csrf-token`
     */
    headerName?: string;
    /**
     * 跳过 CSRF 校验的 HTTP 方法（大小写不敏感）。默认：`GET`、`HEAD`、`OPTIONS`
     */
    ignoreMethods?: readonly string[];
    /**
     * 按请求跳过校验（如健康检查、外部 webhook）。返回 `true` 时跳过
     */
    ignore?: (ctx: WebContext) => boolean | Promise<boolean>;
  };
}

/**
 * CSRF 防护（双提交 Cookie）：签发可读 CSRF Cookie，非安全方法校验请求头与 Cookie 一致。
 * 只读 Header + Cookie，不接触请求体。
 *
 * ```ts
 * app.mount([csrf()]);
 * // 前端从 Cookie `csrfToken` 读取，写入请求头 `x-csrf-token`
 * // 服务端可通过 `ctx.csrfToken` 取当前 token
 * ```
 */
export const csrf = (
  options: Csrf.Options = {},
): WebMiddleware<{ readonly csrfToken: string }> => {
  const cookieName = options.cookie?.name || 'csrfToken';
  const headerName = (options.headerName || 'x-csrf-token').toLowerCase();
  const ignoreMethods = new Set(
    (options.ignoreMethods ?? ['GET', 'HEAD', 'OPTIONS']).map((m) => m.toUpperCase()),
  );
  const { name: _name, ...cookieAttrs } = options.cookie ?? {};

  return middleware.web({
    fn: async (ctx, next) => {
      let token = readCookieToken(ctx, cookieName);
      if (!token) {
        token = randomBytes(32).toString('base64url');
        ctx.response.setCookie(cookieName, token, {
          ...cookieAttrs,
          // 双提交要求前端可读；覆盖 setCookie 默认的 httpOnly: true
          httpOnly: false,
        });
      }
      ctx.csrfToken = token;

      if (ignoreMethods.has(ctx.request.method.toUpperCase())) {
        return next();
      }
      if (options.ignore && (await options.ignore(ctx))) {
        return next();
      }

      const submitted = readHeaderToken(ctx, headerName);
      if (!isValidToken(submitted) || !isSameToken(submitted, token)) {
        throwInvalid(ctx);
      }

      return next();
    },
  });
};

function isValidToken(value: string | undefined): value is string {
  return (
    typeof value === 'string' &&
    value.length === TOKEN_LENGTH &&
    TOKEN_PATTERN.test(value)
  );
}

function readCookieToken(ctx: WebContext, name: string): string | false {
  const value = ctx.request.cookies[name];
  if (typeof value !== 'string') return false;
  const token = value.trim();
  return isValidToken(token) ? token : false;
}

function readHeaderToken(ctx: WebContext, headerName: string): string | undefined {
  const raw = ctx.request.headers[headerName];
  if (typeof raw !== 'string') return undefined;
  const token = raw.trim();
  return token || undefined;
}

/** 调用方须先经 `isValidToken`，两侧长度已对齐 */
function isSameToken(a: string, b: string): boolean {
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/** onError / format-error 会清空已写报头；刚签发的 `Set-Cookie` 挂到错误上带回，便于客户端拿到 token 后重试 */
function throwInvalid(ctx: WebContext): never {
  const setCookie = ctx.response.getHeader('Set-Cookie');
  throw new HttpError(403, i18n.t('invalid_csrf_token'), {
    ...(setCookie ? { headers: { 'Set-Cookie': setCookie } } : null),
  });
}
