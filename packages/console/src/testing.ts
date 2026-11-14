import { combineServices, type CombinedServices } from '@aomex/common';
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

export namespace TestConsoleApp {
  export type Option<T extends ConsoleMiddlewareToken[] | [] = []> = Omit<
    ConsoleApp.Option<T>,
    'services' | 'logger'
  > & {
    services?: CombinedServices | readonly CombinedServices[];
    logger?: ConsoleApp.Logger;
  };
}

/**
 * 测试专用 ConsoleApp：仅将 `services` / `logger` 改为选填，其余与 `ConsoleApp` 一致。
 * 未传 `logger` 时用默认袋；`defaultLoggerServices` 始终 `concat` 进 `services`。
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
    });
  }
}
