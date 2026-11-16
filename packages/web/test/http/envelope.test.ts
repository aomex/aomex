import { middleware, OpenAPI, rule } from '@aomex/common';
import { Readable } from 'node:stream';
import { describe, expect, test } from 'vitest';
import supertest from 'supertest';
import {
  createEnvelopeOpenApiInjector,
  envelope,
  formatError,
  response,
} from '../../src';
import { TestWebApp } from '../../src/testing';

const baseEnvelope = {
  content: {
    success: envelope.success,
    statusCode: envelope.statusCode,
    data: envelope.payload,
  },
} as const;

const get = (app: TestWebApp) => supertest(app.listen()).get('/');

describe('envelope runtime', () => {
  test('成功响应套壳并固定 200', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.send(201, { id: 1 });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      statusCode: 201,
      data: { id: 1 },
    });
  });

  test('与 formatError 协作：错误 body 入 payload，HTTP 仍 200', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        formatError({
          content: { code: rule.string(), message: rule.string() },
          handler(err) {
            return { code: err.code ?? 'ERR', message: err.message };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(400, '参数错误', { code: 'BAD' });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: false,
      statusCode: 400,
      data: { code: 'BAD', message: '参数错误' },
    });
  });

  test('无 formatError 时错误也套壳（onError 纯文本入 payload）', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.throw(400, '裸错误');
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(res.body).toEqual({
      success: false,
      statusCode: 400,
      data: '裸错误',
    });
  });

  test('envelope.slot 可派生字段', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          ok: envelope.success,
          data: envelope.payload,
          version: envelope.slot(rule.string(), () => '1.0'),
          flag: envelope.slot(rule.string(), ({ statusCode }) => String(statusCode)),
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.send({ x: 1 });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      data: { x: 1 },
      version: '1.0',
      flag: '200',
    });
  });

  test('string body 可包', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          success: envelope.success,
          data: envelope.payload,
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.send('hello');
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(res.text).toBe(JSON.stringify({ success: true, data: 'hello' }));
    expect(res.body).toEqual({ success: true, data: 'hello' });
  });

  test('3xx 重定向不套壳', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          success: envelope.success,
          data: envelope.payload,
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.response.redirect(301, 'https://example.com/');
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(301);
    expect(res.headers['location']).toBe('https://example.com/');
  });

  test.each([204, 205] as const)('%s 无内容状态码不套壳', async (code) => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.send(code);
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(code);
    expect(res.text).toBe('');
    expect(res.headers['content-type']).toBeUndefined();
  });

  test('null body（未显式内容的 404）也会套壳', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web(() => {
          // 不 send：保持默认 404 + null body
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: false,
      statusCode: 404,
      data: null,
    });
  });

  test('buffer 不套壳', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          success: envelope.success,
          data: envelope.payload,
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.send(Buffer.from('bin'));
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(Buffer.isBuffer(res.body) || typeof res.body === 'object').toBeTruthy();
    expect(res.body).not.toEqual(expect.objectContaining({ success: true }));
    expect(res.text === 'bin' || Buffer.from(res.body).toString() === 'bin').toBe(true);
  });

  test('嵌套对象结构', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          meta: {
            ok: envelope.success,
            code: envelope.statusCode,
          },
          result: envelope.payload,
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.send({ n: 2 });
        }),
      ],
    });

    const res = await get(app);
    expect(res.body).toEqual({
      meta: { ok: true, code: 200 },
      result: { n: 2 },
    });
  });

  test('未配置 envelope 时行为不变', async () => {
    const app = new TestWebApp({
      mount: [
        middleware.web((ctx) => {
          ctx.throw(400, '裸错误');
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(400);
    expect(res.type).toMatch(/text/);
    expect(res.text).toBe('裸错误');
  });

  test('5xx + formatError：success false，原 statusCode 入槽', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        formatError({
          handler(err) {
            return { code: err.code ?? 'ERR', message: err.message };
          },
        }),
        middleware.web((ctx) => {
          ctx.throw(503, '维护中', { code: 'MAINT', expose: true });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: false,
      statusCode: 503,
      data: { code: 'MAINT', message: '维护中' },
    });
  });

  test('5xx 无 formatError：payload 为标准文案（非内部 detail）', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.throw(500, 'secret stack detail');
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: false,
      statusCode: 500,
      data: 'Internal Server Error',
    });
  });

  test('stream 不套壳', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.send(Readable.from([Buffer.from('stream-body')]));
        }),
      ],
    });

    const res = await supertest(app.listen())
      .get('/')
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.from(c)));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      });
    expect(res.status).toBe(200);
    expect(Buffer.from(res.body).toString()).toBe('stream-body');
    expect(res.body).not.toEqual(expect.objectContaining({ success: true }));
  });

  test('SSE 不套壳（headersSent）', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web(async (ctx) => {
          const sse = ctx.sse({ heartbeat: false });
          sse.send({ data: { hello: 1 } });
          sse.close();
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/event-stream/);
    expect(res.text).toContain('data: {"hello":1}');
    expect(res.text).not.toContain('"success"');
  });
});

