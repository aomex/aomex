import { expect, test } from 'vitest';
import { redocUI } from '../src';
import path from 'path';
import { WebApp, WebMiddleware } from '@aomex/web';
import supertest from 'supertest';
import { middleware } from '@aomex/common';

const openapiJson = path.join(import.meta.dirname, 'fixtures', 'openapi.json');
const openapiYAML = path.join(import.meta.dirname, 'fixtures', 'openapi.yaml');
const openapiYML = path.join(import.meta.dirname, 'fixtures', 'openapi.yml');

test('中间件', () => {
  expect(redocUI({ openapi: openapiJson })).toBeInstanceOf(WebMiddleware);
});

test('获取html', async () => {
  const app = new WebApp({
    mount: [
      redocUI({
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
    .get('/redoc')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh_CN">
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
            <script src="./redoc/redoc.standalone.js"></script>
          </head>
          <body>
            <div id="redoc-ui"></div>
            <script>
              Redoc.init(
                './redoc/openapi.json',
                { expandResponses: '200' },
                document.getElementById('redoc-ui'),
              );
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('修改路由前缀', async () => {
  const app = new WebApp({
    mount: [redocUI({ openapi: openapiJson, uriPrefix: '/api' })],
  });
  await supertest(app.listen())
    .get('/api')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8');
  await supertest(app.listen()).get('/redoc').expect(404);
});

test('穿透中间件', async () => {
  const app = new WebApp({
    mount: [
      redocUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/api').expect(200, 'foo-bar');
  await supertest(app.listen()).get('/redoc/not-found.js').expect(200, 'foo-bar');
});

test('只支持GET和HEAD', async () => {
  const app = new WebApp({
    mount: [
      redocUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(201, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/redoc').expect(200);
  await supertest(app.listen()).head('/redoc').expect(200);
  await supertest(app.listen()).post('/redoc').expect(201);
  await supertest(app.listen()).put('/redoc').expect(201);
  await supertest(app.listen()).patch('/redoc').expect(201);
  await supertest(app.listen()).delete('/redoc').expect(201);
});

test('开关', async () => {
  const app = new WebApp({
    mount: [redocUI({ openapi: openapiJson, enable: () => false })],
  });
  await supertest(app.listen()).get('/redoc').expect(404);
});

test('动态返回openapi文档', async () => {
  const app = new WebApp({
    mount: [
      redocUI({
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
    .get('/redoc')
    .expect(200)
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh_CN">
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
            
            <script src="./redoc/redoc.standalone.js"></script>
          </head>
          <body>
            <div id="redoc-ui"></div>
            <script>
              Redoc.init(
                './redoc/openapi.json',
                { expandResponses: '200' },
                document.getElementById('redoc-ui'),
              );
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('yaml文档', async () => {
  const app = new WebApp({
    mount: [redocUI({ openapi: openapiYAML })],
  });
  await supertest(app.listen())
    .get('/redoc')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh_CN">
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
            
            <script src="./redoc/redoc.standalone.js"></script>
          </head>
          <body>
            <div id="redoc-ui"></div>
            <script>
              Redoc.init(
                './redoc/openapi.json',
                { expandResponses: '200' },
                document.getElementById('redoc-ui'),
              );
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('yml文档', async () => {
  const app = new WebApp({
    mount: [redocUI({ openapi: openapiYML })],
  });
  await supertest(app.listen())
    .get('/redoc')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "<!doctype html>
        <html lang="zh_CN">
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
            
            <script src="./redoc/redoc.standalone.js"></script>
          </head>
          <body>
            <div id="redoc-ui"></div>
            <script>
              Redoc.init(
                './redoc/openapi.json',
                { expandResponses: '200' },
                document.getElementById('redoc-ui'),
              );
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('访问openapi.json', async () => {
  const app = new WebApp({
    mount: [redocUI({ openapi: openapiJson })],
  });
  await supertest(app.listen())
    .get('/redoc/openapi.json')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(
        `"{"version":"3.0.0","info":{"title":"foo","version":""},"paths":{}}"`,
      );
    });
});
