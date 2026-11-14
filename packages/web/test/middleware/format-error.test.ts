import { middleware, OpenAPI, rule } from '@aomex/common';
import { describe, expect, test } from 'vitest';
import supertest from 'supertest';
import { X_RESPONSE_FORMAT_DEFAULT, formatError, responseFormatKey } from '../../src';
import { TestWebApp } from '../../src/testing';

describe('formatError', () => {
  test('内侧格式优先于外侧', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          handler() {
            return { scope: 'outer' };
          },
        }),
        formatError({
          handler(err) {
            return { scope: 'inner', code: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400, { code: 'MOD_ERR' });
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ scope: 'inner', code: 'MOD_ERR' });
  });

  test('挂在 mount 最外层即全局格式', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          handler(err) {
            return { scope: 'global', code: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(403, { code: 'DENIED' });
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ scope: 'global', code: 'DENIED' });
  });

  test('不同模块可挂不同格式', async () => {
    const admin = new TestWebApp({
      mount: [
        formatError({
          handler(err) {
            return { api: 'admin', code: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(401, { code: 'ADMIN_AUTH' });
        }),
      ],
    });
    const pub = new TestWebApp({
      mount: [
        formatError({
          handler(err) {
            return { api: 'public', error: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(401, { code: 'PUBLIC_AUTH' });
        }),
      ],
    });

    const adminRes = await supertest(admin.listen()).get('/');
    const pubRes = await supertest(pub.listen()).get('/');
    expect(adminRes.body).toEqual({ api: 'admin', code: 'ADMIN_AUTH' });
    expect(pubRes.body).toEqual({ api: 'public', error: 'PUBLIC_AUTH' });
  });

  test('写完响应后仍上抛，外侧中间件能 catch', async () => {
    let outerSawError = false;
    const app = new TestWebApp({
      mount: [
        middleware.web(async (_ctx, next) => {
          try {
            await next();
          } catch (e) {
            outerSawError = true;
            const err = e as { headers?: Record<string, string> };
            err.headers = { ...err.headers, 'x-outer': '1' };
            throw e;
          }
        }),
        formatError({
          handler(err) {
            return { code: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400, { code: 'BUBBLE' });
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(outerSawError).toBe(true);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: 'BUBBLE' });
    expect(res.headers['x-outer']).toBe('1');
  });

  test('未挂 formatError 时走默认纯文本', async () => {
    const app = new TestWebApp({
      mount: [
        middleware.web((ctx) => {
          ctx.throw(400, 'bad request detail');
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(res.status).toBe(400);
    expect(res.type).toMatch(/text/);
    expect(res.text).toBe('bad request detail');
  });

  test('statusCodes 只处理列表内状态', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          statusCodes: [400],
          handler(err) {
            return { handled: true, code: err.code };
          },
        }),
        middleware.web((ctx) => {
          if (ctx.request.query['t'] === '403') {
            ctx.throw(403, { code: 'NO' });
          }
          ctx.throw(400, { code: 'YES' });
        }),
      ],
    });

    const hit = await supertest(app.listen()).get('/').query({ t: '400' });
    expect(hit.status).toBe(400);
    expect(hit.body).toEqual({ handled: true, code: 'YES' });

    const miss = await supertest(app.listen()).get('/').query({ t: '403' });
    expect(miss.status).toBe(403);
    expect(miss.type).toMatch(/text/);
    expect(miss.body).not.toEqual(expect.objectContaining({ handled: true }));
  });

  test('嵌套 statusCodes：内侧 400、外侧 500 互不抢', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          statusCodes: [500],
          handler(err) {
            return { scope: 'outer', code: err.code };
          },
        }),
        formatError({
          statusCodes: [400],
          handler(err) {
            return { scope: 'inner', code: err.code };
          },
        }),
        middleware.web((ctx) => {
          if (ctx.request.query['t'] === '500') {
            ctx.throw(500, { code: 'SVR' });
          }
          ctx.throw(400, { code: 'CLI' });
        }),
      ],
    });

    const cli = await supertest(app.listen()).get('/').query({ t: '400' });
    expect(cli.status).toBe(400);
    expect(cli.body).toEqual({ scope: 'inner', code: 'CLI' });

    const svr = await supertest(app.listen()).get('/').query({ t: '500' });
    expect(svr.status).toBe(500);
    expect(svr.body).toEqual({ scope: 'outer', code: 'SVR' });
  });

  test('内侧已格式化后外侧 formatError 因 _errorHandled 直接上抛', async () => {
    let outerHandlerCalled = false;
    const app = new TestWebApp({
      mount: [
        formatError({
          handler(err) {
            outerHandlerCalled = true;
            return { scope: 'outer', code: err.code };
          },
        }),
        formatError({
          handler(err) {
            return { scope: 'inner', code: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400, { code: 'HANDLED' });
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(outerHandlerCalled).toBe(false);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ scope: 'inner', code: 'HANDLED' });
  });

  test('err.headers 写入响应', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          handler(err) {
            return { code: err.code };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(429, {
            code: 'RATE',
            headers: { 'retry-after': '30', 'x-limit': 100 },
          });
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(res.status).toBe(429);
    expect(res.body).toEqual({ code: 'RATE' });
    expect(res.headers['retry-after']).toBe('30');
    expect(res.headers['x-limit']).toBe('100');
  });

  test('message 按 expose 净化', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          content: { message: rule.string(), expose: rule.boolean() },
          handler(err) {
            return { message: err.message, expose: err.expose };
          },
        }),
        middleware.web((ctx) => {
          if (ctx.request.query['t'] === 'expose') {
            ctx.throw(500, 'secret detail', { expose: true, code: 'X' });
          }
          ctx.throw(500, 'secret detail', { code: 'X' });
        }),
      ],
    });

    const hidden = await supertest(app.listen()).get('/');
    expect(hidden.status).toBe(500);
    expect(hidden.body).toEqual({
      message: 'Internal Server Error',
      expose: false,
    });

    const shown = await supertest(app.listen()).get('/').query({ t: 'expose' });
    expect(shown.status).toBe(500);
    expect(shown.body).toEqual({ message: 'secret detail', expose: true });
  });

  test('raw 为完整 HttpError，message 已净化', async () => {
    let rawMessage = '';
    const app = new TestWebApp({
      mount: [
        formatError({
          content: { message: rule.string() },
          handler(err) {
            rawMessage = err.raw.message;
            return { message: err.message };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(500, 'secret detail');
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(rawMessage).toBe('secret detail');
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });

  test('async handler 返回 content 对齐的 body', async () => {
    const app = new TestWebApp({
      mount: [
        formatError({
          content: { code: rule.string(), message: rule.string().optional() },
          async handler(err) {
            await Promise.resolve();
            return { code: err.code ?? 'X', message: err.message };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400, 'bad', { code: 'BAD' });
        }),
      ],
    });

    const res = await supertest(app.listen()).get('/');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: 'BAD', message: 'bad' });
  });

  test('无 content 时 handler 可返回任意 body 或省略', async () => {
    const withBody = new TestWebApp({
      mount: [
        formatError({
          handler() {
            return { loose: true };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400);
        }),
      ],
    });
    const empty = new TestWebApp({
      mount: [
        formatError({
          handler() {},
        }),
        middleware.web((ctx) => {
          ctx.throw(400, 'x');
        }),
      ],
    });

    const a = await supertest(withBody.listen()).get('/');
    expect(a.status).toBe(400);
    expect(a.body).toEqual({ loose: true });

    const b = await supertest(empty.listen()).get('/');
    expect(b.status).toBe(400);
  });

  test('content 为 string / array 时返回对应 body', async () => {
    const textApp = new TestWebApp({
      mount: [
        formatError({
          content: rule.string(),
          handler(err) {
            return err.message;
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400, 'plain-err');
        }),
      ],
    });
    const arrApp = new TestWebApp({
      mount: [
        formatError({
          content: rule.array(rule.string()),
          handler(err) {
            return [err.code ?? 'X', err.message];
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(422, 'nope', { code: 'INVALID' });
        }),
      ],
    });

    const text = await supertest(textApp.listen()).get('/');
    expect(text.status).toBe(400);
    expect(text.text).toBe('plain-err');

    const arr = await supertest(arrApp.listen()).get('/');
    expect(arr.status).toBe(422);
    expect(arr.body).toEqual(['INVALID', 'nope']);
  });
});

describe('formatError openapi', () => {
  test('省略 statusCodes 时写入 default', () => {
    const doc: OpenAPI.Document = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {
        '/': { get: { responses: {} } },
      },
    };

    const md = formatError({
      content: {
        code: rule.string(),
        message: rule.string().optional(),
      },
      handler(err) {
        return { code: err.code ?? 'HTTP_ERROR' };
      },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = {
      document: doc,
      pathName: '/',
      pathItem: doc.paths['/']!,
      methodName: 'get' as const,
    };
    md['openapi']().onMethod?.(methodItem, opts);
    expect(
      (methodItem as Record<string, unknown>)[X_RESPONSE_FORMAT_DEFAULT],
    ).toBeDefined();
    md['openapi']().postMethod?.(methodItem, opts);
    expect(
      (methodItem as Record<string, unknown>)[X_RESPONSE_FORMAT_DEFAULT],
    ).toBeUndefined();
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
                "default": {
                  "content": {
                    "application/json": {
                      "example": undefined,
                      "schema": {
                        "additionalProperties": false,
                        "properties": {
                          "code": {
                            "type": "string",
                          },
                          "message": {
                            "type": "string",
                          },
                        },
                        "required": [
                          "code",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "",
                },
              },
            },
          },
        },
      }
    `);
  });

  test('statusCodes 为每个 code 挂 x-response-format-{code}', () => {
    const doc: OpenAPI.Document = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {
        '/': { get: { responses: {} } },
      },
    };

    const md = formatError({
      content: { code: rule.string() },
      statusCodes: [400, 404],
      description: '业务错误',
      handler(err) {
        return { code: err.code ?? 'HTTP_ERROR' };
      },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = {
      document: doc,
      pathName: '/',
      pathItem: doc.paths['/']!,
      methodName: 'get' as const,
    };
    md['openapi']().onMethod?.(methodItem, opts);
    const ext = methodItem as Record<string, unknown>;
    expect(ext[X_RESPONSE_FORMAT_DEFAULT]).toBeUndefined();
    expect(ext[responseFormatKey(400)]).toBeDefined();
    expect(ext[responseFormatKey(404)]).toBeDefined();
    md['openapi']().postMethod?.(methodItem, opts);
    expect(ext[responseFormatKey(400)]).toBeUndefined();
    expect(ext[responseFormatKey(404)]).toBeUndefined();
    expect(doc.paths['/']!.get!.responses).toMatchInlineSnapshot(`
      {
        "400": {
          "content": {
            "application/json": {
              "example": undefined,
              "schema": {
                "additionalProperties": false,
                "properties": {
                  "code": {
                    "type": "string",
                  },
                },
                "required": [
                  "code",
                ],
                "type": "object",
              },
            },
          },
          "description": "业务错误",
        },
        "404": {
          "content": {
            "application/json": {
              "example": undefined,
              "schema": {
                "additionalProperties": false,
                "properties": {
                  "code": {
                    "type": "string",
                  },
                },
                "required": [
                  "code",
                ],
                "type": "object",
              },
            },
          },
          "description": "业务错误",
        },
      }
    `);
  });

  test('contentType 推断与简写', () => {
    expect(
      formatError({
        content: rule.string(),
        contentType: 'json',
        handler() {
          return 'x';
        },
      })['getContentType'](),
    ).toBe('application/json');

    expect(
      formatError({
        content: { foo: rule.string() },
        handler() {
          return { foo: 'a' };
        },
      })['getContentType'](),
    ).toBe('application/json');

    expect(
      formatError({
        content: rule.array(rule.string()),
        handler() {
          return ['a'];
        },
      })['getContentType'](),
    ).toBe('application/json');

    expect(
      formatError({
        content: rule.string(),
        handler() {
          return 'x';
        },
      })['getContentType'](),
    ).toBe('text/plain');

    expect(
      formatError({
        content: rule.number(),
        handler() {
          return 1;
        },
      })['getContentType'](),
    ).toBe('text/plain');

    expect(
      formatError({
        content: rule.boolean(),
        handler() {
          return true;
        },
      })['getContentType'](),
    ).toBe('text/plain');

    expect(
      formatError({
        content: rule.file(),
        // 仅测 contentType 推断；file 推断非 Body，断言绕过
        handler: () => null as never,
      })['getContentType'](),
    ).toBe('application/octet-stream');

    expect(
      formatError({
        content: rule.string(),
        contentType: 'application/*',
        handler() {
          return 'x';
        },
      })['getContentType'](),
    ).toBe('application/*');
  });

  test('无 content 仍可写 default 响应槽', () => {
    const doc: OpenAPI.Document = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {
        '/': { get: { responses: {} } },
      },
    };

    const md = formatError({
      description: '未声明结构',
      handler() {
        return 'plain';
      },
    });
    md['openapi']().onMethod?.(doc.paths['/']!.get!, {
      document: doc,
      pathName: '/',
      pathItem: doc.paths['/']!,
      methodName: 'get',
    });
    expect(doc.paths['/']!.get!.responses).toEqual({
      default: { description: '未声明结构' },
    });
  });

  test('statusCodes 为空数组时不写任何响应槽', () => {
    const doc: OpenAPI.Document = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {
        '/': { get: { responses: {} } },
      },
    };

    const md = formatError({
      content: { code: rule.string() },
      statusCodes: [],
      handler(err) {
        return { code: err.code ?? 'X' };
      },
    });
    md['openapi']().onMethod?.(doc.paths['/']!.get!, {
      document: doc,
      pathName: '/',
      pathItem: doc.paths['/']!,
      methodName: 'get',
    });
    expect(doc.paths['/']!.get!.responses).toEqual({});
  });

  test('允许带报头', () => {
    const doc: OpenAPI.Document = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {
        '/': { get: { responses: {} } },
      },
    };

    const md = formatError({
      content: { code: rule.string() },
      headers: {
        'x-error-id': rule.string(),
      },
      handler(err) {
        return { code: err.code ?? 'X' };
      },
    });
    md['openapi']().onMethod?.(doc.paths['/']!.get!, {
      document: doc,
      pathName: '/',
      pathItem: doc.paths['/']!,
      methodName: 'get',
    });
    expect(doc.paths['/']!.get!.responses['default']).toMatchInlineSnapshot(`
      {
        "content": {
          "application/json": {
            "example": undefined,
            "schema": {
              "additionalProperties": false,
              "properties": {
                "code": {
                  "type": "string",
                },
              },
              "required": [
                "code",
              ],
              "type": "object",
            },
          },
        },
        "description": "",
        "headers": {
          "x-error-id": {
            "required": true,
            "schema": {
              "type": "string",
            },
          },
        },
      }
    `);
  });
});
