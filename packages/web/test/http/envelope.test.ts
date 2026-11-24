import { middleware, rule } from '@aomex/common';
import { Readable } from 'node:stream';
import { describe, expect, test } from 'vitest';
import supertest from 'supertest';
import { envelope, formatError, response } from '../../src';
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

  test('envelope.slot 可读 ctx', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          data: envelope.payload,
          path: envelope.slot(rule.string(), (_vars, ctx) => ctx.request.pathname),
          method: envelope.slot(rule.string(), (_vars, ctx) => ctx.request.method),
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.send({ ok: true });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: { ok: true },
      path: '/',
      method: 'GET',
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

  test('Content-Type 为 json 且 body 为 JSON 字符串时，data 保持对象', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          success: envelope.success,
          data: envelope.payload,
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.response.contentType = 'json';
          ctx.response.body = JSON.stringify({ id: 1 });
        }),
      ],
    });
    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { id: 1 } });
    expect(typeof res.body.data).toBe('object');
  });

  test('Content-Type 为 json 但字符串非法 JSON 时，data 仍为原字符串', async () => {
    const app = new TestWebApp({
      envelope: {
        content: {
          success: envelope.success,
          data: envelope.payload,
        },
      },
      mount: [
        middleware.web((ctx) => {
          ctx.response.contentType = 'json';
          ctx.response.body = '{broken';
        }),
      ],
    });
    const res = await get(app);
    expect(res.body).toEqual({ success: true, data: '{broken' });
  });

  test('套壳时删除原 ETag', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.response.setHeader('ETag', '"raw-body"');
          ctx.send({ id: 1 });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      statusCode: 200,
      data: { id: 1 },
    });
    expect(res.headers).not.toHaveProperty('etag');
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

  test('skipEnvelope 跳过套壳', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.response.skipEnvelope = true;
          ctx.send(201, { id: 1 });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1 });
  });

  test('skipEnvelope 对 string 响应同样生效', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        middleware.web((ctx) => {
          ctx.response.skipEnvelope = true;
          ctx.send('<html></html>');
          ctx.response.contentType = 'html';
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.text).toBe('<html></html>');
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  test('response({ skipEnvelope }) 仅跳过登记的状态码', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        response({
          statusCode: 200,
          content: { id: rule.number() },
          skipEnvelope: true,
        }),
        response({
          statusCode: 400,
          content: { message: rule.string() },
        }),
        middleware.web((ctx) => {
          if (ctx.request.query['err']) {
            ctx.send(400, { message: 'bad' });
            return;
          }
          ctx.send({ id: 1 });
        }),
      ],
    });

    const ok = await get(app);
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ id: 1 });

    const err = await supertest(app.listen()).get('/?err=1');
    expect(err.status).toBe(200);
    expect(err.body).toEqual({
      success: false,
      statusCode: 400,
      data: { message: 'bad' },
    });
  });

  test('response({ skipEnvelope }) 可登记多个状态码', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        response({
          statusCode: 200,
          content: { id: rule.number() },
          skipEnvelope: true,
        }),
        response({
          statusCode: 201,
          content: { id: rule.number() },
          skipEnvelope: true,
        }),
        middleware.web((ctx) => {
          ctx.send(ctx.request.query['created'] ? 201 : 200, { id: 1 });
        }),
      ],
    });

    const created = await supertest(app.listen()).get('/?created=1');
    expect(created.status).toBe(201);
    expect(created.body).toEqual({ id: 1 });

    const ok = await get(app);
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ id: 1 });
  });

  test('response({ skipEnvelope: false }) 不登记，仍套壳', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        response({
          statusCode: 200,
          content: { id: rule.number() },
          skipEnvelope: false,
        }),
        middleware.web((ctx) => {
          ctx.send({ id: 1 });
        }),
      ],
    });

    const res = await get(app);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      statusCode: 200,
      data: { id: 1 },
    });
  });

  test('仅登记 400 skip 时，400 裸响应、200 仍套壳', async () => {
    const app = new TestWebApp({
      envelope: baseEnvelope,
      mount: [
        response({
          statusCode: 200,
          content: { id: rule.number() },
        }),
        response({
          statusCode: 400,
          content: { message: rule.string() },
          skipEnvelope: true,
        }),
        middleware.web((ctx) => {
          if (ctx.request.query['err']) {
            ctx.send(400, { message: 'bad' });
            return;
          }
          ctx.send({ id: 1 });
        }),
      ],
    });

    const ok = await get(app);
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({
      success: true,
      statusCode: 200,
      data: { id: 1 },
    });

    const err = await supertest(app.listen()).get('/?err=1');
    expect(err.status).toBe(400);
    expect(err.body).toEqual({ message: 'bad' });
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
