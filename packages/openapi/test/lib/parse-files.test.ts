import { join } from 'path';
import { expect, test } from 'vitest';
import { sequenceFile } from '../fixtures/routers/sequence.router';
import { readFileSync, rmSync } from 'fs';
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