describe('envelope openapi helper', () => {
  const blankDoc = (): OpenAPI.Document => ({
    openapi: '',
    info: { title: '', version: '' },
    paths: { '/': { get: { responses: {} } } },
  });

  const optsFor = (doc: OpenAPI.Document) => ({
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  });

  const schema200 = (methodItem: OpenAPI.OperationObject) =>
    (methodItem.responses['200'] as OpenAPI.ResponseObject).content!['application/json']!
      .schema!;

  test('将 2xx 与 default 收成 200 成败 oneOf，保留 3xx 与无内容状态码', () => {
    const doc = blankDoc();
    const env = createEnvelopeOpenApiInjector({
      description: '统一响应体套壳',
      content: baseEnvelope.content,
    });
    const err = formatError({
      content: { code: rule.string(), message: rule.string() },
      handler(err) {
        return { code: err.code ?? 'ERR', message: err.message };
      },
    });
    const ok = response({
      statusCode: 200,
      content: { id: rule.number() },
    });
    const redirect = response({
      statusCode: 302,
      description: '跳转',
    });
    const empty = response({
      statusCode: 204,
      description: '无内容',
    });

    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    err['openapi']().onMethod?.(methodItem, opts);
    ok['openapi']().onMethod?.(methodItem, opts);
    redirect['openapi']().onMethod?.(methodItem, opts);
    empty['openapi']().onMethod?.(methodItem, opts);

    err['openapi']().postMethod?.(methodItem, opts);
    ok['openapi']().postMethod?.(methodItem, opts);
    redirect['openapi']().postMethod?.(methodItem, opts);
    empty['openapi']().postMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['302']).toMatchObject({ description: '跳转' });
    expect(methodItem.responses['204']).toMatchObject({ description: '无内容' });
    expect(methodItem.responses['default']).toBeUndefined();
    expect(Object.keys(methodItem.responses!).sort()).toEqual(['200', '204', '302']);
    expect(methodItem.responses['200']).toMatchObject({
      description: '统一响应体套壳',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                type: 'object',
                required: ['success', 'statusCode', 'data'],
                properties: {
                  success: { type: 'boolean', enum: [true] },
                  statusCode: { type: 'integer' },
                  data: {
                    type: 'object',
                    properties: { id: { type: 'number' } },
                  },
                },
              },
              {
                type: 'object',
                required: ['success', 'statusCode', 'data'],
                properties: {
                  success: { type: 'boolean', enum: [false] },
                  statusCode: { type: 'integer' },
                  data: {
                    type: 'object',
                    properties: {
                      code: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    });
  });

  test('仅成功支：无 oneOf，success const true', () => {
    const doc = blankDoc();
    const env = createEnvelopeOpenApiInjector({
      content: baseEnvelope.content,
    });
    const ok = response({
      statusCode: 200,
      content: rule.string(),
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    ok['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', enum: [true] },
              statusCode: { type: 'integer' },
              data: { type: 'string' },
            },
          },
        },
      },
    });
    expect(schema200(methodItem)).not.toHaveProperty('oneOf');
  });

  test('仅失败支：无 oneOf，success const false', () => {
    const doc = blankDoc();
    const env = createEnvelopeOpenApiInjector({
      content: baseEnvelope.content,
    });
    const err = formatError({
      content: { code: rule.string() },
      handler(err) {
        return { code: err.code ?? 'ERR' };
      },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    err['openapi']().onMethod?.(methodItem, opts);
    err['openapi']().postMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['default']).toBeUndefined();
    expect(methodItem.responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', enum: [false] },
              data: {
                type: 'object',
                properties: { code: { type: 'string' } },
              },
            },
          },
        },
      },
    });
    expect(schema200(methodItem)).not.toHaveProperty('oneOf');
  });

  test('无任何 responses：骨架支，success 无 enum', () => {
    const doc = blankDoc();
    const env = createEnvelopeOpenApiInjector({
      content: baseEnvelope.content,
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              statusCode: { type: 'integer' },
              data: {},
            },
          },
        },
      },
    });
    const schema = schema200(methodItem) as OpenAPI.SchemaObject;
    expect(schema).not.toHaveProperty('oneOf');
    expect(schema.properties!['success']).not.toHaveProperty('enum');
  });

  test('仅有无内容状态码时不虚构 200 套壳', () => {
    const doc = blankDoc();
    const env = createEnvelopeOpenApiInjector({
      content: baseEnvelope.content,
    });
    const empty = response({
      statusCode: 204,
      description: '已删除',
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    empty['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['204']).toMatchObject({ description: '已删除' });
    expect(methodItem.responses['200']).toBeUndefined();
    expect(Object.keys(methodItem.responses!)).toEqual(['204']);
  });

  test('自定义 slot 的 schema 写入文档', () => {
    const doc = blankDoc();
    const env = createEnvelopeOpenApiInjector({
      content: {
        success: envelope.success,
        data: envelope.payload,
        version: envelope.slot(rule.string(), () => '1'),
      },
    });
    const ok = response({
      statusCode: 200,
      content: rule.number(),
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    ok['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['200']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', enum: [true] },
              data: { type: 'number' },
              version: { type: 'string' },
            },
          },
        },
      },
    });
  });
});
