import { mdchain, middleware } from '@aomex/core';
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
  new WebApp({ mount: mdchain.web });
  new WebApp({ mount: mdchain.mixin });
  //@ts-expect-error
  new WebApp({ mount: middleware.web(() => {}) });
}

// 事件
{
  const app = new WebApp();
  app.on('error', (err, ctx) => {
    expectType<HttpError>(err);
    expectType<WebContext>(ctx);
  });
  // @ts-expect-error
  app.on('data', () => {});
}
