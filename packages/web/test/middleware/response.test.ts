import { OpenAPI, compose, rule } from '@aomex/common';
import { describe, expect, test, vitest } from 'vitest';
import {
  X_RESPONSE_FORMAT_DEFAULT,
  formatError,
  response,
  responseFormatKey,
} from '../../src';
import { mockServer } from '../fixture/mock-server';

test('包含next', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: '1235' }),
  );

  const spy = vitest.fn();
  await compose([response({ statusCode: 200 })])(ctx, spy);
  expect(spy).toHaveBeenCalledOnce();
  res.flush();
});

describe('content-type', () => {
  test('指定格式', () => {
    const res = response({ statusCode: 200, contentType: 'json' });
    expect(res['getContentType']()).toBe('application/json');
  });

  test('包含*号', () => {
    const res = response({ statusCode: 200, contentType: 'application/*' });
    expect(res['getContentType']()).toBe('application/*');
  });

  test('字符串', () => {
    const res = response({ statusCode: 200, content: rule.string() });
    expect(res['getContentType']()).toBe('text/plain');
  });

  test('数字', () => {
    const res = response({ statusCode: 200, content: rule.number() });
    expect(res['getContentType']()).toBe('text/plain');
  });

  test('布尔值', () => {
    const res = response({ statusCode: 200, content: rule.boolean() });
    expect(res['getContentType']()).toBe('text/plain');
  });

  test('文件', () => {
    const res = response({ statusCode: 200, content: rule.file() });
    expect(res['getContentType']()).toBe('application/octet-stream');
  });

  test('对象', () => {
    const res = response({ statusCode: 200, content: rule.object() });
    expect(res['getContentType']()).toBe('application/json');
  });

  test('数组', () => {
    const res = response({ statusCode: 200, content: rule.array() });
    expect(res['getContentType']()).toBe('application/json');
  });
});

