import { expect, test, vitest } from 'vitest';
import { Router, routers } from '../src';
import { join } from 'node:path';
import { WebApp } from '@aomex/web';
import { mdchain, middleware } from '@aomex/core';
import supertest from 'supertest';
import { router as routerA } from './fixture/a.router';

const dir = import.meta.dirname;

test('从路径动态加载', async () => {
  const app = new WebApp({
    mount: mdchain.web.mount(routers(join(dir, 'fixture'))),
  });
  await supertest(app.listen()).get('/test1').expect(200, 'foo');
  await supertest(app.listen()).get('/test2').expect(200, 'bar');
});

test('直接传入路由', async () => {
  const router = new Router({ prefix: '/test' });
  router.get('/users', {
    action: (ctx) => {
      ctx.send('foo-bar');
    },
  });
  const app = new WebApp({
    mount: mdchain.web.mount(routers([router])),
  });
  await supertest(app.listen()).get('/test/users').expect(200, 'foo-bar');
});

test('路由实例只收集一次', async () => {
  const app = new WebApp({
    mount: mdchain.web.mount(routers(join(dir, 'fixture'))),
  });

  // @ts-expect-error
  const spy = vitest.spyOn(routerA, 'collect');

  const agent = supertest(app.listen());
  await Promise.all([
    agent.get('/test1'),
    agent.get('/test2'),
    agent.get('/test1'),
    agent.get('/test2'),
    agent.get('/test1'),
    agent.get('/test2'),
    agent.post('/test1'),
    agent.post('/test2'),
  ]);
  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});

test('路由分类', async () => {
  const router = new Router();
  router.get('/foo', { action: () => {} });
  router.post('/foo', { action: () => {} });

  const app = new WebApp({
    mount: mdchain.web.mount(routers([router])),
  });

  const spy1 = vitest.spyOn(router['builders'][0]!, 'match');
  const spy2 = vitest.spyOn(router['builders'][1]!, 'match');

  await supertest(app.listen()).post('/foo');
  expect(spy1).toBeCalledTimes(0);
  expect(spy2).toBeCalledTimes(1);

  spy1.mockReset();
  spy2.mockReset();
  await supertest(app.listen()).get('/foo');
  expect(spy1).toBeCalledTimes(1);
  expect(spy2).toBeCalledTimes(0);

  spy1.mockReset();
  spy2.mockReset();
  await supertest(app.listen()).put('/foo');
  expect(spy1).toBeCalledTimes(0);
  expect(spy2).toBeCalledTimes(0);
});

test('未匹配上路由时继续其他中间件', async () => {
  const spy = vitest.fn();
  const app = new WebApp({
    mount: mdchain.web.mount(routers(join(dir, 'fixture'))).mount(middleware.web(spy)),
  });
  await supertest(app.listen()).get('/test1');
  expect(spy).toHaveBeenCalledTimes(0);
  await supertest(app.listen()).get('/not-match');
  expect(spy).toHaveBeenCalledOnce();
});

test('head请求与复用get请求', async () => {
  const app = new WebApp({
    mount: mdchain.web.mount(routers(join(dir, 'fixture'))),
  });
  await supertest(app.listen()).head('/test1').expect(200);
});
