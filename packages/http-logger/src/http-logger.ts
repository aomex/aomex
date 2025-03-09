import { middleware } from '@aomex/common';
import { Logger, LoggerTransport } from '@aomex/logger';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { HttpLoggerToken } from './http-logger-token';
import { Counter } from './counter';
import stream from 'node:stream';
import { replaceToken } from './replace-token';

export interface HttpLoggerOptions {
  /**
   * 是否禁用请求日志。默认：`false`
   */
  disable?: boolean;
  /**
   * 响应输出格式，建议使用 **HttpLoggerToken** 拼接。默认值：`[ip] [method] [url] [statusCode] [duration] [contentLength]`
   */
  format?: string;
  /**
   * 日志输出端口。默认使用 `Logger.transport.Console`。
   */
  transports?: LoggerTransport[];
  /**
   * 自定义关键词
   * ```
   * requestLogger({
   *   format: ' [request] [time] [href]'
   *   customTokens: {
   *     href: (ctx) => ctx.request.href,
   *   }
   * })
   * ```
   */
  customTokens?: { [key: string]: (ctx: WebContext) => string | Promise<string> };
}

export const httpLogger = (options: HttpLoggerOptions = {}): WebMiddleware => {
  const { disable = false, customTokens } = options;
  const format =
    options.format ||
    `${HttpLoggerToken.ip} ${HttpLoggerToken.method} ${HttpLoggerToken.url} ${HttpLoggerToken.statusCode} ${HttpLoggerToken.duration} ${HttpLoggerToken.contentLength}`;

  let transports = options.transports;
  if (!transports || transports.length === 0) {
    transports = [new Logger.transports.Console()];
  }

  const logger = Logger.create({
    levels: ['http'],
    transports: transports.map((transport) => {
      return { transport, level: 'all' };
    }),
  });

  return middleware.web(async (ctx, next) => {
    if (disable || logger.countTransports('http') === 0) return next();

    const start = process.hrtime();
    const tokens = customTokens
      ? Object.fromEntries(
          Object.entries(customTokens).map(([key, value]) => {
            return [key, value.bind(null, ctx)];
          }),
        )
      : {};

    try {
      await next();
    } finally {
      const {
        response,
        response: { body },
      } = ctx;
      let counter: Counter | undefined;
      if (body instanceof stream.Readable && body.readable) {
        ctx.send(body.pipe((counter = new Counter())));
      }

      response.once('close', async () => {
        logger.http(
          await replaceToken({
            message: format,
            tokens,
            startTime: start,
            request: ctx.request,
            response: {
              statusCode: response.statusCode,
              contentType: response.contentType,
              contentLength: counter ? counter.length : response.contentLength,
            },
          }),
        );
      });
    }
  });
};
