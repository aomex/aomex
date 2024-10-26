import { expect, test, vitest } from 'vitest';
import { dirname, join } from 'node:path';
import { middleware } from '@aomex/common';
import supertest from 'supertest';
import { Router, routers, WebApp } from '../../src';
import { router as routerA } from '../fixture/routers/a.router';

const dir = dirname(import.meta.dirname);

test('从路径动态加载', async () => {
  const app = new WebApp({
    mount: [routers(join(dir, 'fixture', 'routers'))],
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
    mount: [routers([router])],
  });
  await supertest(app.listen()).get('/test/users').expect(200, 'foo-bar');
});

test('路由实例只收集一次', async () => {
  const app = new WebApp({
    mount: [routers(join(dir, 'fixture', 'routers'))],
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

test('相同静态路径不覆盖', async () => {
  const router = new Router();
  router.get('/foo', { action: (ctx) => ctx.send('foo!') });
  router.get('/foo', { action: (ctx) => ctx.send('bar!') });
  const app = new WebApp({
    mount: [routers([router])],
  });
  await supertest(app.listen()).get('/foo').expect(200, 'foo!');
});

test('相同动态路径不覆盖', async () => {
  const router = new Router();
  router.get('/foo/:bar', { action: (ctx) => ctx.send('foo!') });
  router.get('/foo/:bar', { action: (ctx) => ctx.send('bar!') });
  const app = new WebApp({
    mount: [routers([router])],
  });
  await supertest(app.listen()).get('/foo/x').expect(200, 'foo!');
});

test('静态路径比动态路径优先匹配', async () => {
  const router = new Router();
  router.get('/:foo', { action: (ctx) => ctx.send('foo!') });
  router.get('/bar', { action: (ctx) => ctx.send('bar!') });
  const app = new WebApp({
    mount: [routers([router])],
  });
  await supertest(app.listen()).get('/bar').expect(200, 'bar!');
  await supertest(app.listen()).get('/baz').expect(200, 'foo!');
});

test('未匹配上路由时继续其他中间件', async () => {
  const spy = vitest.fn();
  const app = new WebApp({
    mount: [routers(join(dir, 'fixture', 'routers')), middleware.web(spy)],
  });
  await supertest(app.listen()).get('/test1');
  expect(spy).toHaveBeenCalledTimes(0);
  await supertest(app.listen()).get('/not-match');
  expect(spy).toHaveBeenCalledOnce();
});

test('head请求与复用get请求', async () => {
  const app = new WebApp({
    mount: [routers(join(dir, 'fixture', 'routers'))],
  });
  await supertest(app.listen()).head('/test1').expect(200);
});
