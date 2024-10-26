import { ReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import calculate from 'etag';
import { middleware } from '@aomex/common';
import type { WebMiddleware } from '@aomex/web';
import { Stream } from 'node:stream';

export interface EtagOptions {
  /**
   * 是否增加 `W/` 前缀，即弱校验。默认：`false`
   *
   * 如果是ReadStream，则默认开启。
   */
  weak?: boolean | undefined;
}

export const etag = (options: EtagOptions = {}): WebMiddleware => {
  return middleware.web(async (ctx, next) => {
    await next();

    const { response, request } = ctx;
    const { method } = request;
    const { body, statusCode } = response;

    if (statusCode < 200 || statusCode > 299) return;
    if (method !== 'GET' && method !== 'HEAD') return;
    if (body === null || response.hasHeader('Etag')) return;

    let entity: Parameters<typeof calculate>[0] | undefined;
    if (body instanceof Stream) {
      if (body instanceof ReadStream) {
        entity = await stat(body.path);
      }
    } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
      entity = body;
    } else {
      entity = JSON.stringify(body);
    }

    if (!entity) return;

    response.setHeader('Etag', calculate(entity, options));
    request.fresh && ctx.send(304, null);
  });
};
