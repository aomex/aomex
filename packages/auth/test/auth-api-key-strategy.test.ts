import { TestWebApp } from '../../web/src/testing';
import supertest from 'supertest';
import { expect, test } from 'vitest';
import { Auth, AuthError } from '../src';
import { AuthApiKeyStrategy } from '../src/strategies/auth-api-key-strategy';
import { middleware, OpenAPI } from '@aomex/common';

test('无密钥', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [auth.authenticate('apiKey')],
  });
  await supertest(app.listen()).get('/').expect(401);
});

test('报头密钥', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
      }),
    },
  });

  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.apiKey);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('x-api-key', 'abc')
    .expect(200, { key: 'abc', data: 'abcfoo' });

  await supertest(app.listen())
    .get('/')
    .set('X-API-Key', 'abc')
    .expect(200, { key: 'abc', data: 'abcfoo' });
});

test('报头数组取首个', () => {
  const strategy = new AuthApiKeyStrategy({
    onLoaded(apiKey) {
      return apiKey;
    },
  });
  const key = strategy['loadFromHeader'](
    {
      request: {
        headers: { 'x-api-key': ['abc', 'def'] },
      },
    } as never,
    'x-api-key',
  );
  expect(key).toBe('abc');
});

test('报头非字符串无效', () => {
  const strategy = new AuthApiKeyStrategy({
    onLoaded(apiKey) {
      return apiKey;
    },
  });
  const key = strategy['loadFromHeader'](
    {
      request: {
        headers: { 'x-api-key': 123 as never },
      },
    } as never,
    'x-api-key',
  );
  expect(key).toBe(false);
});

test('query/cookie 空白与非字符串无效', () => {
  const strategy = new AuthApiKeyStrategy({
    onLoaded(apiKey) {
      return apiKey;
    },
  });

  expect(
    strategy['loadFromQuery'](
      { request: { query: { api_key: '   ' } } } as never,
      'api_key',
    ),
  ).toBe(false);
  expect(
    strategy['loadFromQuery'](
      { request: { query: { api_key: ['a'] as never } } } as never,
      'api_key',
    ),
  ).toBe(false);
  expect(
    strategy['loadFromCookie'](
      { request: { cookies: { api_key: '   ' } } } as never,
      'api_key',
    ),
  ).toBe(false);
  expect(
    strategy['loadFromCookie'](
      { request: { cookies: { api_key: 1 as never } } } as never,
      'api_key',
    ),
  ).toBe(false);
});

test('报头空白密钥无效', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [auth.authenticate('apiKey')],
  });

  await supertest(app.listen()).get('/').set('x-api-key', '   ').expect(401);
});

test('报头自动 trim', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey;
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.apiKey);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('x-api-key', '  abc  ')
    .expect(200, { key: 'abc', data: 'abc' });
});

test('自定义报头名', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        keyLoaders: [{ type: 'header', key: 'x-custom-key' }],
        async onLoaded(apiKey) {
          return apiKey;
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.apiKey);
      }),
    ],
  });

  await supertest(app.listen()).get('/').set('x-api-key', 'abc').expect(401);

  await supertest(app.listen())
    .get('/')
    .set('x-custom-key', 'abc')
    .expect(200, { key: 'abc', data: 'abc' });
});

test('从 cookie 获取密钥', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
        keyLoaders: [{ type: 'cookie', key: 'api_key' }],
      }),
    },
  });
  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.apiKey);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('Cookie', `api_key=abc`)
    .expect(200, { key: 'abc', data: 'abcfoo' });
});

test('从查询字符串获取密钥', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
        keyLoaders: [{ type: 'query', key: 'api_key' }],
      }),
    },
  });
  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.apiKey);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/?api_key=abc')
    .expect(200, { key: 'abc', data: 'abcfoo' });
});

test('按顺序获取', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
        keyLoaders: [
          { type: 'header', key: 'x-api-key' },
          { type: 'query', key: 'api_key' },
          { type: 'cookie', key: 'api_key' },
        ],
      }),
    },
  });
  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.apiKey);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/?api_key=b')
    .set('Cookie', `api_key=c`)
    .set('x-api-key', 'a')
    .expect(200, { key: 'a', data: 'afoo' });

  await supertest(app.listen())
    .get('/?api_key=b')
    .set('Cookie', `api_key=c`)
    .expect(200, { key: 'b', data: 'bfoo' });

  await supertest(app.listen())
    .get('/?api_keys=b')
    .set('Cookie', `api_key=c`)
    .expect(200, { key: 'c', data: 'cfoo' });
});

