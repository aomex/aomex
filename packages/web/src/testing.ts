import { type CombinedServices } from '@aomex/common';
import { toArray } from '@aomex/internal-tools';
import { Logger, ConsoleTransport } from '@aomex/logger';
import { WebApp } from './http/app';
import type { WebMiddlewareToken } from './override';
// 注册 middleware.web（与 @aomex/web 主入口对齐）
import './override/web-middleware.js';

/** 测试用 logger：输出到 console（生命周期由 Logger 内部 `ensureReady` 登记） */
export const createTestWebLogger = () =>
  new Logger({
    transports: [{ transport: new ConsoleTransport() }],
  });

const defaultLogger = createTestWebLogger();

/** 测试默认：整站简体 */
const defaultLanguage = {
  mode: 'fixed',
  language: 'zh-CN',
} as const satisfies WebApp.LanguageOption;

/** 测试默认：探测常见代理头 */
const defaultProxyIP = {
  mode: 'detect',
} as const satisfies WebApp.ProxyIPOption;

export namespace TestWebApp {
  export type Option<T extends WebMiddlewareToken[] | [] = []> = Omit<
    WebApp.Option<T>,
    'services' | 'logger' | 'language' | 'proxyIP'
  > & {
    services?: CombinedServices | readonly CombinedServices[];
    logger?: Logger;
    language?: WebApp.LanguageOption;
    proxyIP?: WebApp.ProxyIPOption;
  };
}

/**
 * 测试专用 WebApp：`services` / `logger` / `language` / `proxyIP` 选填并带默认值。
 *
 * ```ts
 * new TestWebApp({ mount: [md] });
 * new TestWebApp({ services, logger, mount: [md] });
 * ```
 */
export class TestWebApp<T extends WebMiddlewareToken[] | [] = any[]> extends WebApp<T> {
  constructor(options: TestWebApp.Option<T> = {}) {
    super({
      ...options,
      services: toArray(options.services ?? []),
      logger: options.logger ?? defaultLogger,
      language: options.language ?? defaultLanguage,
      proxyIP: options.proxyIP ?? defaultProxyIP,
    });
  }
}
