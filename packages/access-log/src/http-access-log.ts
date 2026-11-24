import { middleware } from '@aomex/common';
import { BaseLoggerService, ConsoleTransport, type Transport } from '@aomex/logger';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { HttpAccessLogToken } from './http-access-log-token';
import { Counter } from './counter';
import stream from 'node:stream';
import { replaceToken } from './replace-token';

export interface HttpAccessLogOptions {
  /**
   * 是否禁用请求日志。默认：`false`
   */
  disabled?: boolean;
  /**
   * 响应输出格式，建议使用 **HttpAccessLogToken** 拼接。默认值：`[ip] [method] [url] [statusCode] [duration] [contentLength]`
   */
  format?: string;
  /**
   * 日志输出端口。默认使用 `ConsoleTransport`；传空数组相当于禁用。
   */
  transports?: Transport[];
  /**
   * 自定义关键词
   * ```
   * httpAccessLog({
   *   format: ' [request] [time] [href]',
   *   customTokens: {
   *     href: (ctx) => ctx.request.href,
   *   },
   * })
   * ```
   */
  customTokens?: { [key: string]: (ctx: WebContext) => string | Promise<string> };
}

class HttpAccessLogService extends BaseLoggerService {
  constructor(private readonly entries: BaseLoggerService.TransportEntry[]) {
    super();
  }

  protected createTransports(): BaseLoggerService.TransportEntry[] {
    return this.entries;
  }
}

/**
 * HTTP 访问日志。挂在 `WebApp.mount` 里。
 */
export const httpAccessLog = (options: HttpAccessLogOptions = {}): WebMiddleware => {
  const { disabled = false, customTokens } = options;
  const format =
    options.format ||
    `${HttpAccessLogToken.ip} ${HttpAccessLogToken.method} ${HttpAccessLogToken.url} ${HttpAccessLogToken.statusCode} ${HttpAccessLogToken.duration} ${HttpAccessLogToken.contentLength}`;

  const transportList = options.transports ?? [new ConsoleTransport()];

  const logger = new HttpAccessLogService(
    transportList.map((transport) => ({ transport })),
  );

  return middleware.web(async (ctx, next) => {
    if (disabled || transportList.length === 0) return next();

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
        logger.info(
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
