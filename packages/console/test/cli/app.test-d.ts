import { type TypeEqual, expectType } from 'ts-expect';
import { ConsoleApp, ConsoleContext, ConsoleError } from '../../src';
import { TestConsoleApp, TestConsoleLoggerService } from '../../src/testing';
import { combineServices, middleware, Service } from '@aomex/common';

const language = 'zh-CN' as const;

// @ts-expect-error services/logger/language 必填
new ConsoleApp();
// @ts-expect-error services/logger/language 必填
new ConsoleApp({});

{
  const services = await combineServices({
    logger: async () => TestConsoleLoggerService,
  });
  // @ts-expect-error 缺少 language
  new ConsoleApp({ services, logger: services.logger });
  const app = new ConsoleApp({ services, logger: services.logger, language });

  // language
  {
    new ConsoleApp({ services, logger: services.logger, language: 'en-US' });
    // @ts-expect-error
    new ConsoleApp({ services, logger: services.logger, language: 'zh_CN' });
  }

  // 挂载
  {
    new ConsoleApp({
      services,
      logger: services.logger,
      language,
      mount: undefined,
    });
    new ConsoleApp({ services, logger: services.logger, language, mount: [] });
    new ConsoleApp({
      services,
      logger: services.logger,
      language,
      mount: [middleware.console(() => {}), middleware.mixin(() => {})],
    });
    // @ts-expect-error
    new ConsoleApp({ services, logger: services.logger, language, mount: {} });
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
    new ConsoleApp({ services: withoutLogger, language });

    const withLogger = await combineServices({
      logger: async () => TestConsoleLoggerService,
      demo: async () => Demo,
    });
    new ConsoleApp({
      services: withLogger,
      logger: withLogger.logger,
      language,
    });
    new ConsoleApp({
      services: [withLogger],
      logger: withLogger.logger,
      language,
    });
    // @ts-expect-error
    new ConsoleApp({ services: 1, logger: withLogger.logger, language });
    // @ts-expect-error
    new ConsoleApp({ services: withLogger, logger: 1, language });
  }

  // TestConsoleApp：services/logger/language 选填
  {
    new TestConsoleApp();
    new TestConsoleApp({});
    new TestConsoleApp({ mount: [] });
    new TestConsoleApp({ language: 'en-US' });
  }

  // 事件
  {
    app.on('error', (err, ctx, level) => {
      expectType<TypeEqual<ConsoleError, typeof err>>(true);
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