test('文档', async () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = response({
    statusCode: 200,
    content: {
      foo: rule.string(),
      bar: rule.number().optional(),
      baz: rule.boolean(),
    },
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
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
              "200": {
                "content": {
                  "application/json": {
                    "example": undefined,
                    "schema": {
                      "additionalProperties": false,
                      "properties": {
                        "bar": {
                          "type": "number",
                        },
                        "baz": {
                          "type": "boolean",
                        },
                        "foo": {
                          "type": "string",
                        },
                      },
                      "required": [
                        "foo",
                        "baz",
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

test('允许带报头', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = response({
    statusCode: 200,
    content: {
      foo: rule.string(),
    },
    headers: {
      'x-foo': rule.string(),
      'bar': rule.array(rule.string()),
    },
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
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
              "200": {
                "content": {
                  "application/json": {
                    "example": undefined,
                    "schema": {
                      "additionalProperties": false,
                      "properties": {
                        "foo": {
                          "type": "string",
                        },
                      },
                      "required": [
                        "foo",
                      ],
                      "type": "object",
                    },
                  },
                },
                "description": "",
                "headers": {
                  "bar": {
                    "required": true,
                    "schema": {
                      "items": {
                        "type": "string",
                      },
                      "type": "array",
                    },
                  },
                  "x-foo": {
                    "required": true,
                    "schema": {
                      "type": "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  `);
});

test('无 content 时从 x-response-format-default 借用', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const errMd = formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    handler(err) {
      return { code: err.code ?? 'HTTP_ERROR' };
    },
  });
  const res400 = response({
    statusCode: 400,
    description: '参数错误',
  });
  const res200 = response({
    statusCode: 200,
    content: { id: rule.number() },
  });

  errMd['openapi']().onMethod?.(methodItem, opts);
  expect(
    (methodItem as Record<string, unknown>)[X_RESPONSE_FORMAT_DEFAULT],
  ).toBeDefined();

  res400['openapi']().onMethod?.(methodItem, opts);
  res200['openapi']().onMethod?.(methodItem, opts);
  errMd['openapi']().postMethod?.(methodItem, opts);

  expect(
    (methodItem as Record<string, unknown>)[X_RESPONSE_FORMAT_DEFAULT],
  ).toBeUndefined();
  expect(methodItem.responses['400']).toMatchInlineSnapshot(`
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
      "description": "参数错误",
    }
  `);
  const res200Doc = methodItem.responses['200'] as OpenAPI.ResponseObject;
  expect(res200Doc.description).toBe('');
  expect(res200Doc.content).toMatchObject({
    'application/json': {
      schema: {
        properties: { id: { type: 'number' } },
      },
    },
  });
});

test('无约定键时不借 content', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const md = response({ statusCode: 404, description: '未找到' });
  md['openapi']().onMethod?.(methodItem, opts);

  expect(methodItem.responses['404']).toEqual({
    description: '未找到',
  });
});

test('整份借用后单点覆盖 description，保留 headers', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const errMd = formatError({
    content: { code: rule.string() },
    headers: { 'x-error-id': rule.string() },
    description: '通用错误',
    handler(err) {
      return { code: err.code ?? 'X' };
    },
  });
  const res400 = response({
    statusCode: 400,
    description: '参数错误',
  });
  const res401 = response({
    statusCode: 401,
  });

  errMd['openapi']().onMethod?.(methodItem, opts);
  res400['openapi']().onMethod?.(methodItem, opts);
  res401['openapi']().onMethod?.(methodItem, opts);
  errMd['openapi']().postMethod?.(methodItem, opts);

  expect(methodItem.responses['400']).toMatchObject({
    description: '参数错误',
    content: {
      'application/json': {
        schema: { properties: { code: { type: 'string' } } },
      },
    },
    headers: {
      'x-error-id': { required: true, schema: { type: 'string' } },
    },
  });
  // 未写 description：保留 formatError 原文案
  expect(methodItem.responses['401']).toMatchObject({
    description: '通用错误',
    headers: {
      'x-error-id': { required: true, schema: { type: 'string' } },
    },
  });
});

test('formatError 默认空 description 时借用后仍有 description 字段', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const errMd = formatError({
    content: { code: rule.string() },
    handler(err) {
      return { code: err.code ?? 'X' };
    },
  });
  const res400 = response({ statusCode: 400 });

  errMd['openapi']().onMethod?.(methodItem, opts);
  res400['openapi']().onMethod?.(methodItem, opts);
  errMd['openapi']().postMethod?.(methodItem, opts);

  expect(methodItem.responses['400']).toMatchObject({
    description: '',
    content: {
      'application/json': {
        schema: { properties: { code: { type: 'string' } } },
      },
    },
  });
});

test('无 content/description 时整份借用 formatError', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const errMd = formatError({
    content: { code: rule.string() },
    headers: { 'x-trace': rule.string() },
    description: '错误信封',
    handler(err) {
      return { code: err.code ?? 'X' };
    },
  });
  // 只声明状态码：整份借 content / description / headers
  const res400 = response({ statusCode: 400 });

  errMd['openapi']().onMethod?.(methodItem, opts);
  res400['openapi']().onMethod?.(methodItem, opts);
  errMd['openapi']().postMethod?.(methodItem, opts);

  expect(methodItem.responses['400']).toMatchObject({
    description: '错误信封',
    content: {
      'application/json': {
        schema: { properties: { code: { type: 'string' } } },
      },
    },
    headers: {
      'x-trace': { required: true, schema: { type: 'string' } },
    },
  });
});

test('借用后单点覆盖 headers', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const errMd = formatError({
    content: { code: rule.string() },
    headers: { 'x-error-id': rule.string() },
    description: '通用错误',
    handler(err) {
      return { code: err.code ?? 'X' };
    },
  });
  const res400 = response({
    statusCode: 400,
    headers: { 'retry-after': rule.string() },
  });

  errMd['openapi']().onMethod?.(methodItem, opts);
  res400['openapi']().onMethod?.(methodItem, opts);
  errMd['openapi']().postMethod?.(methodItem, opts);

  expect(methodItem.responses['400']).toMatchObject({
    description: '通用错误',
    content: {
      'application/json': {
        schema: { properties: { code: { type: 'string' } } },
      },
    },
    headers: {
      'retry-after': { required: true, schema: { type: 'string' } },
    },
  });
  expect(
    (methodItem.responses['400'] as OpenAPI.ResponseObject).headers,
  ).not.toHaveProperty('x-error-id');
});
test('formatError 指定 statusCodes：按 code 借用，未声明的状态不借', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const methodItem = doc.paths['/']!.get!;
  const opts = {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get' as const,
  };

  const errMd = formatError({
    content: { code: rule.string() },
    statusCodes: [400, 404],
    description: '错误信封',
    handler(err) {
      return { code: err.code ?? 'HTTP_ERROR' };
    },
  });
  const res400 = response({
    statusCode: 400,
    description: '参数错误',
  });
  const res403 = response({
    statusCode: 403,
    description: '无权限',
  });

  errMd['openapi']().onMethod?.(methodItem, opts);
  const ext = methodItem as Record<string, unknown>;
  expect(ext[responseFormatKey(400)]).toBeDefined();
  expect(ext[responseFormatKey(404)]).toBeDefined();
  expect(ext[X_RESPONSE_FORMAT_DEFAULT]).toBeUndefined();

  res400['openapi']().onMethod?.(methodItem, opts);
  res403['openapi']().onMethod?.(methodItem, opts);
  errMd['openapi']().postMethod?.(methodItem, opts);

  expect(ext[responseFormatKey(400)]).toBeUndefined();
  expect(methodItem.responses['400']).toMatchInlineSnapshot(`
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
      "description": "参数错误",
    }
  `);
  // 403 没有 x-response-format-403，不能借到 content
  expect(methodItem.responses['403']).toEqual({
    description: '无权限',
  });
  expect((methodItem.responses['404'] as OpenAPI.ResponseObject).description).toBe(
    '错误信封',
  );
  expect(methodItem.responses['default']).toBeUndefined();
});
