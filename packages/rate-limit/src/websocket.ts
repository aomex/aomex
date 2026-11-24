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
  window?: DurationInput;
  /**
   * 窗口内允许的最大入站消息数（按 `id` 计）。默认：`2500`
   */
  limit?: number;
  /**
   * 身份。返回 `false` 表示这条消息不限速。
   * 默认：`ctx.client.request.ip`。同一 IP 上的多条连接共享配额。
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
 *     websocketRateLimit({ limit: 30, window: '10s' }),
 *     channels('./src/channels'),
 *   ],
 * });
 * ```
 */
export const websocketRateLimit = (options: WebsocketRateLimitOptions = {}) => {
  const {
    store = new RateLimitMemoryStore(),
    limit = 2500,
    id: getId = (ctx) => ctx.client.request.ip,
    denyList = () => false,
    allowList = () => false,
  } = options;
  const windowMs = parseDuration(options.window ?? '1 hour');
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
      limit,
      window: windowMs,
    });
    if (state.remaining) return next();

    await ctx.client.send('error', {
      message: options.errorMessage || i18n.t('too_many_requests'),
    });
  });
};
