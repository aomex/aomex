import { middleware, OpenAPI, rule } from '@aomex/common';
import { describe, expect, test } from 'vitest';
import {
  WebMiddleware,
  X_SKIP_ENVELOPE,
  envelope,
  formatError,
  response,
} from '../../src';
import { createEnvelopeMiddleware } from '../../src/middleware/envelope';
import { TestWebApp } from '../../src/testing';

/** 取 envelope 中间件的 OpenAPI injector，便于单测 postMethod */
const envelopeOpenApi = (options: Parameters<typeof createEnvelopeMiddleware>[0]) =>
  createEnvelopeMiddleware(options)['openapi']();

const baseEnvelope = {
  content: {
    success: envelope.success,
    statusCode: envelope.statusCode,
    data: envelope.payload,
  },
} as const;

describe('envelope openapi middleware', () => {
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
    const env = envelopeOpenApi({
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
    const env = envelopeOpenApi({
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
    const env = envelopeOpenApi({
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
    const env = envelopeOpenApi({
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
    const env = envelopeOpenApi({
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
    const env = envelopeOpenApi({
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

  test('response({ skipEnvelope }) 仅该状态码不套壳，其它状态仍收成 200', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const ok = response({
      statusCode: 200,
      content: { id: rule.number() },
      skipEnvelope: true,
    });
    const err = formatError({
      content: { code: rule.string(), message: rule.string() },
      handler(e) {
        return { code: e.code ?? 'ERR', message: e.message };
      },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    err['openapi']().onMethod?.(methodItem, opts);
    ok['openapi']().onMethod?.(methodItem, opts);
    expect((methodItem as Record<string, unknown>)[X_SKIP_ENVELOPE]).toEqual([200]);

    err['openapi']().postMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    // 200：裸成功 schema 与套壳错误 schema 的 oneOf
    expect(schema200(methodItem)).toMatchObject({
      oneOf: [
        {
          type: 'object',
          properties: { id: { type: 'number' } },
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
    });
  });

  test('仅错误状态 skipEnvelope 时成功仍套壳、错误保留原状态码', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const ok = response({
      statusCode: 200,
      content: { id: rule.number() },
    });
    const bad = response({
      statusCode: 400,
      content: { message: rule.string() },
      skipEnvelope: true,
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    ok['openapi']().onMethod?.(methodItem, opts);
    bad['openapi']().onMethod?.(methodItem, opts);
    expect((methodItem as Record<string, unknown>)[X_SKIP_ENVELOPE]).toEqual([400]);

    env.postMethod?.(methodItem, opts);

    expect(methodItem.responses['400']).toMatchObject({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { message: { type: 'string' } },
          },
        },
      },
    });
    expect(schema200(methodItem)).toMatchObject({
      type: 'object',
      required: ['success', 'statusCode', 'data'],
      properties: {
        success: { type: 'boolean', enum: [true] },
        data: {
          type: 'object',
          properties: { id: { type: 'number' } },
        },
      },
    });
  });

  test('多个 skipEnvelope 累计状态码且去重', () => {
    const doc = blankDoc();
    const a = response({
      statusCode: 200,
      content: { id: rule.number() },
      skipEnvelope: true,
    });
    const b = response({
      statusCode: 201,
      content: { id: rule.number() },
      skipEnvelope: true,
    });
    const again = response({
      statusCode: 200,
      content: { id: rule.number() },
      skipEnvelope: true,
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    a['openapi']().onMethod?.(methodItem, opts);
    b['openapi']().onMethod?.(methodItem, opts);
    again['openapi']().onMethod?.(methodItem, opts);

    expect((methodItem as Record<string, unknown>)[X_SKIP_ENVELOPE]).toEqual([200, 201]);
  });

  test('全部成功状态均 skip 时不虚构套壳 200，仅保留原声明', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const ok = response({
      statusCode: 200,
      content: { id: rule.number() },
      skipEnvelope: true,
    });
    const created = response({
      statusCode: 201,
      content: { id: rule.number() },
      skipEnvelope: true,
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    ok['openapi']().onMethod?.(methodItem, opts);
    created['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(Object.keys(methodItem.responses!).sort()).toEqual(['200', '201']);
    expect(schema200(methodItem)).toMatchObject({
      type: 'object',
      properties: { id: { type: 'number' } },
    });
    expect(schema200(methodItem)).not.toHaveProperty('oneOf');
    expect(
      (methodItem.responses['201'] as OpenAPI.ResponseObject).content![
        'application/json'
      ]!.schema,
    ).toMatchObject({
      type: 'object',
      properties: { id: { type: 'number' } },
    });
  });

  test('skip 200 且另有成功+错误需套壳时，200 合并为多支 oneOf', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const raw200 = response({
      statusCode: 200,
      content: { raw: rule.boolean() },
      skipEnvelope: true,
    });
    const created = response({
      statusCode: 201,
      content: { id: rule.number() },
    });
    const err = formatError({
      content: { code: rule.string(), message: rule.string() },
      handler(e) {
        return { code: e.code ?? 'ERR', message: e.message };
      },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    err['openapi']().onMethod?.(methodItem, opts);
    raw200['openapi']().onMethod?.(methodItem, opts);
    created['openapi']().onMethod?.(methodItem, opts);
    err['openapi']().postMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    expect(schema200(methodItem)).toMatchObject({
      oneOf: [
        {
          type: 'object',
          properties: { raw: { type: 'boolean' } },
        },
        {
          type: 'object',
          required: ['success', 'statusCode', 'data'],
          properties: {
            success: { type: 'boolean', enum: [true] },
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
    });
  });

  test('无 schema 的成功/错误声明在非 skip 时仍进入套壳支', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      description: '套壳',
      content: baseEnvelope.content,
    });
    const methodItem = doc.paths['/']!.get!;
    methodItem.responses = {
      '200': { description: 'ok' },
      '400': { description: 'bad' },
    };

    env.postMethod?.(methodItem, optsFor(doc));

    expect(methodItem.responses['200']).toMatchObject({
      description: '套壳',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  success: { type: 'boolean', enum: [true] },
                  data: {},
                },
              },
              {
                type: 'object',
                properties: {
                  success: { type: 'boolean', enum: [false] },
                  data: {},
                },
              },
            ],
          },
        },
      },
    });
  });

  test('skip 200 无 content + 需套壳错误时保留原声明并追加套壳 JSON', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      description: '统一套壳',
      content: baseEnvelope.content,
    });
    const raw = response({
      statusCode: 200,
      description: '裸成功',
      skipEnvelope: true,
    });
    const bad = response({
      statusCode: 400,
      content: { message: rule.string() },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    raw['openapi']().onMethod?.(methodItem, opts);
    bad['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    const res200 = methodItem.responses['200'] as OpenAPI.ResponseObject;
    expect(res200.description).toBe('裸成功');
    expect(res200).toMatchObject({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['success', 'statusCode', 'data'],
            properties: {
              success: { type: 'boolean', enum: [false] },
              data: {
                type: 'object',
                properties: { message: { type: 'string' } },
              },
            },
          },
        },
      },
    });
    expect(methodItem.responses['400']).toBeUndefined();
  });

  test('skip 200 为非 JSON media 时保留原 content，套壳写入 application/json', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const html = response({
      statusCode: 200,
      content: rule.string(),
      contentType: 'html',
      skipEnvelope: true,
    });
    const bad = response({
      statusCode: 400,
      content: { message: rule.string() },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    html['openapi']().onMethod?.(methodItem, opts);
    bad['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    const res200 = methodItem.responses['200'] as OpenAPI.ResponseObject;
    expect(res200.content).toMatchObject({
      'text/html': {
        schema: { type: 'string' },
      },
      'application/json': {
        schema: {
          type: 'object',
          required: ['success', 'statusCode', 'data'],
          properties: {
            success: { type: 'boolean', enum: [false] },
            data: {
              type: 'object',
              properties: { message: { type: 'string' } },
            },
          },
        },
      },
    });
    expect(res200.content!['text/html']).toBeDefined();
    expect(schema200(methodItem)).not.toHaveProperty('oneOf');
  });

  test('skip 200 带 headers/example 时合并后仍保留', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const raw = response({
      statusCode: 200,
      content: { id: rule.number() },
      example: { id: 42 },
      headers: { 'x-trace': rule.string() },
      skipEnvelope: true,
    });
    const bad = response({
      statusCode: 400,
      content: { message: rule.string() },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    raw['openapi']().onMethod?.(methodItem, opts);
    bad['openapi']().onMethod?.(methodItem, opts);
    env.postMethod?.(methodItem, opts);

    const res200 = methodItem.responses['200'] as OpenAPI.ResponseObject;
    expect(res200.headers).toMatchObject({
      'x-trace': { schema: { type: 'string' } },
    });
    expect(res200.content!['application/json']).toMatchObject({
      example: { id: 42 },
      schema: {
        oneOf: [
          {
            type: 'object',
            properties: { id: { type: 'number' } },
          },
          {
            type: 'object',
            required: ['success', 'statusCode', 'data'],
            properties: {
              success: { type: 'boolean', enum: [false] },
              data: {
                type: 'object',
                properties: { message: { type: 'string' } },
              },
            },
          },
        ],
      },
    });
  });

  test('x-skip-envelope 非数组时按空集合处理', () => {
    const doc = blankDoc();
    const env = envelopeOpenApi({
      content: baseEnvelope.content,
    });
    const ok = response({
      statusCode: 200,
      content: { id: rule.number() },
    });
    const methodItem = doc.paths['/']!.get!;
    const opts = optsFor(doc);

    ok['openapi']().onMethod?.(methodItem, opts);
    (methodItem as Record<string, unknown>)[X_SKIP_ENVELOPE] = true;
    env.postMethod?.(methodItem, opts);

    expect(schema200(methodItem)).toMatchObject({
      type: 'object',
      required: ['success', 'statusCode', 'data'],
      properties: {
        success: { type: 'boolean', enum: [true] },
        data: {
          type: 'object',
          properties: { id: { type: 'number' } },
        },
      },
    });
  });
});

test('配置 envelope 时自动插入最外层文档中间件', () => {
  const userMd = middleware.web(() => {});
  const app = new TestWebApp({
    envelope: {
      content: {
        success: envelope.success,
        data: envelope.payload,
      },
    },
    mount: [userMd],
  });
  const list = app['middlewareList'];
  expect(list).toHaveLength(2);
  expect(list[0]).toBeInstanceOf(WebMiddleware);
  expect(list[0]).not.toBe(userMd);
  expect(list[1]).toBe(userMd);
  expect(typeof (list[0] as WebMiddleware)['openapi']().postMethod).toBe('function');
});

test('未配置 envelope 时不插入套壳中间件', () => {
  const userMd = middleware.web(() => {});
  const app = new TestWebApp({ mount: [userMd] });
  expect(app['middlewareList']).toEqual([userMd]);
});
