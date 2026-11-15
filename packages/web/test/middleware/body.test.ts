import { expect, test, vitest } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { body, getFileUploadOptions } from '../../src';
import { DEFAULT_MAX_FILES } from '../../src/middleware/parse-body';
import { OpenAPI, compose, rule, schema } from '@aomex/common';

test('getFileUploadOptions：按 schema 收集文件字段与 maxSize', () => {
  expect(getFileUploadOptions({ name: rule.string() })).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });

  expect(getFileUploadOptions({ avatar: rule.file() })).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
  });

  // array(file) 未写 length.max 时用 DEFAULT_MAX_FILES
  expect(getFileUploadOptions({ photos: rule.array(rule.file()) })).toEqual({
    allowFileFields: ['photos'],
    maxFiles: DEFAULT_MAX_FILES,
  });

  // 仅部分字段写了 maxSize 时只取有配置的最大值
  expect(
    getFileUploadOptions({
      avatar: rule.file(),
      cover: rule.file().maxSize('2MB'),
    }),
  ).toEqual({
    allowFileFields: ['avatar', 'cover'],
    maxFiles: 2,
    maxFileSize: 2 * 1024 * 1024,
  });

  const opts = getFileUploadOptions({
    avatar: rule.file().maxSize('2MB'),
    photos: rule.array(rule.file().maxSize('5MB')).length({ max: 3 }),
  });
  expect(opts.allowFileFields).toEqual(['avatar', 'photos']);
  expect(opts.maxFileSize).toBe(5 * 1024 * 1024);
  expect(opts.maxFiles).toBe(4); // 1 + 3

  // 顶层 oneOf / anyOf / allOf 含 file
  expect(
    getFileUploadOptions({
      avatar: rule.oneOf([rule.file().maxSize('1MB'), rule.string()]),
    }),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
    maxFileSize: 1 * 1024 * 1024,
  });

  expect(
    getFileUploadOptions({
      avatar: rule.anyOf([rule.file().maxSize('2MB'), rule.file().maxSize('5MB')]),
    }),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024,
  });

  expect(
    getFileUploadOptions({
      avatar: rule.allOf([rule.file().maxSize('3MB'), rule.file()]),
    }),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
    maxFileSize: 3 * 1024 * 1024,
  });

  // array 包 oneOf(file)
  expect(
    getFileUploadOptions({
      photos: rule.array(rule.oneOf([rule.file(), rule.string()])).length({ max: 4 }),
    }),
  ).toEqual({
    allowFileFields: ['photos'],
    maxFiles: 4,
  });

  // oneOf 分支里含 array(file) 时取更宽的个数上限
  expect(
    getFileUploadOptions({
      media: rule.oneOf([rule.file(), rule.array(rule.file()).length({ max: 3 })]),
    }),
  ).toEqual({
    allowFileFields: ['media'],
    maxFiles: 3,
  });

  // 嵌套 object 内的 file 忽略；oneOf 仅含此类分支时不收录
  expect(
    getFileUploadOptions({
      profile: rule.object({ avatar: rule.file().maxSize('1MB') }),
      nested: rule.oneOf([rule.object({ f: rule.file() }), rule.string()]),
    }),
  ).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });

  // 根是 anyOf / oneOf：展开各 object 分支的顶层字段，个数取较大值
  expect(
    getFileUploadOptions(
      rule.anyOf([
        rule.object({ avatar: rule.file().maxSize('1MB') }),
        rule.object({ name: rule.string() }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
    maxFileSize: 1 * 1024 * 1024,
  });

  expect(
    getFileUploadOptions(
      rule.oneOf([
        rule.object({ avatar: rule.file() }),
        rule.object({
          photos: rule.array(rule.file()).length({ max: 3 }),
        }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['avatar', 'photos'],
    maxFiles: 3,
  });

  // 根是 allOf：各分支同时成立，个数相加
  expect(
    getFileUploadOptions(
      rule.allOf([
        rule.object({ avatar: rule.file() }),
        rule.object({ cover: rule.file().maxSize('2MB') }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['avatar', 'cover'],
    maxFiles: 2,
    maxFileSize: 2 * 1024 * 1024,
  });

  // 根是 array(file) 没有字段名；array(object) 只收录对象顶层文件字段
  expect(getFileUploadOptions(rule.array(rule.file()))).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });
  expect(
    getFileUploadOptions(
      rule.array(rule.object({ avatar: rule.file().maxSize('1MB') })).length({ max: 5 }),
    ),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
    maxFileSize: 1 * 1024 * 1024,
  });

  // 组合里再套组合；分支 object 内的嵌套 object 仍忽略
  expect(
    getFileUploadOptions(
      rule.anyOf([
        rule.oneOf([rule.object({ a: rule.file().maxSize('2MB') }), rule.string()]),
        rule.object({ profile: rule.object({ avatar: rule.file() }) }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['a'],
    maxFiles: 1,
    maxFileSize: 2 * 1024 * 1024,
  });
});

test('getFileUploadOptions：组合与不收集场景', () => {
  const mb = (n: number) => n * 1024 * 1024;

  // 根是 file / string：没有字段名
  expect(getFileUploadOptions(rule.file())).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });
  expect(getFileUploadOptions(rule.string())).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });

  // 根组合里没有带文件字段的 object
  expect(
    getFileUploadOptions(
      rule.anyOf([rule.object({ name: rule.string() }), rule.string()]),
    ),
  ).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });

  // 同对象里，非文件组合字段不收录
  expect(
    getFileUploadOptions({
      avatar: rule.file(),
      extra: rule.oneOf([rule.string(), rule.number()]),
    }),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
  });

  // 字段上 anyOf / allOf：个数取较大值，不把 file 和 array(file) 相加
  expect(
    getFileUploadOptions({
      media: rule.anyOf([rule.file(), rule.array(rule.file()).length({ max: 2 })]),
    }),
  ).toEqual({
    allowFileFields: ['media'],
    maxFiles: 2,
  });
  expect(
    getFileUploadOptions({
      media: rule.allOf([
        rule.file().maxSize('1MB'),
        rule.array(rule.file()).length({ max: 4 }),
      ]),
    }),
  ).toEqual({
    allowFileFields: ['media'],
    maxFiles: 4,
    maxFileSize: mb(1),
  });

  // array(oneOf(file)) 未写 length.max 时用默认个数，maxSize 仍从 file 带出
  expect(
    getFileUploadOptions({
      photos: rule.array(rule.oneOf([rule.file().maxSize('1MB'), rule.string()])),
    }),
  ).toEqual({
    allowFileFields: ['photos'],
    maxFiles: DEFAULT_MAX_FILES,
    maxFileSize: mb(1),
  });

  // 字段上的 array(object) / oneOf(object) 不收录内部 file
  expect(
    getFileUploadOptions({
      avatar: rule.file(),
      items: rule.array(rule.object({ file: rule.file().maxSize('9MB') })),
    }),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
  });

  // 根 oneOf 同名字段只留一次，个数取较大值
  expect(
    getFileUploadOptions(
      rule.oneOf([
        rule.object({ avatar: rule.file() }),
        rule.object({
          avatar: rule.array(rule.file()).length({ max: 3 }),
        }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 3,
  });

  // 根 allOf 同名字段只留一次，个数仍按分支相加
  expect(
    getFileUploadOptions(
      rule.allOf([
        rule.object({ avatar: rule.file().maxSize('1MB') }),
        rule.object({
          avatar: rule.file().maxSize('4MB'),
          cover: rule.file(),
        }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['avatar', 'cover'],
    maxFiles: 3,
    maxFileSize: mb(4),
  });

  // 根 array(oneOf(object))：字段取并集，个数取较大值，外层 length 不参与
  expect(
    getFileUploadOptions(
      rule
        .array(
          rule.oneOf([
            rule.object({ avatar: rule.file() }),
            rule.object({
              photos: rule.array(rule.file()).length({ max: 2 }),
            }),
          ]),
        )
        .length({ max: 9 }),
    ),
  ).toEqual({
    allowFileFields: ['avatar', 'photos'],
    maxFiles: 2,
  });

  // 根 anyOf 里套 allOf：allOf 分支内部相加，再和其它分支取较大值
  expect(
    getFileUploadOptions(
      rule.anyOf([
        rule.allOf([rule.object({ a: rule.file() }), rule.object({ b: rule.file() })]),
        rule.object({
          c: rule.array(rule.file()).length({ max: 5 }),
        }),
      ]),
    ),
  ).toEqual({
    allowFileFields: ['a', 'b', 'c'],
    maxFiles: 5,
  });

  // additional 的动态字段名不进白名单
  expect(
    getFileUploadOptions(
      rule.object({ avatar: rule.file() }).additional({
        value: rule.file().maxSize('9MB'),
      }),
    ),
  ).toEqual({
    allowFileFields: ['avatar'],
    maxFiles: 1,
  });
  expect(getFileUploadOptions(rule.object().additional({ value: rule.file() }))).toEqual({
    allowFileFields: [],
    maxFiles: 0,
  });
});

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
