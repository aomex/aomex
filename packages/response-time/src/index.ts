import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';

export interface ResponseTimeOptions {
  /**
   * Includes microseconds. Defaults `true`
   */
  hrtime?: boolean;
}

export const responseTime = (
  options: ResponseTimeOptions = {},
): WebMiddleware => {
  const { hrtime = true } = options;

  return middleware.web(async (ctx, next) => {
    const start = process.hrtime();

    try {
      await next();
    } finally {
      const deltas = process.hrtime(start);
      let delta = deltas[0] * 1000 + deltas[1] / 1000000;

      if (!hrtime) {
        delta = Math.round(delta);
      }

      ctx.response.setHeader('X-Response-Time', delta + 'ms');
    }
  });
};
