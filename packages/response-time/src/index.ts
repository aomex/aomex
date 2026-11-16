import { middleware } from '@aomex/common';
import { type HttpError, type WebMiddleware } from '@aomex/web';

const getDelta = (start: [number, number]) => {
  const deltas = process.hrtime(start);
  return deltas[0] * 1_000 + deltas[1] / 1_000_000 + 'ms';
};

// 显式返回 WebMiddleware：避免 .d.ts 写成 import("@aomex/web").WebMiddleware
export const responseTime = (): WebMiddleware => {
  return middleware.web((ctx, next) => {
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
};
