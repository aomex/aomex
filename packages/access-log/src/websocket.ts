import '@aomex/websocket';
import type { WebsocketContext } from '@aomex/websocket';
import { middleware } from '@aomex/common';
import { BaseLoggerService, ConsoleTransport, type Transport } from '@aomex/logger';
import { replaceWebsocketToken } from './replace-websocket-token';
import { WebsocketAccessLogToken } from './websocket-token';

export interface WebsocketAccessLogOptions {
  /**
   * 是否禁用入站日志。默认：`false`
   */
  disabled?: boolean;
  /**
   * 输出格式，建议使用 **WebsocketAccessLogToken** 拼接。
   * 默认：`[ip] [clientId] [event] [duration]`
   */
  format?: string;
  /**
   * 日志输出端口。默认使用 `ConsoleTransport`；传空数组相当于禁用。
   */
  transports?: Transport[];
  /**
   * 自定义关键词
   * ```
   * websocketAccessLog({
   *   format: '[event] [room]',
   *   customTokens: {
   *     room: (ctx) => String(ctx.client.data['room'] ?? '-'),
   *   },
   * })
   * ```
   */
  customTokens?: {
    [key: string]: (ctx: WebsocketContext) => string | Promise<string>;
  };
}

class WebsocketAccessLogService extends BaseLoggerService {
  constructor(private readonly entries: BaseLoggerService.TransportEntry[]) {
    super();
  }

  protected createTransports(): BaseLoggerService.TransportEntry[] {
    return this.entries;
  }
}

/**
 * 入站消息访问日志。挂在 `WebsocketApp.mount` 里、`channels()` 前面。
 * 每条入站消息在中间件链结束后打一条日志（含抛错路径）。
 *
 * ```ts
 * import { websocketAccessLog } from '@aomex/access-log/websocket';
 * import { WebsocketApp, channels } from '@aomex/websocket';
 *
 * new WebsocketApp({
 *   logger,
 *   language,
 *   transport,
 *   mount: [websocketAccessLog(), channels('./src/channels')],
 * });
 * ```
 */
export const websocketAccessLog = (options: WebsocketAccessLogOptions = {}) => {
  const { disabled = false, customTokens } = options;
  const format =
    options.format ||
    `${WebsocketAccessLogToken.ip} ${WebsocketAccessLogToken.clientId} ${WebsocketAccessLogToken.event} ${WebsocketAccessLogToken.duration}`;

  const transportList = options.transports ?? [new ConsoleTransport()];

  const logger = new WebsocketAccessLogService(
    transportList.map((transport) => ({ transport })),
  );

  return middleware.socket(async (ctx, next) => {
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
      // 打日志失败不得掩盖 next() 的业务异常
      try {
        logger.info(
          await replaceWebsocketToken({
            message: format,
            tokens,
            startTime: start,
            ip: ctx.client.request?.ip ?? '',
            clientId: ctx.client.id,
            event: ctx.event,
          }),
        );
      } catch {
        // 访问日志失败静默忽略
      }
    }
  });
};

export { WebsocketAccessLogToken } from './websocket-token';
