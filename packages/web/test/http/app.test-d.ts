import { combineServices, middleware, Service } from '@aomex/common';
import { WebApp, WebContext, formatError } from '../../src';
import { TestWebApp, TestWebLoggerService } from '../../src/testing';
import { expectType } from 'ts-expect';
import type { HttpError } from '../../src';
import http from 'http';

const language = { mode: 'fixed', language: 'zh-CN' } as const;
const proxyIP = { mode: 'detect' } as const;

// 创建实例：services / logger / language / proxyIP 必填
{
  // @ts-expect-error services/logger/language/proxyIP 必填
  new WebApp();
  // @ts-expect-error services/logger/language/proxyIP 必填
  new WebApp({});
}

{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  // @ts-expect-error 缺少 language / proxyIP
  new WebApp({ services, logger: services.logger });
  // @ts-expect-error 缺少 proxyIP
  new WebApp({ services, logger: services.logger, language });
  new WebApp({ services, logger: services.logger, language, proxyIP });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP: { mode: 'detect' },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP: { mode: 'specify', header: 'x-real-ip', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP: { mode: 'specify', header: 'cf-connecting-ip', hops: 0 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP: { mode: 'specify', header: 'x-custom-client-ip', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP: { mode: 'specify', header: 'X-My-Real-IP', hops: 2 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    // @ts-expect-error specify 缺 header
    proxyIP: { mode: 'specify', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    // @ts-expect-error specify 缺 hops
    proxyIP: { mode: 'specify', header: 'x-forwarded-for' },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    // @ts-expect-error hops 须为 number
    proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: '1' },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    // @ts-expect-error
    proxyIP: { header: 'x-forwarded-for', hops: 1 },
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    // @ts-expect-error
    proxyIP: true,
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP,
    // @ts-expect-error
    language: { mode: 'fixed' },
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP,
    // @ts-expect-error fallback 必填
    language: { mode: 'dynamic' },
  });
  new WebApp({
    services,
    logger: services.logger,
    language: { mode: 'dynamic', fallback: 'zh-CN' },
    proxyIP,
  });
  new WebApp({
    services,
    logger: services.logger,
    language: { mode: 'dynamic', header: 'accept-language', fallback: 'en-US' },
    proxyIP,
  });
  new WebApp({
    services,
    logger: services.logger,
    proxyIP,
    // @ts-expect-error
    language: { mode: 'fixed', language: 'zh_CN' },
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
  new WebApp({ services: withoutLogger, language, proxyIP });

  const services = await combineServices({
    logger: async () => TestWebLoggerService,
    demo: async () => Demo,
  });
  new WebApp({ services, logger: services.logger, language, proxyIP });
  new WebApp({
    services: [services, services],
    logger: services.logger,
    language,
    proxyIP,
  });
  // @ts-expect-error
  new WebApp({ services: 1, logger: services.logger, language, proxyIP });
  // @ts-expect-error
  new WebApp({ services, logger: 1, language, proxyIP });
}

// TestWebApp：services/logger/language/proxyIP 选填
{
  new TestWebApp();
  new TestWebApp({});
  new TestWebApp({ mount: [] });
  // @ts-expect-error fallback 必填
  new TestWebApp({ language: { mode: 'dynamic' } });
  new TestWebApp({ language: { mode: 'dynamic', fallback: 'zh-CN' } });
  new TestWebApp({ proxyIP: { mode: 'detect' } });
  new TestWebApp({
    proxyIP: { mode: 'specify', header: 'x-real-ip', hops: 1 },
  });
  // @ts-expect-error
  new TestWebApp({ proxyIP: { header: 'x-real-ip', hops: 1 } });
}

// 监听http
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  const app = new WebApp({ services, logger: services.logger, language, proxyIP });
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
  const app = new WebApp({ services, logger: services.logger, language, proxyIP });
  // @ts-expect-error
  app.http({ cert: '' }).listen();
  app.https({ cert: '' }).listen();
}

// 挂载
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP,
    mount: undefined,
  });
  new WebApp({ services, logger: services.logger, language, proxyIP, mount: [] });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP,
    // @ts-expect-error
    mount: {},
  });
  new WebApp({
    services,
    logger: services.logger,
    language,
    proxyIP,
    // @ts-expect-error
    mount: middleware.web(() => {}),
  });
}

// 事件 / ctx.logger
{
  const services = await combineServices({
    logger: async () => TestWebLoggerService,
  });
  const app = new WebApp({ services, logger: services.logger, language, proxyIP });
  app.on('error', (err, ctx) => {
    expectType<HttpError>(err);
    expectType<WebContext & WebApp.Props>(ctx);
  });
  formatError({
    handler(err) {
      expectType<string>(err.message);
      return { code: err.code };
    },
  });
  // @ts-expect-error
  app.on('data', () => {});

  const ctx = null as unknown as WebContext;
  expectType<WebApp.Logger>(ctx.logger);
  expectType<WebApp.Logger>(app['logger']);
}
