import supertest from 'supertest';
import { expect, test } from 'vitest';
import { authentication } from '@aomex/auth';
import { WebApp } from '@aomex/web';
import { AuthenticationBearerAdapter } from '../src';
import { middleware } from '@aomex/core';

test('无令牌', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
  });
  const app = new WebApp({
    mount: [authentication(bearer)],
  });
  await supertest(app.listen()).get('/').expect(401);
});

test('报头令牌', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
  });
  const app = new WebApp({
    mount: [
      authentication(bearer),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `bearer abc`)
    .expect(200, 'abcfoo');

  await supertest(app.listen()).get('/').set('Authorization', `Bearer   abc`).expect(401);
});

test('报头令牌格式错误', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
  });
  const app = new WebApp({
    mount: [authentication(bearer)],
  });

  await supertest(app.listen()).get('/').set('Authorization', 'abc').expect(401);
});

test('从cookie获取令牌', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
    tokenLoaders: [{ type: 'cookie', key: 'bearer' }],
  });
  const app = new WebApp({
    mount: [
      authentication(bearer),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('Cookie', `bearer=abc`)
    .expect(200, 'abcfoo');
});

test('从查询字符串获取令牌', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
    tokenLoaders: [{ type: 'query', key: 'bearer' }],
  });
  const app = new WebApp({
    mount: [
      authentication(bearer),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen()).get('/?bearer=abc').expect(200, 'abcfoo');
});

test('从请求实体获取令牌', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
    tokenLoaders: [{ type: 'body', key: 'bearer' }],
  });
  const app = new WebApp({
    mount: [
      authentication(bearer),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen()).post('/').send({ bearer: 'abc' }).expect(200, 'abcfoo');
});

test('按顺序获取', async () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
    tokenLoaders: [
      { type: 'body', key: 'body_token' },
      { type: 'query', key: 'query_token' },
      { type: 'cookie', key: 'cookie_token' },
    ],
  });
  const app = new WebApp({
    mount: [
      authentication(bearer),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth);
      }),
    ],
  });

  await supertest(app.listen())
    .post('/?query_token=b')
    .set('Cookie', `cookie_token=c`)
    .send({ body_token: 'a' })
    .expect(200, 'afoo');

  await supertest(app.listen())
    .post('/?query_token=b')
    .set('Cookie', `cookie_token=c`)
    .send({ body_tokens: 'a' })
    .expect(200, 'bfoo');

  await supertest(app.listen())
    .post('/?query_tokens=b')
    .set('Cookie', `cookie_token=c`)
    .send({ body_tokens: 'a' })
    .expect(200, 'cfoo');
});

test('签名', () => {
  const bearer = new AuthenticationBearerAdapter({
    async onLoaded(token) {
      return token + 'foo';
    },
  });
  expect(bearer.signature('md5')).toMatch(/^[a-z0-9]{32}$/);
  expect(bearer.signature('sha1')).toMatch(/^[a-z0-9]{40}$/);
});
