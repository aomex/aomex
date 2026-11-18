import { join } from 'path';
import { expect, test } from 'vitest';
import { sequenceFile } from '../fixtures/routers/sequence.router';
import { appendFileSync, readFileSync, rmSync } from 'fs';
import { middleware, rule } from '@aomex/common';
import { X_SKIP_ENVELOPE, formatError } from '@aomex/web';
import { initializeDocument, parseFiles } from '../../src';

test('解析文件', async () => {
  const file = join(import.meta.dirname, '..', 'fixtures', 'routers', 'a.router.ts');
  const document = await initializeDocument();
  const tags = await parseFiles(document, [file]);

  expect(tags).toMatchInlineSnapshot(`
    [
      "a",
    ]
  `);
  expect(document.paths).toMatchInlineSnapshot(`
    {
      "/bar/{id}": {
        "post": {
          "operationId": "create_bar_by_id",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer",
              },
            },
            {
              "in": "query",
              "name": "page",
              "schema": {
                "default": 1,
                "exclusiveMinimum": false,
                "minimum": 1,
                "type": "integer",
              },
            },
            {
              "description": "This is page size",
              "in": "query",
              "name": "size",
              "schema": {
                "default": 10,
                "description": "This is page size",
                "exclusiveMinimum": false,
                "minimum": 5,
                "type": "integer",
              },
            },
          ],
          "responses": {
            "default": {
              "description": "",
            },
          },
          "tags": [
            "a",
          ],
          "x-codegen-request-body-name": "body",
        },
      },
      "/foo": {
        "get": {
          "operationId": "list_foo",
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "schema": {
                "default": 1,
                "exclusiveMinimum": false,
                "minimum": 1,
                "type": "integer",
              },
            },
            {
              "description": "This is page size",
              "in": "query",
              "name": "size",
              "schema": {
                "default": 10,
                "description": "This is page size",
                "exclusiveMinimum": false,
                "minimum": 5,
                "type": "integer",
              },
            },
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "additionalProperties": false,
                  "properties": {
                    "test": {
                      "deprecated": true,
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              },
            },
            "required": false,
          },
          "responses": {
            "200": {
              "content": {
                "application/json": {
                  "example": undefined,
                  "schema": {
                    "additionalProperties": false,
                    "properties": {
                      "page": {
                        "type": "integer",
                      },
                      "result": {
                        "items": {
                          "additionalProperties": false,
                          "properties": {
                            "id": {
                              "type": "integer",
                            },
                            "name": {
                              "type": "string",
                            },
                          },
                          "required": [
                            "id",
                            "name",
                          ],
                          "type": "object",
                        },
                        "type": "array",
                      },
                      "total": {
                        "type": "integer",
                      },
                    },
                    "required": [
                      "page",
                      "result",
                      "total",
                    ],
                    "type": "object",
                  },
                },
              },
              "description": "",
            },
          },
          "tags": [
            "a",
          ],
        },
      },
    }
  `);
});

test('没有路由的文件', async () => {
  const file = join(import.meta.dirname, '..', 'fixtures', 'routers', 'empty.router.ts');

  const document = await initializeDocument();
  await parseFiles(document, [file]);
  expect(document.paths).toMatchInlineSnapshot(`{}`);
});

test('文档生成顺序', async () => {
  try {
    rmSync(sequenceFile);
  } catch {}

  const file = join(
    import.meta.dirname,
    '..',
    'fixtures',
    'routers',
    'sequence.router.ts',
  );

  const document = await initializeDocument();
  await parseFiles(document, [file]);
  expect(readFileSync(sequenceFile, 'utf8')).toMatchInlineSnapshot(
    `"111122223333444455556666"`,
  );
});

test('全局 mount 注入到每个接口', async () => {
  const file = join(import.meta.dirname, '..', 'fixtures', 'routers', 'a.router.ts');
  const document = await initializeDocument();
  await parseFiles(document, [file], {
    mount: [
      formatError({
        content: {
          code: rule.string(),
          message: rule.string(),
        },
        handler(err) {
          return { code: 'ERR', message: err.message };
        },
      }),
      middleware.web({
        fn: () => {},
        openapi: {
          onDocument(doc) {
            doc.components ||= {};
            doc.components.securitySchemes ||= {};
            doc.components.securitySchemes['globalAuth'] ||= {
              type: 'apiKey',
              in: 'header',
              name: 'x-token',
            };
          },
          onMethod(methodItem) {
            methodItem.security ||= [];
            methodItem.security.push({ globalAuth: [] });
          },
        },
      }),
      // mixin 无 openapi，应被过滤
      middleware.mixin(() => {}),
    ],
  });

  expect(document.components).toMatchInlineSnapshot(`
    {
      "securitySchemes": {
        "globalAuth": {
          "in": "header",
          "name": "x-token",
          "type": "apiKey",
        },
      },
    }
  `);
  expect(document.paths['/foo']!.get!.security).toEqual([{ globalAuth: [] }]);
  expect(document.paths['/bar/{id}']!.post!.security).toEqual([{ globalAuth: [] }]);
  expect(document.paths['/foo']!.get!.responses).toMatchObject({
    default: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  });
  // /foo 已有 200 响应，formatError 的 default 不应覆盖 200
  expect(document.paths['/foo']!.get!.responses['200']).toBeDefined();
  expect(document.paths['/bar/{id}']!.post!.responses).toMatchObject({
    default: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    },
  });
});

test('全局 mount 先于路由中间件执行', async () => {
  try {
    rmSync(sequenceFile);
  } catch {}

  const file = join(
    import.meta.dirname,
    '..',
    'fixtures',
    'routers',
    'sequence.router.ts',
  );

  const globalMd = middleware.web({
    fn: () => {},
    openapi: {
      onDocument() {
        appendFileSync(sequenceFile, 'G');
      },
      onPath() {
        appendFileSync(sequenceFile, 'g');
      },
      onMethod() {
        appendFileSync(sequenceFile, 'm');
      },
      postMethod() {
        appendFileSync(sequenceFile, 'M');
      },
      postPath() {
        appendFileSync(sequenceFile, 'p');
      },
      postDocument() {
        appendFileSync(sequenceFile, 'P');
      },
    },
  });

  const document = await initializeDocument();
  await parseFiles(document, [file], { mount: [globalMd] });

  // /bar: 全局+3 路由；/baz: 全局+1 路由
  // on*：全局在前（G111G1…）；post*：倒序，路由在前、全局最后（444M4M…）
  expect(readFileSync(sequenceFile, 'utf8')).toMatchInlineSnapshot(
    `"G111G1g222g2m333m3444M4M555p5p666P6P"`,
  );
});

test('无 envelope 时仍清理 x-skip-envelope 临时键', async () => {
  const file = join(
    import.meta.dirname,
    '..',
    'fixtures',
    'routers',
    'skip-envelope.router.ts',
  );
  const document = await initializeDocument();
  await parseFiles(document, [file]);

  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const method of Object.values(pathItem ?? {})) {
      if (method && typeof method === 'object' && 'responses' in method) {
        expect(method).not.toHaveProperty(X_SKIP_ENVELOPE);
      }
    }
  }
  expect(document.paths['/raw']!.get!.responses!['200']).toMatchObject({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: { id: { type: 'number' } },
        },
      },
    },
  });
});
