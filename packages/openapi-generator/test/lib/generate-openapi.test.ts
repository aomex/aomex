import { join } from 'path';
import { expect, test } from 'vitest';
import { middleware, OpenAPI, rule } from '@aomex/common';
import { envelope, formatError } from '@aomex/web';
import { TestWebApp } from '../../../web/src/testing';
import { generateOpenapi } from '../../src';

test('指定基础文档', async () => {
  const result = await generateOpenapi({
    routers: [],
    app: new TestWebApp(),
    docs: {
      openapi: '3.1.2',
      info: { version: '1.2.3', title: 'abc' },
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "abc",
        "version": "1.2.3",
      },
      "openapi": "3.1.2",
      "paths": {},
      "tags": [],
    }
  `);
});

test('降级到 OpenAPI 3.1 时转换 JSON Schema 关键字', async () => {
  const document31 = await generateOpenapi({
    routers: [],
    app: new TestWebApp(),
    docs: { openapi: '3.1.2' },
    fix(document) {
      document.components = {
        schemas: {
          nullableText: { type: ['string', 'null'] },
          exclusiveNumber: {
            type: 'number',
            exclusiveMinimum: 5,
            exclusiveMaximum: 10,
          },
        },
      };
    },
  });
  expect(document31.openapi).toBe('3.1.2');
  expect(document31.components?.schemas?.['nullableText']).toEqual({
    type: ['string', 'null'],
  });
  expect(document31.components?.schemas?.['exclusiveNumber']).toEqual({
    type: 'number',
    exclusiveMinimum: 5,
    exclusiveMaximum: 10,
  });
});

test('手动修复文档', async () => {
  const result = await generateOpenapi({
    routers: [],
    app: new TestWebApp(),
    docs: {
      openapi: '3.2.1',
      info: { title: 'aomex', version: '1.2.3' },
    },
    fix(data) {
      data.info.description = ' desc foo bar';
      data.tags ||= [];
      data.tags.push({ name: 'foo' });
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "info": {
        "description": " desc foo bar",
        "title": "aomex",
        "version": "1.2.3",
      },
      "openapi": "3.2.1",
      "paths": {},
      "tags": [
        {
          "name": "foo",
        },
      ],
    }
  `);
});

test('通过 app.mount 收集全局中间件文档', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web({
        fn: () => {},
        openapi: {
          onDocument(doc) {
            doc.info.description = 'from-global-mount';
          },
          onMethod(methodItem) {
            methodItem.deprecated = true;
          },
        },
      }),
    ],
  });

  const result = await generateOpenapi({
    routers: join(import.meta.dirname, '..', 'fixtures', 'routers', 'a.router.ts'),
    app,
    docs: { openapi: '3.2.1' },
  });

  expect(result.info.description).toBe('from-global-mount');
  expect(result.paths['/foo']!.get!.deprecated).toBe(true);
  expect(result.paths['/bar/{id}']!.post!.deprecated).toBe(true);
  // showInOpenapi: false 的 /baz 仍不出现
  expect(result.paths['/baz']).toBeUndefined();
});

test('空 mount 的 app 可正常生成', async () => {
  const routers = join(
    import.meta.dirname,
    '..',
    'fixtures',
    'routers',
    'empty.router.ts',
  );
  const empty = await generateOpenapi({
    routers,
    app: new TestWebApp({ mount: [] }),
    docs: { openapi: '3.2.1' },
  });
  expect(empty.paths).toEqual({});
});

test('app.envelope 在文档侧收成 200 套壳', async () => {
  const app = new TestWebApp({
    envelope: {
      description: '统一响应体套壳',
      content: {
        success: envelope.success,
        statusCode: envelope.statusCode,
        data: envelope.payload,
      },
    },
    mount: [
      formatError({
        content: { code: rule.string(), message: rule.string() },
        handler(err) {
          return { code: err.code ?? 'ERR', message: err.message };
        },
      }),
    ],
  });

  const result = await generateOpenapi({
    routers: join(import.meta.dirname, '..', 'fixtures', 'routers', 'a.router.ts'),
    app,
    docs: { openapi: '3.2.1' },
  });

  const method = result.paths['/foo']!.get!;
  expect(Object.keys(method.responses!).sort()).toEqual(['200']);
  expect(method.responses!['200']).toMatchObject({
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
                  properties: {
                    page: { type: 'integer' },
                    result: { type: 'array' },
                    total: { type: 'integer' },
                  },
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

test('response({ skipEnvelope }) 时该状态码不套壳且无临时扩展键', async () => {
  const app = new TestWebApp({
    envelope: {
      content: {
        success: envelope.success,
        statusCode: envelope.statusCode,
        data: envelope.payload,
      },
    },
    mount: [],
  });

  const result = await generateOpenapi({
    routers: join(
      import.meta.dirname,
      '..',
      'fixtures',
      'routers',
      'skip-envelope.router.ts',
    ),
    app,
    docs: { openapi: '3.2.1' },
  });

  const raw = result.paths['/raw']!.get!;
  expect(raw).not.toHaveProperty('x-skip-envelope');
  // 仅声明了 skip 的 200、无其它需套壳状态时，保留裸 schema
  expect(raw.responses!['200']).toMatchObject({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: { id: { type: 'number' } },
        },
      },
    },
  });
  expect(
    (
      (raw.responses!['200'] as OpenAPI.ResponseObject).content?.[
        'application/json'
      ] as OpenAPI.MediaTypeObject
    )?.schema,
  ).not.toHaveProperty('oneOf');

  const mixed = result.paths['/mixed']!.get!;
  expect(mixed).not.toHaveProperty('x-skip-envelope');
  expect(mixed.responses!['200']).toMatchObject({
    content: {
      'application/json': {
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
      },
    },
  });

  const keepError = result.paths['/keep-error']!.get!;
  expect(keepError.responses!['400']).toMatchObject({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  });
  expect(keepError.responses!['200']).toMatchObject({
    content: {
      'application/json': {
        schema: {
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
      },
    },
  });
});
