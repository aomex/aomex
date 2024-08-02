import { middleware, OpenAPI } from '@aomex/core';
import { expect, test, vitest } from 'vitest';
import { authentication } from '../src';
import { MockAdapter } from './mocks/mock-adapter';
import { WebApp } from '@aomex/web';
import supertest from 'supertest';

test('返回对象', async () => {
  const adapter = new MockAdapter();
  // @ts-expect-error
  vitest.spyOn(adapter, 'authenticate').mockImplementation(() => {
    return { foo: 'bar' };
  });
  const app = new WebApp({
    mount: [
      authentication(adapter),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect(200, JSON.stringify({ foo: 'bar' }));
});

test('返回字符串', async () => {
  const adapter = new MockAdapter();
  // @ts-expect-error
  vitest.spyOn(adapter, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  const app = new WebApp({
    mount: [
      authentication(adapter),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect(200, 'foo-bar');
});

test('返回false', async () => {
  const adapter = new MockAdapter();
  // @ts-expect-error
  vitest.spyOn(adapter, 'authenticate').mockImplementation(() => false);
  const app = new WebApp({
    mount: [authentication(adapter)],
  });

  await supertest(app.listen()).get('/').expect(401);
});

test('抛出异常', async () => {
  const adapter = new MockAdapter();
  // @ts-expect-error
  vitest.spyOn(adapter, 'authenticate').mockImplementation(() => {
    throw new Error('abcde');
  });
  const app = new WebApp({
    mount: [authentication(adapter)],
  });

  await supertest(app.listen()).get('/').expect(401, 'abcde');
});

test('自定义authKey', async () => {
  const adapter = new MockAdapter();
  // @ts-expect-error
  vitest.spyOn(adapter, 'authenticate').mockImplementation(() => {
    return { foo: 'bar' };
  });
  const app = new WebApp({
    mount: [
      authentication(adapter, 'admin'),
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
  const md = authentication(new MockAdapter());
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
