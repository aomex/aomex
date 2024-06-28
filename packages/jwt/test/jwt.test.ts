import { OpenAPI } from '@aomex/core';
import { WebApp } from '@aomex/web';
import { expect, test } from 'vitest';
import { JWT } from '../src';
import supertest from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import { sleep } from '@aomex/internal-tools';
import { join } from 'path';
import { readFileSync } from 'fs';

test('[401] 无令牌', async () => {
  const jwt = new JWT({ secret: 'shhhh' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  await supertest(app.listen()).get('/').expect(401);
});

test('报头令牌', async () => {
  const jwt = new JWT({ secret: 'shhhh' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `bearer ${token}`)
    .expect(404);

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `     Bearer ${token}      `)
    .expect(404);
});

test('[401] 报头令牌无效', async () => {
  const jwt = new JWT({ secret: 'shhhh' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' });
  await supertest(app.listen()).get('/').set('Authorization', 'Bearer wrong').expect(401);
  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bear ${token}`)
    .expect(401);
});

test('[401] 报头令牌格式错误', async () => {
  const jwt = new JWT({ secret: 'shhhh' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({});

  await supertest(app.listen()).get('/').set('Authorization', token).expect(401);
});

test('tokenLoader', async () => {
  const jwt = new JWT({
    secret: 'shhhh',
    tokenLoader: (): string => jwt.sign({ foo: 'bar' }),
  });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  await supertest(app.listen()).get('/').expect(404);
});

test('tokenLoader也能抛出异常', async () => {
  const jwt = new JWT({
    secret: 'shhhh',
    tokenLoader: (ctx) => ctx.throw(401, '出错了'),
  });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  await supertest(app.listen()).get('/').expect(401, '出错了');
});

test('[401] tokenLoader返回了错误的token', async () => {
  const jwt = new JWT({
    secret: 'shhhh',
    tokenLoader: () => jsonwebtoken.sign({ foo: 'bar' }, 'bad-secret'),
  });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  await supertest(app.listen()).get('/').expect(401);
});

test('密码错误', async () => {
  const jwt = new JWT({
    secret: 'shhhh',
  });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jsonwebtoken.sign({ foo: 'bar' }, 'different-shhhh');

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('多个密码', async () => {
  const jwt = new JWT({
    secret: 'shhhh',
    legacySecretOrPublicKey: ['different-shhhh', 'some-other-shhhhh'],
  });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jsonwebtoken.sign({ foo: 'bar' }, 'different-shhhh');

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${jsonwebtoken.sign({ foo: 'bar' }, 'foo')}`)
    .expect(401);
});

test('从cookie获取令牌', async () => {
  const jwt = new JWT({ secret: 'shhhh', tokenFromCookie: 'jwt' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' });

  await supertest(app.listen()).get('/').set('Cookie', `jwt=${token}`).expect(404);
  await supertest(app.listen()).get('/').set('Cookie', `jwt=bad${token}`).expect(401);
});

test('从查询字符串获取令牌', async () => {
  const jwt = new JWT({ secret: 'shhhh', tokenFromQueryString: 'jwt' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' });

  await supertest(app.listen()).get(`/?jwt=${token}`).expect(404);
  await supertest(app.listen()).get(`/?jwt1=${token}`).expect(401);
});

test('令牌时效性', async () => {
  const jwt = new JWT({ secret: 'shhhh' });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' }, { expiresIn: '2s' });

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

test('令牌被销毁', async () => {
  const jwt = new JWT({ secret: 'shhhh', isRevoked: async () => true });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401, '令牌已被销毁');
});

test('issuer匹配失败', async () => {
  const jwt = new JWT({ secret: 'shhhh', verifyOptions: { issuer: 'foo' } });
  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' }, { issuer: 'bar' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('密钥对', async () => {
  const dir = import.meta.dirname;
  const jwt = new JWT({
    publicKey: readFileSync(join(dir, 'fixture', 'public-key.pem')),
    privateKey: readFileSync(join(dir, 'fixture', 'private-key.pem')),
    verifyOptions: {
      algorithms: ['RS256'],
    },
  });

  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' }, { algorithm: 'RS256' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
});

test('错误的密钥对', async () => {
  const dir = import.meta.dirname;
  const jwt = new JWT({
    publicKey: readFileSync(join(dir, 'fixture', 'wrong-public-key.pem')),
    privateKey: readFileSync(join(dir, 'fixture', 'private-key.pem')),
    verifyOptions: {
      algorithms: ['RS256'],
    },
  });

  const app = new WebApp({
    mount: [jwt.middleware],
  });
  const token = jwt.sign({ foo: 'bar' }, { algorithm: 'RS256' });

  await supertest(app.listen())
    .get('/')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('文档', () => {
  const jwt = new JWT({ secret: 'shhhh' });
  const md = jwt.middleware;
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
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
