import { combineServices, middleware, Service } from '@aomex/common';
import { WebApp, WebContext } from '../../src';
import { expectType } from 'ts-expect';
import { HttpError } from 'http-errors';
import http from 'http';

// 创建实例
{
  new WebApp();
  new WebApp({});
  new WebApp({ debug: true });
  new WebApp({ debug: false });
  new WebApp({ proxyIP: { header: 'x-forwarded-for', hops: 1 } });
  new WebApp({ proxyIP: { header: 'x-real-ip', hops: 1 } });
  new WebApp({ proxyIP: { header: 'cf-connecting-ip', hops: 0 } });
  // (string & {})：允许已知联合外的任意头名
  new WebApp({ proxyIP: { header: 'x-custom-client-ip', hops: 1 } });
  new WebApp({ proxyIP: { header: 'X-My-Real-IP', hops: 2 } });
  // @ts-expect-error
  new WebApp({ proxyIP: { hops: 1 } });
  // @ts-expect-error
  new WebApp({ proxyIP: { header: 'x-forwarded-for' } });
  // @ts-expect-error
  new WebApp({ proxyIP: { header: 'x-forwarded-for', hops: '1' } });
  // @ts-expect-error
  new WebApp({ proxyIP: true });
}

// services
{
  class Demo extends Service {
    ping() {
      return 1;
    }
  }
  const services = await combineServices({ demo: async () => Demo });
  new WebApp({ services });
  new WebApp({ services: [services, services] });
  // @ts-expect-error
  new WebApp({ services: 1 });
  // @ts-expect-error
  new WebApp({ services: 'x' });
}

// 监听http
{
  const app = new WebApp();
  app.listen();
  app.listen(3000);
  app.listen(3000, '127.0.0.1');
  app.listen(3000, () => {});
  expectType<http.Server>(app.listen());
  expectType<http.Server>(app.http({}).listen());
}

// 监听https
{
  const app = new WebApp();
  // @ts-expect-error
  app.http({ cert: '' }).listen();
  app.https({ cert: '' }).listen();
}

// 挂载
{
  new WebApp({ mount: undefined });
  new WebApp({ mount: [] });
  //@ts-expect-error
  new WebApp({ mount: {} });
  //@ts-expect-error
  new WebApp({ mount: middleware.web(() => {}) });
}

// 事件
{
  const app = new WebApp();
  app.on('error', (err, ctx) => {
    expectType<HttpError>(err);
    expectType<WebContext & WebApp.Props>(ctx);
  });
  // @ts-expect-error
  app.on('data', () => {});
}
