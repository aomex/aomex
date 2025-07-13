import { middleware, OpenAPI } from '@aomex/common';
import { expect, test, vitest } from 'vitest';
import { Auth, AuthError } from '../src';
import { MockStrategy } from './mocks/mock-strategy';
import { WebApp } from '@aomex/web';
import supertest from 'supertest';

test('返回策略实例', () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  expect(auth.strategy('mock')).toBe(strategy);
  // @ts-expect-error
  expect(auth.strategy('xx')).toBeUndefined();
});

test('认证返回对象', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return { foo: 'bar' };
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('mock'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.mock);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect(200, JSON.stringify({ foo: 'bar' }));
});

test('认证返回字符串', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });

  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('mock'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.mock);
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect(200, 'foo-bar');
});

test('认证返回false', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => false);
  const app = new WebApp({
    mount: [auth.authenticate('mock')],
  });

  await supertest(app.listen()).get('/').expect(401);
});

test('认证抛出异常', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  vitest
    // @ts-expect-error
    .spyOn(strategy, 'authenticate')
    .mockImplementationOnce(() => {
      throw new Error('abcde');
    })
    .mockImplementationOnce(() => {
      throw new AuthError('abcde');
    })
    // @ts-expect-error
    .mockImplementationOnce(() => {
      return new AuthError('ijk');
    });
  const app = new WebApp({
    mount: [auth.authenticate('mock')],
  });

  await supertest(app.listen()).get('/').expect(500);
  await supertest(app.listen()).get('/').expect(401, 'abcde');
  await supertest(app.listen()).get('/').expect(401, 'ijk');
});

test('授权返回true', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authorize').mockImplementation(() => true);
  const app = new WebApp({
    mount: [
      auth.authenticate('mock'),
      middleware.web((ctx) => {
        ctx.send('passed');
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect('passed');
});

test('授权返回false', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authorize').mockImplementation(() => false);
  const app = new WebApp({
    mount: [
      auth.authenticate('mock'),
      auth.authorize('mock'),
      middleware.web((ctx) => {
        ctx.send('passed');
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect(403);
});

test('授权抛出异常', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  vitest
    // @ts-expect-error
    .spyOn(strategy, 'authorize')
    .mockImplementationOnce(() => {
      throw new Error('abcde');
    })
    .mockImplementationOnce(() => {
      throw new AuthError('abcde');
    })
    // @ts-expect-error
    .mockImplementationOnce(() => {
      return new AuthError('ijk');
    });
  const app = new WebApp({
    mount: [auth.authenticate('mock'), auth.authorize('mock')],
  });

  await supertest(app.listen()).get('/').expect(500);
  await supertest(app.listen()).get('/').expect(403, 'abcde');
  await supertest(app.listen()).get('/').expect(403, 'ijk');
});

test('认证加授权返回200', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  const md = auth.authenticate('mock');
  expect(md.authorize()).toBe(md);
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  // @ts-expect-error
  vitest.spyOn(auth, 'internalAuthorize').mockImplementation(async () => true);

  const app = new WebApp({
    mount: [
      md.authorize(),
      middleware.web((ctx) => {
        ctx.send('passed');
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(200, 'passed');
});

test('认证加授权返回403', async () => {
  const strategy = new MockStrategy();
  const auth = new Auth({ strategies: { mock: strategy } });
  const md = auth.authenticate('mock');
  expect(md.authorize()).toBe(md);
  // @ts-expect-error
  vitest.spyOn(strategy, 'authenticate').mockImplementation(() => {
    return 'foo-bar';
  });
  vitest
    // @ts-expect-error
    .spyOn(auth, 'internalAuthorize')
    // @ts-expect-error
    .mockImplementation(async (ctx) => void ctx.throw(403));

  const app = new WebApp({
    mount: [
      md.authorize(),
      middleware.web((ctx) => {
        ctx.send('passed');
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(403);
});

test('文档', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const md = new Auth({
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
