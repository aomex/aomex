import { middleware, OpenAPI } from '@aomex/core';
import { expect, test, vitest } from 'vitest';
import { Authentication } from '../src';
import { MockStrategy } from './mocks/mock-strategy';
import { WebApp } from '@aomex/web';
import supertest from 'supertest';

test('返回策略实例', () => {
  const strategy = new MockStrategy();
  const auth = new Authentication({ strategies: { mock: strategy } });
  expect(auth.strategy('mock')).toBe(strategy);
  // @ts-expect-error
  expect(auth.strategy('xx')).toBeUndefined();
});

test('返回对象', async () => {
  const strategy = new MockStrategy();
  const auth = new Authentication({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return { foo: 'bar' };
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('mock'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.mock);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect(200, JSON.stringify({ foo: 'bar' }));
});

test('返回字符串', async () => {
  const strategy = new MockStrategy();
  const auth = new Authentication({ strategies: { mock: strategy } });

  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('mock'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.mock);
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect(200, 'foo-bar');
});

test('返回false', async () => {
  const strategy = new MockStrategy();
  const auth = new Authentication({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => false);
  const app = new WebApp({
    mount: [auth.authenticate('mock')],
  });

  await supertest(app.listen()).get('/').expect(401);
});

test('抛出异常', async () => {
  const strategy = new MockStrategy();
  const auth = new Authentication({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    throw new Error('abcde');
  });
  const app = new WebApp({
    mount: [auth.authenticate('mock')],
  });

  await supertest(app.listen()).get('/').expect(401, 'abcde');
});

test('自定义contextKey', async () => {
  const strategy = new MockStrategy();
  const auth = new Authentication({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return { foo: 'bar' };
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('mock', { contextKey: 'admin' }),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.admin);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect(200, JSON.stringify({ foo: 'bar' }));
});

test('文档', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const md = new Authentication({
    strategies: { mock: new MockStrategy() },
  }).authenticate('mock');
  const openapi = md['openapi']();
  openapi.onDocument?.(doc);
  openapi.onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  openapi.postMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  openapi.postDocument?.(doc);

  expect(doc).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "",
        "version": "",
      },
      "openapi": "",
      "paths": {
        "/": {
          "get": {
            "responses": {
              "401": {
                "description": "Unauthorized",
              },
            },
          },
        },
      },
    }
  `);
});
