import { expect, test, vitest } from 'vitest';
import { Router, routers } from '../src';
import { WebApp } from '@aomex/web';
import { middleware } from '@aomex/core';
import supertest from 'supertest';

test('前缀', async () => {
  const router = new Router({ prefix: '/test/foo' });
  const spy = vitest.fn();
  router.get('/bar', { action: spy });

  const app = new WebApp({
    mount: [routers([router])],
  });

  await supertest(app.listen()).get('/test/foo/bar');
  expect(spy).toHaveBeenCalledOnce();
});

test('挂载中间件', async () => {
  let str = '';

  const router = new Router({
    prefix: '/test/foo',
    mount: [
      middleware.web(async (_, next) => {
        str += 1;
        await next();
        str += 7;
      }),
    ],
  });

  router.get('/bar', {
    mount: [
      middleware.web(async (_, next) => {
        str += 2;
        await next();
        str += 6;
      }),
      middleware.web(async (_, next) => {
        str += 3;
        await next();
        str += 5;
      }),
    ],
    action: () => {
      str += 4;
    },
  });

  const app = new WebApp({ mount: [routers([router])] });
  await supertest(app.listen()).get('/test/foo/bar');
  expect(str).toBe('1234567');
});

test.each(<const>['get', 'post', 'put', 'delete', 'patch'])(
  '测试请求：%s',
  async (name) => {
    const router = new Router();
    router[name]('/', { action: () => {} });
    const spy = vitest.fn();
    router[name]('/foo', { action: spy });

    const app = new WebApp({
      mount: [routers([router])],
    });
    await Promise.all([
      supertest(app.listen())[name]('/foo'),
      supertest(app.listen())[name]('/bar'),
      supertest(app.listen())[name]('/test'),
      supertest(app.listen())[name]('/'),
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
  },
);

test('支持任意方法', async () => {
  const router = new Router();
  const spy = vitest.fn();
  router.all('/foo', { action: spy });

  const app = new WebApp({
    mount: [routers([router])],
  });

  const agent = supertest(app.listen());
  await Promise.all([
    agent.get('/foo'),
    agent.post('/foo'),
    agent.put('/foo'),
    agent.delete('/foo'),
    agent.patch('/foo'),
    agent.head('/foo'),

    agent.get('/bar'),
    agent.post('/bar'),
  ]);
  expect(spy).toHaveBeenCalledTimes(6);
});

test('支持自定义方法', async () => {
  const router = new Router();
  const spy = vitest.fn();
  router.customize(['POST', 'DELETE'], '/foo', { action: spy });

  const app = new WebApp({
    mount: [routers([router])],
  });

  const agent = supertest(app.listen());
  await Promise.all([
    agent.get('/foo'),
    agent.post('/foo'),
    agent.put('/foo'),
    agent.delete('/foo'),
    agent.patch('/foo'),
    agent.head('/foo'),

    agent.get('/bar'),
    agent.post('/bar'),
  ]);
  expect(spy).toHaveBeenCalledTimes(2);
});

test('params', async () => {
  const spy = vitest.fn();
  const router = new Router();
  router.get('/users/:userId/posts/:postId', {
    action: (ctx) => {
      spy(ctx.request.params);
    },
  });
  const app = new WebApp({
    mount: [routers([router])],
  });
  await supertest(app.listen()).get('/users/2/posts/5678');
  expect(spy).toHaveBeenCalledWith({ userId: '2', postId: '5678' });
});

test('一个router可注册多个route', async () => {
  const router = new Router({ prefix: '/test' });
  const spy1 = vitest.fn();
  const spy2 = vitest.fn();
  const spy3 = vitest.fn();
  router.get('/foo', { action: spy1 });
  router.get('/bar', { action: spy2 });
  router.get('/baz', { action: spy3 });

  const app = new WebApp({
    mount: [routers([router])],
  });

  const agent = supertest(app.listen());
  await Promise.all([
    agent.get('/test/foo'),
    agent.get('/test/bar'),
    agent.get('/test/baz'),
    agent.get('/test/foo'),
  ]);
  expect(spy1).toHaveBeenCalledTimes(2);
  expect(spy2).toHaveBeenCalledTimes(1);
  expect(spy3).toHaveBeenCalledTimes(1);
});

test('文档合并到每个route中', () => {
  const router = new Router({ docs: { tags: ['bar', 'baz'] } });
  router.get('/', { action: () => {} });
  router.get('/foo', { docs: { deprecated: true }, action: () => {} });
  router.get('/foo', { docs: { showInOpenapi: false, tags: ['foo'] }, action: () => {} });

  expect(router['builders'][0]?.docs).toMatchInlineSnapshot(`
    {
      "showInOpenapi": true,
      "tags": [
        "bar",
        "baz",
      ],
    }
  `);
  expect(router['builders'][1]?.docs).toMatchInlineSnapshot(`
    {
      "deprecated": true,
      "showInOpenapi": true,
      "tags": [
        "bar",
        "baz",
      ],
    }
  `);
  expect(router['builders'][2]?.docs).toMatchInlineSnapshot(`
    {
      "showInOpenapi": false,
      "tags": [
        "foo",
      ],
    }
  `);
});
