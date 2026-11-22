import { TestWebApp } from '../../web/src/testing';
import { expect, test } from 'vitest';
import { asyncapiUI } from '../src';
import path from 'path';
import { envelope, WebMiddleware } from '@aomex/web';
import supertest from 'supertest';
import { middleware } from '@aomex/common';
import { readFileSync } from 'node:fs';

const asyncapiJson = path.join(import.meta.dirname, 'fixtures', 'asyncapi.json');
const asyncapiYAML = path.join(import.meta.dirname, 'fixtures', 'asyncapi.yaml');
const asyncapiYML = path.join(import.meta.dirname, 'fixtures', 'asyncapi.yml');

test('中间件', () => {
  expect(asyncapiUI({ asyncapi: asyncapiJson })).toBeInstanceOf(WebMiddleware);
});

test('获取 html', async () => {
  const app = new TestWebApp({
    mount: [
      asyncapiUI({
        asyncapi: asyncapiJson,
        headTags: [
          {
            tag: 'link',
            props: {
              rel: 'shortcut icon',
              type: 'image/x-icon',
              href: 'http://host/favicon.ico',
            },
          },
        ],
      }),
    ],
  });
  await supertest(app.listen())
    .get('/asyncapi')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toContain('<title>foo</title>');
      expect(res.text).toContain('href="./asyncapi/asyncapi.min.css"');
      expect(res.text).toContain('src="./asyncapi/asyncapi-standalone.js"');
      expect(res.text).toContain("url: './asyncapi/asyncapi.json'");
      expect(res.text).toContain(
        'rel="shortcut icon" type="image/x-icon" href="http://host/favicon.ico"',
      );
      expect(res.text).toContain('AsyncApiStandalone.render');
    });
});

test('修改路由前缀', async () => {
  const app = new TestWebApp({
    mount: [asyncapiUI({ asyncapi: asyncapiJson, uriPrefix: '/docs' })],
  });
  await supertest(app.listen())
    .get('/docs')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8');
  await supertest(app.listen()).get('/asyncapi').expect(404);
});

test('穿透中间件', async () => {
  const app = new TestWebApp({
    mount: [
      asyncapiUI({ asyncapi: asyncapiJson }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/api').expect(200, 'foo-bar');
  await supertest(app.listen()).get('/asyncapi/not-found.js').expect(200, 'foo-bar');
});

test('不能通过路径穿越读取目录外文件', async () => {
  const app = new TestWebApp({
    mount: [
      asyncapiUI({ asyncapi: asyncapiJson }),
      middleware.web((ctx) => {
        ctx.send(404, 'not-found');
      }),
    ],
  });
  await supertest(app.listen())
    .get('/asyncapi..%2f..%2fserve-static%2fCHANGELOG.md')
    .expect(404, 'not-found');
  await supertest(app.listen())
    .get('/asyncapi/..%2f..%2fserve-static%2fCHANGELOG.md')
    .expect(404, 'not-found');
  await supertest(app.listen())
    .get('/asyncapi/..%2f..%2f..%2fpackage.json')
    .expect(404, 'not-found');
});

test('只支持 GET 和 HEAD', async () => {
  const app = new TestWebApp({
    mount: [
      asyncapiUI({ asyncapi: asyncapiJson }),
      middleware.web((ctx) => {
        ctx.send(201, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/asyncapi').expect(200);
  await supertest(app.listen()).head('/asyncapi').expect(200);
  await supertest(app.listen()).post('/asyncapi').expect(201);
  await supertest(app.listen()).put('/asyncapi').expect(201);
  await supertest(app.listen()).patch('/asyncapi').expect(201);
  await supertest(app.listen()).delete('/asyncapi').expect(201);
});

test('开关', async () => {
  const app = new TestWebApp({
    mount: [asyncapiUI({ asyncapi: asyncapiJson, enable: () => false })],
  });
  await supertest(app.listen()).get('/asyncapi').expect(404);
});

test('动态返回 AsyncAPI 文档', async () => {
  const app = new TestWebApp({
    mount: [
      asyncapiUI({
        asyncapi: async () => {
          return {
            asyncapi: '3.1.0',
            info: { title: 'a-title', version: '0.0.0' },
            channels: {},
            operations: {},
          };
        },
      }),
    ],
  });
  await supertest(app.listen())
    .get('/asyncapi')
    .expect(200)
    .expect((res) => {
      expect(res.text).toContain('<title>a-title</title>');
    });
});

test('yaml 文档', async () => {
  const app = new TestWebApp({
    mount: [asyncapiUI({ asyncapi: asyncapiYAML })],
  });
  await supertest(app.listen())
    .get('/asyncapi')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toContain('<title>bar</title>');
    });
});

test('yml 文档', async () => {
  const app = new TestWebApp({
    mount: [asyncapiUI({ asyncapi: asyncapiYML })],
  });
  await supertest(app.listen())
    .get('/asyncapi')
    .expect(200)
    .expect((res) => {
      expect(res.text).toContain('<title>bar</title>');
    });
});

test('访问 asyncapi.json', async () => {
  const app = new TestWebApp({
    mount: [asyncapiUI({ asyncapi: asyncapiJson })],
  });
  await supertest(app.listen())
    .get('/asyncapi/asyncapi.json')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.body).toEqual({
        asyncapi: '3.1.0',
        info: { title: 'foo', version: '1.0.0' },
        channels: {},
        operations: {},
      });
    });
});

test('配置 envelope 时 html 与 asyncapi.json 不被套壳', async () => {
  const app = new TestWebApp({
    envelope: {
      content: {
        success: envelope.success,
        data: envelope.payload,
      },
    },
    mount: [asyncapiUI({ asyncapi: asyncapiJson })],
  });
  const server = app.listen();

  await supertest(server)
    .get('/asyncapi')
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .expect((res) => {
      expect(res.text).toContain('<!doctype html>');
      expect(res.body).not.toEqual(expect.objectContaining({ success: true }));
    });

  const expected = JSON.parse(readFileSync(asyncapiJson, 'utf8'));
  await supertest(server)
    .get('/asyncapi/asyncapi.json')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect((res) => {
      expect(res.body).toEqual(expected);
      expect(res.body).not.toEqual(expect.objectContaining({ success: true }));
    });
});
