import { ReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import calculate from 'etag';
import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';

export const etag = (options: calculate.Options = {}): WebMiddleware => {
  return middleware.web(async (ctx, next) => {
    await next();

    const { response, request } = ctx;
    const { body } = response;

    if (body === null || response.hasHeader('Etag')) return;
    if (response.statusCode < 200 || response.statusCode > 299) return;

    let entity: Parameters<typeof calculate>[0];
    if (body instanceof ReadStream) {
      entity = await stat(body.path);
    } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
      entity = body;
    } else {
      entity = JSON.stringify(body);
    }

    if (entity) {
      response.setHeader('Etag', calculate(entity, options));
    }

    if (request.fresh) {
      ctx.send(304, null);
    }
  });
};
