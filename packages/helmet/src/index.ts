import { promisify } from 'node:util';
import originHelmet, { type HelmetOptions } from 'helmet';
import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';

export const helmet = (options?: HelmetOptions): WebMiddleware => {
  const helmetAsync = promisify(originHelmet(options));

  return middleware.web((ctx, next) => {
    return helmetAsync(ctx.request, ctx.response).then(next);
  });
};
