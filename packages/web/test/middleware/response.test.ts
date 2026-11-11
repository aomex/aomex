import { OpenAPI, compose, rule } from '@aomex/common';
import { describe, expect, test, vitest } from 'vitest';
import { response } from '../../src';
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
