import { join } from 'path';
import { expect, test } from 'vitest';
import { middleware, rule } from '@aomex/common';
import { envelope, formatError } from '@aomex/web';
import { TestWebApp } from '../../../web/src/testing';
import { generateOpenapi } from '../../src';

test('指定基础文档', async () => {
  const result = await generateOpenapi({
    routers: [],
    docs: {
      openapi: '3.0.2',
      info: { version: '1.2.3', title: 'abc' },
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "abc",
        "version": "1.2.3",
      },
      "openapi": "3.0.2",
      "paths": {},
      "tags": [],
    }
  `);
});

test('手动修复文档', async () => {
  const result = await generateOpenapi({
    routers: [],
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
        "title": "@aomex/openapi",
        "version": "3.30.7",
      },
      "openapi": "3.0.3",
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
  });

  expect(result.info.description).toBe('from-global-mount');
  expect(result.paths['/foo']!.get!.deprecated).toBe(true);
  expect(result.paths['/bar/{id}']!.post!.deprecated).toBe(true);
  // showInOpenapi: false 的 /baz 仍不出现
  expect(result.paths['/baz']).toBeUndefined();
});

test('app 缺省与空 mount 等价于不挂载', async () => {
  const routers = join(
    import.meta.dirname,
    '..',
    'fixtures',
    'routers',
    'empty.router.ts',
  );
  const without = await generateOpenapi({ routers });
  const empty = await generateOpenapi({ routers, app: new TestWebApp({ mount: [] }) });
  expect(without).toEqual(empty);
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
