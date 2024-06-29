import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';
import { send, type SendOptions } from './send';

export const serveStatic = (options: SendOptions): WebMiddleware => {
  return middleware.web(async (ctx, next) => {
    const method = ctx.request.method;
    if (method === 'GET' || method === 'HEAD') {
      if (await send(ctx, options)) return;
    }

    return next();
  });
};
