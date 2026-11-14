import { combineServices, middleware, Service } from '@aomex/common';
import { WebApp, WebContext } from '../../src';
import { TestWebApp, TestWebLoggerService } from '../../src/testing';
import { expectType } from 'ts-expect';
import { HttpError } from 'http-errors';
import http from 'http';

// 创建实例：services + logger 必填
{
  // @ts-expect-error services/logger 必填
  new WebApp();
  // @ts-expect-error services/logger 必填
  new WebApp({});
}

{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  new WebApp({ services, logger: services.logger });
  new WebApp({ services, logger: services.logger, debug: true });
  new WebApp({ services, logger: services.logger, debug: false });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP: { header: 'x-forwarded-for', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP: { header: 'x-real-ip', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP: { header: 'cf-connecting-ip', hops: 0 },
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP: { header: 'x-custom-client-ip', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP: { header: 'X-My-Real-IP', hops: 2 },
  });
  new WebApp({
    services,
    logger: services.logger,
    // @ts-expect-error
    proxyIP: { hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    // @ts-expect-error
    proxyIP: { header: 'x-forwarded-for' },
  });
  new WebApp({
    services,
    logger: services.logger,
    // @ts-expect-error
    proxyIP: { header: 'x-forwarded-for', hops: '1' },
  });
  new WebApp({
    services,
    logger: services.logger,
    // @ts-expect-error
    proxyIP: true,
  });
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
  new WebApp({ services: withoutLogger });

  const services = await combineServices({
    logger: async () => TestWebLoggerService,
    demo: async () => Demo,
  });
  new WebApp({ services, logger: services.logger });
  new WebApp({ services: [services, services], logger: services.logger });
  // @ts-expect-error
  new WebApp({ services: 1, logger: services.logger });
  // @ts-expect-error
  new WebApp({ services, logger: 1 });
}

// TestWebApp：services/logger 选填
{
  new TestWebApp();
  new TestWebApp({});
  new TestWebApp({ debug: true, mount: [] });
}

// 监听http
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  const app = new WebApp({ services, logger: services.logger });
  app.listen();
  app.listen(3000);
  app.listen(3000, '127.0.0.1');
  app.listen(3000, () => {});
  expectType<http.Server>(app.listen());
  expectType<http.Server>(app.http({}).listen());
}

// 监听https
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  const app = new WebApp({ services, logger: services.logger });
  // @ts-expect-error
  app.http({ cert: '' }).listen();
  app.https({ cert: '' }).listen();
}

// 挂载
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  new WebApp({ services, logger: services.logger, mount: undefined });
  new WebApp({ services, logger: services.logger, mount: [] });
  new WebApp({
    services,
    logger: services.logger,
    // @ts-expect-error
    mount: {},
  });
  new WebApp({
    services,
    logger: services.logger,
    // @ts-expect-error
    mount: middleware.web(() => {}),
  });
}

// 事件 / ctx.logger
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  const app = new WebApp({ services, logger: services.logger });
  app.on('error', (err, ctx) => {
    expectType<HttpError>(err);
    expectType<WebContext & WebApp.Props>(ctx);
  });
  // @ts-expect-error
  app.on('data', () => {});

  const ctx = null as unknown as WebContext;
  expectType<WebApp.Logger>(ctx.logger);
  expectType<WebApp.Logger>(app['logger']);
}
