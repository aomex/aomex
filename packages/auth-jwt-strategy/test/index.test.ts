import { middleware, OpenAPI } from '@aomex/common';
import { WebApp } from '@aomex/web';
import { expect, test } from 'vitest';
import { JwtStrategy } from '../src';
import supertest from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import sleep from 'sleep-promise';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Auth } from '@aomex/auth';

test('报头令牌', async () => {
  const jwt = new JwtStrategy({ secret: 'secrets', onVerified: (payload) => payload });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
});

test('报头令牌无效', async () => {
  const jwt = new JwtStrategy({ secret: 'secrets', onVerified: (payload) => payload });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' });

  await supertest(app.listen()).get('/').set('Authorization', 'Bearer wrong').expect(401);
  await supertest(app.listen()).get('/').set('Authorization', `Bea ${token}`).expect(401);
});

test('密码错误', async () => {
  const jwt = new JwtStrategy({
    secret: 'secrets',
    onVerified: (payload) => payload,
  });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jsonwebtoken.sign({ foo: 'bar' }, 'different-secrets');

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('多个密码', async () => {
  const jwt = new JwtStrategy({
    secret: 'secrets',
    legacySecretOrPublicKey: ['different-secret', 'some-other-secret'],
    onVerified: (payload) => payload,
  });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jsonwebtoken.sign({ foo: 'bar' }, 'different-secret');

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${jsonwebtoken.sign({ foo: 'bar' }, 'foo')}`)
    .expect(401);
});

test('令牌时效性', async () => {
  const jwt = new JwtStrategy({ secret: 'secrets', onVerified: (payload) => payload });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' }, { expiresIn: '2s' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
  await sleep(3500);
  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('验证成功后再次判断', async () => {
  const jwt = new JwtStrategy({
    secret: 'secrets',
    onVerified: async () => false,
  });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401, 'Unauthorized');
});

test('issuer匹配失败', async () => {
  const jwt = new JwtStrategy({
    secret: 'secrets',
    verifyOptions: { issuer: 'foo' },
    onVerified: (payload) => payload,
  });
  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' }, { issuer: 'bar' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('密钥对', async () => {
  const dir = import.meta.dirname;
  const jwt = new JwtStrategy({
    publicKey: readFileSync(join(dir, 'fixture', 'public-key.pem')),
    privateKey: readFileSync(join(dir, 'fixture', 'private-key.pem')),
    verifyOptions: {
      algorithms: ['RS256'],
    },
    onVerified: (payload) => payload,
  });

  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' }, { algorithm: 'RS256' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
});

test('错误的密钥对', async () => {
  const dir = import.meta.dirname;
  const jwt = new JwtStrategy({
    publicKey: readFileSync(join(dir, 'fixture', 'wrong-public-key.pem')),
    privateKey: readFileSync(join(dir, 'fixture', 'private-key.pem')),
    verifyOptions: {
      algorithms: ['RS256'],
    },
    onVerified: (payload) => payload,
  });

  const app = new WebApp({
    mount: [new Auth({ strategies: { jwt } }).authenticate('jwt')],
  });
  const token = jwt.signature({ foo: 'bar' }, { algorithm: 'RS256' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('权限认证', async () => {
  const jwt = new JwtStrategy({
    secret: 'secrets',
    onVerified: (payload: { token: string }) => payload,
    onAuthorize(role: 0 | 1) {
      const data = this.getIdentity();
      const character = data.token.slice(-1);
      return character === role.toString();
    },
  });
  const app = new WebApp({
    mount: [
      new Auth({ strategies: { jwt } }).authenticate('jwt').authorize(0),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });
  const token0 = jwt.signature({ token: 'abcd0' });
  const token1 = jwt.signature({ token: 'abcd1' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token0}`)
    .expect(200);

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token1}`)
    .expect(403);
});

test('文档', () => {
  const jwt = new JwtStrategy({ secret: 'secrets', onVerified: (payload) => payload });
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const openapi = jwt['openapi']();
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
          "jwt": {
            "bearerFormat": "JWT",
            "scheme": "bearer",
            "type": "http",
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
                "jwt": [],
              },
            ],
          },
        },
      },
    }
  `);
});
