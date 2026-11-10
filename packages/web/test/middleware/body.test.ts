import { expect, test, vitest } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { body } from '../../src';
import { OpenAPI, compose, rule, schema } from '@aomex/common';

test('包含next', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: '1235' }),
  );

  const spy = vitest.fn();
  await compose([body({})])(ctx, spy);
  expect(spy).toHaveBeenCalledOnce();
  res.flush();
});

test('接收报文实体', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: '1235' }),
  );

  await compose([body({ test2: rule.number() })])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toStrictEqual({ test2: 1235 });
  res.flush();
});

test('数据不合法时抛出错误', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: 'foo' }),
  );

  const spy = vitest.spyOn(ctx, 'throw');
  const fn = compose([body({ test2: rule.number() })]);
  await expect(fn(ctx)).rejects.toThrow();
  expect(spy).toHaveBeenCalledOnce();

  res.flush();
});

test('接收 schema', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ name: 'tom', age: '18' }),
  );

  const userSchema = schema({
    name: rule.string(),
    age: rule.int().optional(),
  });
  await compose([body(userSchema)])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toStrictEqual({ name: 'tom', age: 18 });
  res.flush();
});

test('接收派生 schema', async () => {
  const { ctx, res } = await mockServer((agent) => agent.post('/').send({ name: 'tom' }));

  const createSchema = schema({
    id: rule.int(),
    name: rule.string(),
    email: rule.email(),
  })
    .omit('id')
    .partial('email');
  await compose([body(createSchema)])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toStrictEqual({ name: 'tom', email: undefined });
  res.flush();
});

test('文档', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({
    foo: rule.string(),
    bar: rule.number().optional(),
    baz: rule.boolean(),
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc['paths']).toMatchInlineSnapshot(`
    {
      "/": {
        "get": {
          "requestBody": {
            "content": {
              "application/json": {
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
            "required": true,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('文档：schema', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(
    schema({
      foo: rule.string(),
      bar: rule.number().optional(),
    }),
  );
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc['paths']).toMatchInlineSnapshot(`
    {
      "/": {
        "get": {
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "additionalProperties": false,
                  "properties": {
                    "bar": {
                      "type": "number",
                    },
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
            "required": true,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('携带文件', async () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({
    foo: rule.array(rule.file()),
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc['paths']).toMatchInlineSnapshot(`
    {
      "/": {
        "get": {
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "additionalProperties": false,
                  "properties": {
                    "foo": {
                      "items": {
                        "format": "binary",
                        "type": "string",
                      },
                      "type": "array",
                    },
                  },
                  "required": [
                    "foo",
                  ],
                  "type": "object",
                },
              },
            },
            "required": true,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('顶层文件字段识别为 multipart', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({
    avatar: rule.file(),
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc['paths']).toMatchInlineSnapshot(`
    {
      "/": {
        "get": {
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "additionalProperties": false,
                  "properties": {
                    "avatar": {
                      "format": "binary",
                      "type": "string",
                    },
                  },
                  "required": [
                    "avatar",
                  ],
                  "type": "object",
                },
              },
            },
            "required": true,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('嵌套对象中的文件字段识别为 multipart', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({
    meta: rule.object({
      attachment: rule.file(),
    }),
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc['paths']).toMatchInlineSnapshot(`
    {
      "/": {
        "get": {
          "requestBody": {
            "content": {
              "multipart/form-data": {
                "schema": {
                  "additionalProperties": false,
                  "properties": {
                    "meta": {
                      "additionalProperties": false,
                      "properties": {
                        "attachment": {
                          "format": "binary",
                          "type": "string",
                        },
                      },
                      "required": [
                        "attachment",
                      ],
                      "type": "object",
                    },
                  },
                  "required": [
                    "meta",
                  ],
                  "type": "object",
                },
              },
            },
            "required": true,
          },
          "responses": {},
        },
      },
    }
  `);
});
