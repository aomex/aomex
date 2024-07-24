import { expect, test } from 'vitest';
import { swaggerUI } from '../src';
import path from 'path';
import { WebApp, WebMiddleware } from '@aomex/web';
import supertest from 'supertest';
import { middleware } from '@aomex/core';

const openapiJson = path.join(import.meta.dirname, 'fixtures', 'openapi.json');
const openapiYAML = path.join(import.meta.dirname, 'fixtures', 'openapi.yaml');
const openapiYML = path.join(import.meta.dirname, 'fixtures', 'openapi.yml');

test('中间件', () => {
  expect(swaggerUI({ openapi: openapiJson })).toBeInstanceOf(WebMiddleware);
});

test('获取html', async () => {
  const app = new WebApp({
    mount: [swaggerUI({ openapi: openapiJson })],
  });
  await supertest(app.listen())
    .get('/swagger')
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
            <link rel="stylesheet" href="./swagger-ui.css" />
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="./swagger-ui.js"></script>
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle({
                  specs: '{"version":"3.0.0","info":{"title":"foo","version":""},"paths":{}}',
                  dom_id: '#swagger-ui',
                });
              };
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('修改路由前缀', async () => {
  const app = new WebApp({
    mount: [swaggerUI({ openapi: openapiJson, uriPrefix: '/api' })],
  });
  await supertest(app.listen())
    .get('/api')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8');
  await supertest(app.listen()).get('/swagger').expect(404);
});

test('穿透中间件', async () => {
  const app = new WebApp({
    mount: [
      swaggerUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/api').expect(200, 'foo-bar');
  await supertest(app.listen()).get('/swagger/not-found.js').expect(200, 'foo-bar');
});

test('只支持GET和HEAD', async () => {
  const app = new WebApp({
    mount: [
      swaggerUI({ openapi: openapiJson }),
      middleware.web((ctx) => {
        ctx.send(201, 'foo-bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/swagger').expect(200);
  await supertest(app.listen()).head('/swagger').expect(200);
  await supertest(app.listen()).post('/swagger').expect(201);
  await supertest(app.listen()).put('/swagger').expect(201);
  await supertest(app.listen()).patch('/swagger').expect(201);
  await supertest(app.listen()).delete('/swagger').expect(201);
});

test('开关', async () => {
  const app = new WebApp({
    mount: [swaggerUI({ openapi: openapiJson, enable: () => false })],
  });
  await supertest(app.listen()).get('/swagger').expect(404);
});

test('动态返回openapi文档', async () => {
  const app = new WebApp({
    mount: [
      swaggerUI({
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
    .get('/swagger')
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
            <link rel="stylesheet" href="./swagger-ui.css" />
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="./swagger-ui.js"></script>
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle({
                  specs: '{"openapi":"3.0.0","info":{"title":"a-title","version":"0.0.0"},"paths":{}}',
                  dom_id: '#swagger-ui',
                });
              };
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('yaml文档', async () => {
  const app = new WebApp({
    mount: [swaggerUI({ openapi: openapiYAML })],
  });
  await supertest(app.listen())
    .get('/swagger')
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
            <link rel="stylesheet" href="./swagger-ui.css" />
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="./swagger-ui.js"></script>
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle({
                  specs: '{"version":"3.0.0","info":{"title":"bar","version":""},"paths":{}}',
                  dom_id: '#swagger-ui',
                });
              };
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('yml文档', async () => {
  const app = new WebApp({
    mount: [swaggerUI({ openapi: openapiYML })],
  });
  await supertest(app.listen())
    .get('/swagger')
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
            <link rel="stylesheet" href="./swagger-ui.css" />
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="./swagger-ui.js"></script>
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle({
                  specs: '{"version":"3.0.0","info":{"title":"bar","version":""},"paths":{}}',
                  dom_id: '#swagger-ui',
                });
              };
            </script>
          </body>
        </html>
        "
      `);
    });
});

test('访问openapi.json', async () => {
  const app = new WebApp({
    mount: [swaggerUI({ openapi: openapiJson })],
  });
  await supertest(app.listen())
    .get('/swagger/openapi.json')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(
        `"{"version":"3.0.0","info":{"title":"foo","version":""},"paths":{}}"`,
      );
    });
});
