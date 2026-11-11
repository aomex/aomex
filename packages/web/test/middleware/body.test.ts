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

test('接收裸 object 校验器', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ id: '7', name: 'tom' }),
  );

  await compose([body(rule.object({ id: rule.int(), name: rule.string() }))])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toStrictEqual({ id: 7, name: 'tom' });
  res.flush();
});

test('接收裸 array 校验器', async () => {
  const { ctx, res } = await mockServer((agent) => agent.post('/').send([1, '2', 3]));

  await compose([body(rule.array(rule.int()))])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toStrictEqual([1, 2, 3]);
  res.flush();
});

test('接收裸 string 校验器', async () => {
  // 真实 JSON 字符串体是带引号的 "hello"，不是裸文本 hello
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').type('json').send('"hello"'),
  );

  await compose([body(rule.string())])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toBe('hello');
  res.flush();
});

test('接收裸 number 校验器', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').type('json').send('0'),
  );

  await compose([body(rule.number())])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toBe(0);
  res.flush();
});

test('接收裸 boolean 校验器', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').type('json').send('false'),
  );

  await compose([body(rule.boolean())])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toBe(false);
  res.flush();
});

test('裸标量类型不匹配时抛出错误', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').type('json').send('1'),
  );

  const spy = vitest.spyOn(ctx, 'throw');
  await expect(compose([body(rule.string())])(ctx)).rejects.toThrow();
  expect(spy).toHaveBeenCalledOnce();
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
  expect(doc.paths['/']!.get!.requestBody).toMatchObject({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            foo: { type: 'string' },
            bar: { type: 'number' },
          },
          required: ['foo'],
        },
      },
    },
    required: true,
  });
  expect(
    (doc.paths['/']!.get!.requestBody as OpenAPI.RequestBodyObject).content![
      'application/json'
    ]!.schema,
  ).not.toHaveProperty('x-ref');
});

test('文档：schema.asName 打上具名 x-ref', () => {
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
    }).asName('CreateUser'),
  );
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc.paths['/']!.get!.requestBody).toMatchObject({
    content: {
      'application/json': {
        schema: {
          'type': 'object',
          'x-ref': 'CreateUser',
          'properties': {
            foo: { type: 'string' },
            bar: { type: 'number' },
          },
          'required': ['foo'],
        },
      },
    },
    required: true,
  });
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

test('文档：空字段表 requestBody.required=false', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({});
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
                  "additionalProperties": true,
                  "type": "object",
                },
              },
            },
            "required": false,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('文档：全 optional 字段表 requestBody.required=false', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({
    foo: rule.string().optional(),
    bar: rule.number().optional(),
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
                    "foo": {
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              },
            },
            "required": false,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('文档：裸 array', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(rule.array(rule.string()));
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
                  "items": {
                    "type": "string",
                  },
                  "type": "array",
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

test('文档：裸 string', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(rule.string());
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
                  "type": "string",
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

test('文档：裸 number', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(rule.number());
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
                  "type": "number",
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

test('文档：裸 boolean', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(rule.boolean());
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
                  "type": "boolean",
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

test('文档：裸 optional string requestBody.required=false', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(rule.string().optional());
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
                  "type": "string",
                },
              },
            },
            "required": false,
          },
          "responses": {},
        },
      },
    }
  `);
});

test('文档：裸 object 含文件字段识别为 multipart', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body(
    rule.object({
      avatar: rule.file(),
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
