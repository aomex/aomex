import { promisify } from 'node:util';
import originHelmet, { HelmetOptions } from 'helmet';
import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';

export const helmet = (options?: HelmetOptions): WebMiddleware => {
  const helmetPromise = promisify(originHelmet(options));

  return middleware.web((ctx, next) => {
    return helmetPromise(ctx.request, ctx.response).then(next);
  });
};
