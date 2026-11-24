import '@aomex/websocket';
import type { WebsocketContext } from '@aomex/websocket';
import {
  middleware,
  parseDuration,
  registerLifecycle,
  type DurationInput,
} from '@aomex/common';
import { i18n } from './i18n';
import { RateLimitMemoryStore } from './memory-store';
import type { RateLimitStore } from './store';

export interface WebsocketRateLimitOptions {
  /**
   * 存储和共享计数。默认 `RateLimitMemoryStore`。
   * 与 HTTP `rateLimit()` 共用同一个 store 时，键前缀不同，配额不混在一起。
   */
  store?: RateLimitStore;
  /**
   * 限速窗口。毫秒数或可读时长，如 `10_000`、`'10s'`、`'1 hour'`。
   * 默认：`'1 hour'`
   */
  duration?: DurationInput;
  /**
   * 一个身份在窗口内可处理的入站消息数。默认：`2500`
   */
  maxRequest?: number;
  /**
   * 身份。返回 `false` 表示这条消息不限速。
   * 默认：握手请求的 IP；没有 IP 时用 `ctx.client.id`。
   * 同一 IP 上的多条连接共享配额。
   */
  id?: (ctx: WebsocketContext) => string | false;
  /**
   * 超限时回推的文案。默认：`请求过于频繁`
   */
  errorMessage?: string;
  /**
   * 白名单。命中则不计数、不拦截。
   */
  allowList?: (ctx: WebsocketContext) => boolean | Promise<boolean>;
  /**
   * 黑名单。命中则回推「已拒绝」，不进入后续中间件，也不计数。
   */
  denyList?: (ctx: WebsocketContext) => boolean | Promise<boolean>;
}

/**
 * 入站消息限速。挂在 `WebsocketApp.mount` 里、`channels()` 前面。
 * 超限或命中黑名单时回推 `{ event: 'error', data: { message } }`，不调用 `next()`。
 * 连接保持打开。
 *
 * ```ts
 * import { websocketRateLimit } from '@aomex/rate-limit/websocket';
 * import { WebsocketApp, channels } from '@aomex/websocket';
 *
 * new WebsocketApp({
 *   logger,
 *   language,
 *   transport,
 *   mount: [
 *     websocketRateLimit({ maxRequest: 30, duration: '10s' }),
 *     channels('./src/channels'),
 *   ],
 * });
 * ```
 */
export const websocketRateLimit = (options: WebsocketRateLimitOptions = {}) => {
  const {
    store = new RateLimitMemoryStore(),
    maxRequest = 2500,
    id: getId = (ctx) => ctx.client.request?.ip || ctx.client.id,
    denyList = () => false,
    allowList = () => false,
  } = options;
  const duration = parseDuration(options.duration ?? '1 hour');
  let ready: Promise<void> | undefined;

  return middleware.socket(async (ctx, next) => {
    ready ??= registerLifecycle({
      onInit: () => store.onInit(),
      onDestroy: () => store.onDestroy(),
    });
    await ready;

    if (await denyList(ctx)) {
      await ctx.client.send('error', { message: i18n.t('denied') });
      return;
    }

    const id = getId(ctx);
    if (id === false || (await allowList(ctx))) return next();

    const state = await store.getAndSet({
      key: `aomex-rate-limit:ws:${id}`,
      maxRequest,
      duration,
    });
    if (state.remaining) return next();

    await ctx.client.send('error', {
      message: options.errorMessage || i18n.t('too_many_requests'),
    });
  });
};
