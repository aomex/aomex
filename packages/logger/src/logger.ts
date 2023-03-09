import { Readable } from 'node:stream';
import util from 'node:util';
import { middleware } from '@aomex/core';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { Counter } from './counter';
import { format } from './format';
import { FormatToken } from './format-token';

type Printer = (message: string, ...args: any[]) => any;

export interface LoggerOptions {
  /**
   * Defaults `  [request] [method] [url]`
   */
  requestFormat?: string | false;
  /**
   * Defaults `  [response] [method] [url] [statusCode] [time] [contentLength]`
   */
  responseFormat?: string | false;
  printer?: Printer;
  customTokens?: { [key: string]: (ctx: WebContext) => string };
}

const defaultPrinter: Printer = (message, ...args) => {
  console.log(util.format(message, ...args));
};

const defaultRequestFormat = `  ${FormatToken.request} ${FormatToken.method} ${FormatToken.url}`;
const defaultResponseFormat = `  ${FormatToken.request} ${FormatToken.method} ${FormatToken.url} ${FormatToken.statusCode} ${FormatToken.time} ${FormatToken.contentLength}`;

export const logger = (options: LoggerOptions = {}): WebMiddleware => {
  const {
    requestFormat = defaultRequestFormat,
    responseFormat = defaultResponseFormat,
    printer = defaultPrinter,
    customTokens,
  } = options;

  return middleware.web(async (ctx, next) => {
    const start = process.hrtime();
    const {
      request: { method, url },
      response,
    } = ctx;
    const tokens = customTokens
      ? Object.fromEntries(
          Object.entries(customTokens).map(([key, value]) => {
            return [key, value.bind(null, ctx)];
          }),
        )
      : {};

    if (requestFormat) {
      printer(
        ...format({
          message: requestFormat!,
          tokens,
          startTime: start,
          method,
          url,
        }),
      );
    }

    if (!responseFormat) return next();

    ctx.app.on('error', onError);
    await next();
    ctx.app.off('error', onError);

    const body = response.body;
    let counter: Counter;

    if (body instanceof Readable && body.readable) {
      ctx.send(body.pipe((counter = new Counter())));
    }

    const onfinish = onDone.bind(null, 'finish');
    const onclose = onDone.bind(null, 'close');
    response.once('finish', onfinish);
    response.once('close', onclose);

    function onError() {
      printer(
        ...format({
          message: responseFormat as string,
          tokens,
          startTime: start,
          method,
          url,
          statusCode: response.statusCode,
          contentLength: response.contentLength,
        }),
      );
    }

    function onDone(event: 'finish' | 'close') {
      response.off('finish', onfinish);
      response.off('close', onclose);
      printer(
        ...format({
          message: responseFormat as string,
          tokens,
          startTime: start,
          method,
          url,
          statusCode: response.statusCode,
          contentLength: counter ? counter.length : response.contentLength,
          finished: event === 'finish',
        }),
      );
    }
  });
};
