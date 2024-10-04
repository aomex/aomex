import supertest from 'supertest';
import { expect, test } from 'vitest';
import { Authentication } from '@aomex/auth';
import { WebApp } from '@aomex/web';
import { BearerStrategy } from '../src';
import { middleware } from '@aomex/core';

test('无令牌', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
      }),
    },
  });
  const app = new WebApp({
    mount: [auth.authenticate('bearer')],
  });
  await supertest(app.listen()).get('/').expect(401);
});

test('报头令牌', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
      }),
    },
  });

  const app = new WebApp({
    mount: [
      auth.authenticate('bearer'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.bearer);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `bearer abc`)
    .expect(200, { token: 'abc', data: 'abcfoo' });

  await supertest(app.listen()).get('/').set('Authorization', `Bearer   abc`).expect(401);
});

test('报头令牌格式错误', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
      }),
    },
  });
  const app = new WebApp({
    mount: [auth.authenticate('bearer')],
  });

  await supertest(app.listen()).get('/').set('Authorization', 'abc').expect(401);
});

test('从cookie获取令牌', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
        tokenLoaders: [{ type: 'cookie', key: 'bearer' }],
      }),
    },
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('bearer'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.bearer);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('Cookie', `bearer=abc`)
    .expect(200, { token: 'abc', data: 'abcfoo' });
});

test('从查询字符串获取令牌', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
        tokenLoaders: [{ type: 'query', key: 'bearer' }],
      }),
    },
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('bearer'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.bearer);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/?bearer=abc')
    .expect(200, { token: 'abc', data: 'abcfoo' });
});

test('从请求实体获取令牌', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
        tokenLoaders: [{ type: 'body', key: 'bearer' }],
      }),
    },
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('bearer'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.bearer);
      }),
    ],
  });

  await supertest(app.listen())
    .post('/')
    .send({ bearer: 'abc' })
    .expect(200, { token: 'abc', data: 'abcfoo' });
});

test('按顺序获取', async () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
        tokenLoaders: [
          { type: 'body', key: 'body_token' },
          { type: 'query', key: 'query_token' },
          { type: 'cookie', key: 'cookie_token' },
        ],
      }),
    },
  });
  const app = new WebApp({
    mount: [
      auth.authenticate('bearer'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.bearer);
      }),
    ],
  });

  await supertest(app.listen())
    .post('/?query_token=b')
    .set('Cookie', `cookie_token=c`)
    .send({ body_token: 'a' })
    .expect(200, { token: 'a', data: 'afoo' });

  await supertest(app.listen())
    .post('/?query_token=b')
    .set('Cookie', `cookie_token=c`)
    .send({ body_tokens: 'a' })
    .expect(200, { token: 'b', data: 'bfoo' });

  await supertest(app.listen())
    .post('/?query_tokens=b')
    .set('Cookie', `cookie_token=c`)
    .send({ body_tokens: 'a' })
    .expect(200, { token: 'c', data: 'cfoo' });
});

test('签名', () => {
  const auth = new Authentication({
    strategies: {
      bearer: new BearerStrategy({
        async onLoaded(token) {
          return token + 'foo';
        },
      }),
    },
  });

  expect(auth.strategy('bearer').signature('md5')).toMatch(/^[a-z0-9]{32}$/);
  expect(auth.strategy('bearer').signature('sha1')).toMatch(/^[a-z0-9]{40}$/);
});
