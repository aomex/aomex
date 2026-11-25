import { Logger, ConsoleTransport } from '@aomex/logger';
import type { WebApp } from '@aomex/web';
import { WebsocketApp, type WebsocketAppOptions } from './app';
import type { SocketMiddlewareToken } from './channel';
// 注册 middleware.socket（与 @aomex/websocket 主入口对齐）
import './override/socket-middleware';

/** 测试用 logger：输出到 console（生命周期由 Logger 内部 `ensureReady` 登记） */
export const createTestWebsocketLogger = () =>
  new Logger({
    transports: [{ transport: new ConsoleTransport() }],
  });

const defaultLogger = createTestWebsocketLogger();

/** 测试默认：固定简体中文 */
const defaultLanguage = {
  mode: 'fixed',
  language: 'zh-CN',
} as const satisfies WebApp.LanguageOption;

export namespace TestWebsocketApp {
  export type Option<T extends SocketMiddlewareToken[] | [] = []> = Omit<
    WebsocketAppOptions<T>,
    'logger' | 'language'
  > & {
    logger?: Logger;
    language?: WebApp.LanguageOption;
  };
}

/**
 * 测试专用 WebsocketApp：`logger` / `language` 选填并带默认值。
 * `transport` 仍必填。
 *
 * ```ts
 * new TestWebsocketApp({ transport });
 * new TestWebsocketApp({
 *   transport,
 *   language: { mode: 'fixed', language: 'en-US' },
 * });
 * ```
 */
export class TestWebsocketApp<
  T extends SocketMiddlewareToken[] | [] = any[],
> extends WebsocketApp<T> {
  constructor(options: TestWebsocketApp.Option<T>) {
    super({
      ...options,
      logger: options.logger ?? defaultLogger,
      language: options.language ?? defaultLanguage,
    });
  }
}
