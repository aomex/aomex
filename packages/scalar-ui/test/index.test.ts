import { TestWebApp } from '../../web/src/testing';
import { expect, test } from 'vitest';
import { scalarUI } from '../src';
import path from 'path';
import { envelope, WebMiddleware } from '@aomex/web';
import supertest from 'supertest';
import { middleware } from '@aomex/common';
import { readFileSync } from 'node:fs';
const openapiJson = path.join(import.meta.dirname, 'fixtures', 'openapi.json');
const openapiYAML = path.join(import.meta.dirname, 'fixtures', 'openapi.yaml');
const openapiYML = path.join(import.meta.dirname, 'fixtures', 'openapi.yml');

test('中间件', () => {
  expect(scalarUI({ openapi: openapiJson })).toBeInstanceOf(WebMiddleware);
});

test('获取html', async () => {
  const app = new TestWebApp({
    mount: [
      scalarUI({
        openapi: openapiJson,
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
    .get('/scalar')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh-CN">
          <head>
            <meta charset="utf-8" />
            <title>foo</title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="renderer" content="webkit" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            />
            <style>
              body {
                margin: 0;
                padding: 0;
              }
            </style>
            <link rel="shortcut icon" type="image/x-icon" href="http://host/favicon.ico" />
          </head>
          <body>
            <div id="scalar-ui"></div>
            <script src="./scalar/standalone.js"></script>
            <script>
              Scalar.createApiReference('#scalar-ui', {
                url: './scalar/openapi.json',
                telemetry: false,
                showDeveloperTools: 'never',
              });
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('修改路由前缀', async () => {
  const app = new TestWebApp({
    mount: [scalarUI({ openapi: openapiJson, uriPrefix: '/api' })],
  });
  await supertest(app.listen())
    .get('/api')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8');
  await supertest(app.listen()).get('/scalar').expect(404);
});

test('穿透中间件', async () => {
  const app = new TestWebApp({
    mount: [
      scalarUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/api').expect(200, 'foo-bar');
  await supertest(app.listen()).get('/scalar/not-found.js').expect(200, 'foo-bar');
});

test('不能通过路径穿越读取scalar目录外文件', async () => {
  const app = new TestWebApp({
    mount: [
      scalarUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(404, 'not-found');
      }),
    ],
  });
  await supertest(app.listen())
    .get('/scalar..%2f..%2fserve-static%2fCHANGELOG.md')
    .expect(404, 'not-found');
  await supertest(app.listen())
    .get('/scalar/..%2f..%2fserve-static%2fCHANGELOG.md')
    .expect(404, 'not-found');
  await supertest(app.listen())
    .get('/scalar/..%2f..%2f..%2fpackage.json')
    .expect(404, 'not-found');
});

test('只支持GET和HEAD', async () => {
  const app = new TestWebApp({
    mount: [
      scalarUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(201, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/scalar').expect(200);
  await supertest(app.listen()).head('/scalar').expect(200);
  await supertest(app.listen()).post('/scalar').expect(201);
  await supertest(app.listen()).put('/scalar').expect(201);
  await supertest(app.listen()).patch('/scalar').expect(201);
  await supertest(app.listen()).delete('/scalar').expect(201);
});

test('开关', async () => {
  const app = new TestWebApp({
    mount: [scalarUI({ openapi: openapiJson, enable: () => false })],
  });
  await supertest(app.listen()).get('/scalar').expect(404);
});

test('动态返回openapi文档', async () => {
  const app = new TestWebApp({
    mount: [
      scalarUI({
        openapi: async () => {
          return {
            openapi: '3.0.0',
            info: { title: 'a-title', version: '0.0.0' },
            paths: {},
          };
        },
      }),
    ],
  });
  await supertest(app.listen())
    .get('/scalar')
    .expect(200)
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh-CN">
          <head>
            <meta charset="utf-8" />
            <title>a-title</title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="renderer" content="webkit" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            />
            <style>
              body {
                margin: 0;
                padding: 0;
              }
            </style>
            
          </head>
          <body>
            <div id="scalar-ui"></div>
            <script src="./scalar/standalone.js"></script>
            <script>
              Scalar.createApiReference('#scalar-ui', {
                url: './scalar/openapi.json',
                telemetry: false,
                showDeveloperTools: 'never',
              });
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('yaml文档', async () => {
  const app = new TestWebApp({
    mount: [scalarUI({ openapi: openapiYAML })],
  });
  await supertest(app.listen())
    .get('/scalar')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh-CN">
          <head>
            <meta charset="utf-8" />
            <title>bar</title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="renderer" content="webkit" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            />
            <style>
              body {
                margin: 0;
                padding: 0;
              }
            </style>
            
          </head>
          <body>
            <div id="scalar-ui"></div>
            <script src="./scalar/standalone.js"></script>
            <script>
              Scalar.createApiReference('#scalar-ui', {
                url: './scalar/openapi.json',
                telemetry: false,
                showDeveloperTools: 'never',
              });
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('yml文档', async () => {
  const app = new TestWebApp({
    mount: [scalarUI({ openapi: openapiYML })],
  });
  await supertest(app.listen())
    .get('/scalar')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh-CN">
          <head>
            <meta charset="utf-8" />
            <title>bar</title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="renderer" content="webkit" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            />
            <style>
              body {
                margin: 0;
                padding: 0;
              }
            </style>
            
          </head>
          <body>
            <div id="scalar-ui"></div>
            <script src="./scalar/standalone.js"></script>
            <script>
              Scalar.createApiReference('#scalar-ui', {
                url: './scalar/openapi.json',
                telemetry: false,
                showDeveloperTools: 'never',
              });
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('访问openapi.json', async () => {
  const app = new TestWebApp({
    mount: [scalarUI({ openapi: openapiJson })],
  });
  await supertest(app.listen())
    .get('/scalar/openapi.json')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(
        `"{"version":"3.0.0","info":{"title":"foo","version":""},"paths":{}}"`,
      );
    });
});

test('配置 envelope 时 html 与 openapi.json 不被套壳', async () => {
  const app = new TestWebApp({
    envelope: {
      content: {
        success: envelope.success,
        data: envelope.payload,
      },
    },
    mount: [scalarUI({ openapi: openapiJson })],
  });
  const server = app.listen();

  await supertest(server)
    .get('/scalar')
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .expect((res) => {
      expect(res.text).toContain('<!doctype html>');
      expect(res.body).not.toEqual(expect.objectContaining({ success: true }));
    });

  const expected = JSON.parse(readFileSync(openapiJson, 'utf8'));
  await supertest(server)
    .get('/scalar/openapi.json')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect((res) => {
      expect(res.body).toEqual(expected);
      expect(res.body).not.toEqual(expect.objectContaining({ success: true }));
    });
});
