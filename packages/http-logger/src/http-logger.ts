import { middleware } from '@aomex/common';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { HttpLoggerToken } from './http-logger-token';
import { Counter } from './counter';
import stream from 'node:stream';
import { replaceToken } from './replace-token';

export interface HttpLoggerOptions {
  /**
   * 请求输出格式，建议使用 **HttpLoggerToken** 拼接。默认值：`[time] [request] [ip] [method] [url]`
   */
  requestFormat?: string | false;
  /**
   * 响应输出格式，建议使用 **HttpLoggerToken** 拼接。默认值：`[time] [response] [ip] [method] [url] [statusCode] [duration] [contentLength]`
   */
  responseFormat?: string | false;
  /**
   * 日志输出。默认使用 `console.log`。
   * 日志携带了颜色标记，如果想清除颜色，请使用`util.stripVTControlCharacters(message)` 过滤掉ASCII编码字符。
   */
  printer?: (message: string) => void;
  /**
   * 自定义关键词
   * ```
   * requestLogger({
   *   requestFormat: ' [request] [time] [href]'
   *   customTokens: {
   *     href: (ctx) => ctx.request.href,
   *   }
   * })
   * ```
   */
  customTokens?: { [key: string]: (ctx: WebContext) => string | Promise<string> };
}

export const httpLogger = (options: HttpLoggerOptions = {}): WebMiddleware => {
  const {
    requestFormat = `[${HttpLoggerToken.time}] ${HttpLoggerToken.request} ${HttpLoggerToken.ip} ${HttpLoggerToken.method} ${HttpLoggerToken.url}`,
    responseFormat = `[${HttpLoggerToken.time}] ${HttpLoggerToken.response} ${HttpLoggerToken.ip} ${HttpLoggerToken.method} ${HttpLoggerToken.url} ${HttpLoggerToken.statusCode} ${HttpLoggerToken.duration} ${HttpLoggerToken.contentLength}`,
    customTokens,
    printer = console.log,
  } = options;

  return middleware.web(async (ctx, next) => {
    const start = process.hrtime();
    const tokens = customTokens
      ? Object.fromEntries(
          Object.entries(customTokens).map(([key, value]) => {
            return [key, value.bind(null, ctx)];
          }),
        )
      : {};

    if (requestFormat !== false) {
      printer(
        await replaceToken({
          message: requestFormat,
          tokens,
          startTime: start,
          request: ctx.request,
        }),
      );
    }

    if (responseFormat === false) return void next();

    const onError = async () => {
      printer(
        await replaceToken({
          message: responseFormat,
          tokens,
          startTime: start,
          request: ctx.request,
          response: ctx.response,
        }),
      );
    };

    ctx.app.on('error', onError);
    await next();
    ctx.app.off('error', onError);

    const {
      response,
      response: { body },
    } = ctx;
    let counter: Counter | undefined;
    if (body instanceof stream.Readable && body.readable) {
      ctx.send(body.pipe((counter = new Counter())));
    }

    const onDone = async (finished: boolean) => {
      response.off('finish', onfinish);
      response.off('close', onclose);
      printer(
        await replaceToken({
          message: responseFormat as string,
          tokens,
          startTime: start,
          request: ctx.request,
          finished,
          response: {
            statusCode: response.statusCode,
            contentType: response.contentType,
            contentLength: counter ? counter.length : response.contentLength,
          },
        }),
      );
    };

    const onfinish = onDone.bind(null, true);
    const onclose = onDone.bind(null, false);
    response.once('finish', onfinish);
    response.once('close', onclose);
  });
};
