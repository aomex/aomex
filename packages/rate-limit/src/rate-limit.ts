import { middleware } from '@aomex/core';
import { statuses, type WebContext, type WebMiddleware } from '@aomex/web';
import type { RateLimitStore } from './store';
import { RateLimitMemoryStore } from './memory-store';

export interface RateLimitOptions {
  /**
   * 存储和共享请求记录。默认值：`RateLimitMemoryStore`
   */
  store?: RateLimitStore;

  /**
   * 限速时间周期。单位：`ms`。默认值：`3600 * 1000`(1小时)
   */
  duration?: number;

  /**
   * 一个客户端（根据id字段）在一个时间周期内的最大可请求数量
   */
  maxRequest?: number;

  /**
   * 请求客户端的身份识别信息，默认使用客户端的IP地址。如果返回`false`，则代表该请求不需要限速
   */
  id?: (ctx: WebContext) => string | false;

  /**
   * 被限速（状态码：429）时响应的报错信息
   */
  errorMessage?: string;

  /**
   * 相关的响应头部名称。如果传入`false`，则代表不设置
   */
  headers?:
    | false
    | {
        /**
         * 指定时间段内剩下的请求次数。默认名称：`X-RateLimit-Remaining`
         */
        remaining?: string;
        /**
         * 以UTC秒为单位，限流重置之前的剩余时间。默认名称：`X-RateLimit-Reset`
         */
        reset?: string;
        /**
         * 指定时间内允许的最大请求次数。默认名称：`X-RateLimit-Limit`
         */
        total?: string;
      };

  /**
   * 白名单，不做请求频率限制
   */
  allowList?: (ctx: WebContext) => boolean | Promise<boolean>;

  /**
   * 黑名单，直接抛出`403`状态码
   */
  denyList?: (ctx: WebContext) => boolean | Promise<boolean>;
}

export const rateLimit = (options: RateLimitOptions = {}): WebMiddleware => {
  const {
    store = new RateLimitMemoryStore(),
    duration = 3600 * 1_000, // 1小时
    maxRequest = 2500,
    id: getId = (ctx) => ctx.request.ip,
    headers: headerNames = {},
    denyList = () => false,
    allowList = () => false,
  } = options;

  return middleware.web(async (ctx, next) => {
    if (await denyList(ctx)) ctx.throw(403, 'denied');

    const id = getId(ctx);
    if (id === false || (await allowList(ctx))) return next();

    const state = await store.getAndSet({
      key: `aomex-rate-limit:${id}`,
      maxRequest,
      duration,
    });

    const headers: Record<string, number> = {};
    if (headerNames !== false) {
      headers[headerNames.remaining || 'X-RateLimit-Remaining'] = Math.max(
        0,
        state.remaining - 1,
      );
      headers[headerNames.reset || 'X-RateLimit-Reset'] = Math.floor(
        state.resetAt / 1_000_000,
      );
      headers[headerNames.total || 'X-RateLimit-Limit'] = maxRequest;
      ctx.response.setHeaders(headers);
    }

    if (state.remaining) return next();

    headers['Retry-After'] = Math.round((state.resetAt / 1000 - Date.now()) / 1000);
    ctx.throw(429, options.errorMessage || statuses.message[429], { headers });
  });
};
