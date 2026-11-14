import { combineServices, type CombinedServices, type I18nLanguage } from '@aomex/common';
import { toArray } from '@aomex/internal-tools';
import { BaseLoggerService, ConsoleTransport } from '@aomex/logger';
import { ConsoleApp } from './cli/app';
import type { ConsoleMiddlewareToken } from './override';
// 注册 middleware.console（与 @aomex/console 主入口对齐）
import './override/console-middleware.js';

/** 测试默认 logger：输出到 console */
export class TestConsoleLoggerService extends BaseLoggerService {
  protected createTransports() {
    return [{ transport: new ConsoleTransport() }];
  }
}

const defaultLoggerServices = await combineServices(
  { logger: async () => TestConsoleLoggerService },
  { eager: ['logger'] },
);

/** 测试默认：整站简体 */
const defaultLanguage = 'zh-CN' as const satisfies I18nLanguage;

export namespace TestConsoleApp {
  export type Option<T extends ConsoleMiddlewareToken[] | [] = []> = Omit<
    ConsoleApp.Option<T>,
    'services' | 'logger' | 'language'
  > & {
    services?: CombinedServices | readonly CombinedServices[];
    logger?: ConsoleApp.Logger;
    language?: I18nLanguage;
  };
}

/**
 * 测试专用 ConsoleApp：`services` / `logger` / `language` 选填并带默认值。
 *
 * ```ts
 * new TestConsoleApp({ mount: [md] });
 * new TestConsoleApp({ services, logger: services.logger, mount: [md] });
 * ```
 */
export class TestConsoleApp<
  T extends ConsoleMiddlewareToken[] | [] = any[],
> extends ConsoleApp<T> {
  constructor(options: TestConsoleApp.Option<T> = {}) {
    super({
      ...options,
      services: toArray(options.services ?? []).concat(defaultLoggerServices),
      logger: options.logger ?? defaultLoggerServices.logger,
      language: options.language ?? defaultLanguage,
    });
  }
}
