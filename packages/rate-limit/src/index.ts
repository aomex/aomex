import { middleware, Cache, MemoryCache } from '@aomex/core';
import type { WebContext, WebMiddleware } from '@aomex/web';
import microtime from 'microtime';
import ms from 'ms';

export interface RateLimitOptions {
  /**
   * The database powering the backing rate-limiter package.
   */
  cache?: Cache;

  /**
   * The length of a single limiting period. This value is expressed
   * in milliseconds, defaulting to one hour.
   */
  duration?: number;

  /**
   * The maximum amount of requests a client (see the `id` field) may
   * make during a limiting period. (see `duration`)
   */
  max?: number;

  /**
   * Get the unique-identifier for a request. This defaults to the
   * client's IP address. Returning "false" will skip rate-limiting.
   */
  id?: (ctx: WebContext) => string | false;

  /**
   * Whether or not to disable the usage of rate limit headers. This defaults
   * to **false**.
   */
  disableHeader?: boolean;

  /**
   * The message used on the response body if a client is rate-limited. There is
   * a default message; which includes when they should try again.
   */
  errorMessage?: string;

  /**
   * Whether or not to throw an error upon being rate-limited. This uses
   * the `ctx.throw()`.
   */
  throw?: boolean;

  /**
   * A relation of header to the header's display name.
   */
  headers?: {
    /**
     * The amount of requests remaining in the current limiting period.
     */
    remaining?: string;

    /**
     * The time, expressed as a UNIX epoch timestamp, at which your rate-limit expires.
     */
    reset?: string;

    /**
     * The total amount of requests a client may make during a limiting period.
     */
    total?: string;
  };

  /**
   * If function returns true, middleware exits before limiting
   */
  allowList?: (ctx: WebContext) => boolean | Promise<boolean>;

  /**
   * If function returns true, 403 error is thrown
   */
  denyList?: (ctx: WebContext) => boolean | Promise<boolean>;
}

interface LimitState {
  id: string;
  reset: number;
  current: number;
  total: number;
}

const getState = async (
  cache: Cache,
  id: string,
  max: number,
  duration: number,
) => {
  const key = `ratelimit:${id}`;
  let state = await cache.get<LimitState>(key);
  const now = microtime.now();
  const expired = state && state.reset * 1e6 < now;

  if (!state || expired) {
    state = {
      id,
      reset: (now + duration * 1e3) / 1e6,
      current: max,
      total: max,
    };
  } else {
    state.current = state.current > 0 ? state.current - 1 : 0;
  }

  await cache.set(key, state);
  return state!;
};

export const rateLimit = (options: RateLimitOptions = {}): WebMiddleware => {
  const {
    cache = new MemoryCache(),
    duration = 3600 * 1000, // 1 hour
    max = 2500,
    id: getId = (ctx) => ctx.request.ip,
    headers = {},
    disableHeader = false,
    denyList,
    allowList,
  } = options;

  const {
    remaining = 'X-RateLimit-Remaining',
    reset = 'X-RateLimit-Reset',
    total = 'X-RateLimit-Limit',
  } = headers;

  return middleware.web(async (ctx, next) => {
    if (denyList && (await denyList(ctx))) {
      ctx.throw(403);
    }

    const id = getId(ctx);
    if (id === false || (allowList && (await allowList(ctx)))) {
      return next();
    }

    const { response } = ctx;
    const state = await getState(cache, id, max, duration);
    let headers: Record<string, number> = {};
    if (!disableHeader) {
      headers = {
        [remaining]: state.current > 0 ? state.current - 1 : 0,
        [reset]: state.reset,
        [total]: state.total,
      };
      response.setHeaders(headers);
    }

    if (state.current) return next();

    const now = Date.now();
    const delta = Math.round(state.reset * 1e3 - now);
    const after = Math.round(state.reset - now / 1e3);
    const status = 429;
    const body =
      options.errorMessage ||
      `Rate limit exceeded, retry in ${ms(delta, { long: true })}.`;

    response.setHeader('Retry-After', after);
    response.statusCode = status;

    if (options.throw) {
      ctx.throw(status, body, { headers });
    } else {
      ctx.send(body);
    }
  });
};
