import { middleware } from '@aomex/core';
import type { WebMiddleware } from '@aomex/web';
import { Readable } from 'node:stream';
import StreamStringify from 'streaming-json-stringify';

export interface PrettyJsonOptions {
  /**
   * 是否启用中间件。默认值：`true`
   */
  enable?: boolean;
  /**
   * 在查询字符串找到指定的key时，强制启用中间件
   * - example.com?pretty
   */
  query?: string;
  /**
   * 每行缩进空格数量。默认值：`2`
   * ```typescript
   * JSON.stringify({}, null, spaces)
   * ```
   */
  spaces?: number;
}

/**
 * 美化输出的JSON数据
 */
export const prettyJson = (options: PrettyJsonOptions = {}): WebMiddleware => {
  const { enable = true, spaces = 2, query } = options;

  return middleware.web(async (ctx, next) => {
    await next();

    const { request, response } = ctx;
    const { body } = response;
    const prettify = enable || (query && Object.hasOwn(request.query, query));

    if (!prettify) return;

    if (body instanceof Readable && body.readableObjectMode) {
      response.contentType = 'json';
      response.body = body.pipe(StreamStringify({ space: spaces }));
    } else if (response.isJSON(body)) {
      response.contentType = 'json';
      response.body = JSON.stringify(body, null, spaces);
    }
  });
};
