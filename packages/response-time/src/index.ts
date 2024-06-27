import { middleware } from '@aomex/core';
import type { HttpError } from '@aomex/web';

const getDelta = (start: [number, number]) => {
  const deltas = process.hrtime(start);
  return deltas[0] * 1_000 + deltas[1] / 1_000_000 + 'ms';
};

export const responseTime = middleware.web((ctx, next) => {
  const start = process.hrtime();
  return next()
    .then(() => {
      ctx.response.setHeader('x-response-time', getDelta(start));
    })
    .catch((err: HttpError) => {
      err.headers = {
        ...err.headers,
        'x-response-time': getDelta(start),
      };
      return Promise.reject(err);
    });
});
