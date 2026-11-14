import { combineServices, type CombinedServices } from '@aomex/common';
import { toArray } from '@aomex/internal-tools';
import { BaseLoggerService, ConsoleTransport } from '@aomex/logger';
import { WebApp } from './http/app';
import type { WebMiddlewareToken } from './override';
// 注册 middleware.web（与 @aomex/web 主入口对齐）
import './override/web-middleware.js';

/** 测试默认 logger：输出到 console */
export class TestWebLoggerService extends BaseLoggerService {
  protected createTransports() {
    return [{ transport: new ConsoleTransport() }];
  }
}

const defaultLoggerServices = await combineServices(
  { logger: async () => TestWebLoggerService },
  { eager: ['logger'] },
);

export namespace TestWebApp {
  export type Option<T extends WebMiddlewareToken[] | [] = []> = Omit<
    WebApp.Option<T>,
    'services' | 'logger'
  > & {
    services?: CombinedServices | readonly CombinedServices[];
    logger?: WebApp.Logger;
  };
}

/**
 * 测试专用 WebApp：仅将 `services` / `logger` 改为选填，其余与 `WebApp` 一致。
 * 未传 `logger` 时用默认袋；`defaultLoggerServices` 始终 `concat` 进 `services`。
 *
 * ```ts
 * new TestWebApp({ mount: [md] });
 * new TestWebApp({ services, logger: services.logger, mount: [md] });
 * ```
 */
export class TestWebApp<T extends WebMiddlewareToken[] | [] = any[]> extends WebApp<T> {
  constructor(options: TestWebApp.Option<T> = {}) {
    super({
      ...options,
      services: toArray(options.services ?? []).concat(defaultLoggerServices),
      logger: options.logger ?? defaultLoggerServices.logger,
    });
  }
}
