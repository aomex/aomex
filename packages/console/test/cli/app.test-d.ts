import { type TypeEqual, expectType } from 'ts-expect';
import { ConsoleApp, ConsoleContext } from '../../src';
import { TestConsoleApp, TestConsoleLoggerService } from '../../src/testing';
import { combineServices, middleware, Service } from '@aomex/common';

// @ts-expect-error services/logger 必填
new ConsoleApp();
// @ts-expect-error services/logger 必填
new ConsoleApp({});

{
  const services = await combineServices({
    logger: async () => TestConsoleLoggerService,
  });
  const app = new ConsoleApp({ services, logger: services.logger });

  // 挂载
  {
    new ConsoleApp({ services, logger: services.logger, mount: undefined });
    new ConsoleApp({ services, logger: services.logger, mount: [] });
    new ConsoleApp({
      services,
      logger: services.logger,
      mount: [middleware.console(() => {}), middleware.mixin(() => {})],
    });
    // @ts-expect-error
    new ConsoleApp({ services, logger: services.logger, mount: {} });
  }

  // services / logger
  {
    class Demo extends Service {
      ping() {
        return 1;
      }
    }
    const withoutLogger = await combineServices({ demo: async () => Demo });
    // @ts-expect-error 缺少 logger
    new ConsoleApp({ services: withoutLogger });

    const withLogger = await combineServices({
      logger: async () => TestConsoleLoggerService,
      demo: async () => Demo,
    });
    new ConsoleApp({ services: withLogger, logger: withLogger.logger });
    new ConsoleApp({ services: [withLogger], logger: withLogger.logger });
    // @ts-expect-error
    new ConsoleApp({ services: 1, logger: withLogger.logger });
    // @ts-expect-error
    new ConsoleApp({ services: withLogger, logger: 1 });
  }

  // TestConsoleApp：services/logger 选填
  {
    new TestConsoleApp();
    new TestConsoleApp({});
    new TestConsoleApp({ mount: [] });
  }

  // 事件
  {
    app.on('error', (err, ctx, level) => {
      expectType<TypeEqual<Error, typeof err>>(true);
      expectType<TypeEqual<ConsoleContext & ConsoleApp.Props, typeof ctx>>(true);
      expectType<TypeEqual<number, typeof level>>(true);
    });

    // @ts-expect-error
    app.on('error1', () => {});
  }

  // 执行
  {
    app.run();
    app.run('--foo', 'bar');
    // @ts-expect-error
    app.run([]);
  }

  // 结果
  {
    const code = await app.run();
    expectType<TypeEqual<0 | 1, typeof code>>(true);
  }

  // ctx.logger
  {
    const ctx = null as unknown as ConsoleContext;
    expectType<TypeEqual<ConsoleApp.Logger, typeof ctx.logger>>(true);
    expectType<TypeEqual<ConsoleApp.Logger, (typeof app)['logger']>>(true);
  }
}
