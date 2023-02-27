import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';
import { Readable } from 'node:stream';
import StreamStringify from 'streaming-json-stringify';

export interface PrettyJsonOptions {
  /**
   * Enable middleware. Defaults `true`
   */
  enable?: boolean;

  /**
   * force enable with a param in querystring.
   * - example.com?pretty
   */
  param?: string;

  /**
   * Indent every line. Defaults `2`
   */
  spaces?: number;
}

export const prettyJson = (options: PrettyJsonOptions = {}): WebMiddleware => {
  const { enable = true, spaces = 2, param } = options;

  return middleware.web(async (ctx, next) => {
    await next();
    const {
      request,
      response,
      response: { body },
    } = ctx;
    const prettify = enable || (param && Object.hasOwn(request.query, param));

    if (!prettify) return;

    if (body instanceof Readable && body.readableObjectMode) {
      response.contentType = 'json';
      ctx.send(body.pipe(StreamStringify({ space: spaces })));
    } else if (response.isJSON(body)) {
      ctx.send(JSON.stringify(body, null, spaces));
    }
  });
};
