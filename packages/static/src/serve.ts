import { middleware } from '@aomex/core';
import type { HttpError, WebMiddleware } from '@aomex/web';
import { send, type SendOptions } from './send';

export interface StaticServeOptions extends SendOptions {
  /**
   * If true, serves after `await next()`, allowing any downstream middleware to respond first.
   *
   * Defaults `false`
   */
  defer?: boolean;
}

export const serve = (options: StaticServeOptions = {}): WebMiddleware => {
  if (options.defer) {
    return middleware.web(async (ctx, next) => {
      await next();
      const { request, response } = ctx;
      if (request.method !== 'HEAD' && request.method !== 'GET') return;
      if (response.body != null) return;
      if (response.statusCode !== 404) return;
      return send(ctx, options);
    });
  }

  return middleware.web(async (ctx, next) => {
    const { request } = ctx;
    if (request.method === 'HEAD' || request.method === 'GET') {
      try {
        await send(ctx, options);
      } catch (err) {
        if ((err as HttpError).status === 404) return next();
        throw err;
      }
    } else {
      return next();
    }
  });
};