test('onLoaded 返回 false', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded() {
          return false;
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [auth.authenticate('apiKey')],
  });

  await supertest(app.listen()).get('/').set('x-api-key', 'abc').expect(401);
});

test('onLoaded 抛出 AuthError', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded() {
          throw new AuthError('bad key');
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [auth.authenticate('apiKey')],
  });

  await supertest(app.listen()).get('/').set('x-api-key', 'abc').expect(401);
});

test('onLoaded 返回 AuthError', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded() {
          return new AuthError('bad key');
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [auth.authenticate('apiKey')],
  });

  await supertest(app.listen()).get('/').set('x-api-key', 'abc').expect(401);
});

test('空 loader key 无效', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        keyLoaders: [
          { type: 'header', key: '' },
          { type: 'query', key: '' },
          { type: 'cookie', key: '' },
        ],
        async onLoaded(apiKey) {
          return apiKey;
        },
      }),
    },
  });
  const app = new TestWebApp({
    mount: [auth.authenticate('apiKey')],
  });

  await supertest(app.listen())
    .get('/?api_key=abc')
    .set('x-api-key', 'abc')
    .set('Cookie', 'api_key=abc')
    .expect(401);
});

test('文档-cookie', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const md = new Auth({
    strategies: {
      key: new AuthApiKeyStrategy({
        keyLoaders: [{ type: 'cookie', key: 'api_key' }],
        onLoaded() {
          return {};
        },
      }),
    },
  }).authenticate('key');
  const openapi = md['openapi']();
  openapi.onDocument?.(doc);

  expect(doc.components?.securitySchemes?.['apiKey']).toEqual({
    type: 'apiKey',
    in: 'cookie',
    name: 'api_key',
  });
});

test('签名', () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        async onLoaded(apiKey) {
          return apiKey + 'foo';
        },
      }),
    },
  });

  expect(auth.strategy('apiKey').signature('md5')).toMatch(/^[a-z0-9]{32}$/);
  expect(auth.strategy('apiKey').signature('sha1')).toMatch(/^[a-z0-9]{40}$/);
});

test('权限认证', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        onLoaded(apiKey) {
          return { apiKey };
        },
        onAuthorize(role: 0 | 1) {
          const data = this.getIdentity();
          const character = data.apiKey.slice(-1);
          return character === role.toString();
        },
      }),
    },
  });

  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey').authorize(0),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  await supertest(app.listen()).post('/').set('x-api-key', 'abcd0').expect(200);

  await supertest(app.listen()).post('/').set('x-api-key', 'abcd1').expect(403);
});

test('权限认证-柯里化', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        onLoaded(apiKey) {
          return { apiKey };
        },
        onAuthorize: (role: 0 | 1) => (data) => {
          return data.apiKey.slice(-1) === role.toString();
        },
      }),
    },
  });

  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey').authorize(0),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  await supertest(app.listen()).post('/').set('x-api-key', 'abcd0').expect(200);
  await supertest(app.listen()).post('/').set('x-api-key', 'abcd1').expect(403);
});

test('无 onAuthorize 时授权失败', async () => {
  const auth = new Auth({
    strategies: {
      apiKey: new AuthApiKeyStrategy({
        onLoaded(apiKey) {
          return { apiKey };
        },
      }),
    },
  });

  const app = new TestWebApp({
    mount: [
      auth.authenticate('apiKey').authorize(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  await supertest(app.listen()).post('/').set('x-api-key', 'abcd0').expect(403);
});

test('文档-header', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const md = new Auth({
    strategies: {
      key: new AuthApiKeyStrategy({
        onLoaded() {
          return {};
        },
      }),
    },
  }).authenticate('key');
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
      "components": {
        "securitySchemes": {
          "apiKey": {
            "in": "header",
            "name": "x-api-key",
            "type": "apiKey",
          },
        },
      },
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
            "security": [
              {
                "apiKey": [],
              },
            ],
          },
        },
      },
    }
  `);
});

test('文档-query', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const md = new Auth({
    strategies: {
      key: new AuthApiKeyStrategy({
        keyLoaders: [{ type: 'query', key: 'api_key' }],
        onLoaded() {
          return {};
        },
      }),
    },
  }).authenticate('key');
  const openapi = md['openapi']();
  openapi.onDocument?.(doc);

  expect(doc.components?.securitySchemes?.['apiKey']).toEqual({
    type: 'apiKey',
    in: 'query',
    name: 'api_key',
  });
});
