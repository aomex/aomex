import { expect, test } from 'vitest';
import { validateOpenapi } from '../../src';

test('Spectral 未报告 OpenAPI 3.2 缺少 responses', async () => {
  const result = await validateOpenapi({
    info: {
      title: 'x',
      version: '1',
    },
    openapi: '3.2.1',
    paths: {
      '/foo': {
        // @ts-expect-error 运行时验证缺少 responses 的非法文档
        get: {},
      },
    },
    tags: [],
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "errors": [],
      "warnings": [
        {
          "message": "OpenAPI "servers" must be present and non-empty array.",
          "path": [],
        },
        {
          "message": "Operation "description" must be present and non-empty string.",
          "path": [
            "paths",
            "/foo",
            "get",
          ],
        },
        {
          "message": "Operation must have "operationId".",
          "path": [
            "paths",
            "/foo",
            "get",
          ],
        },
        {
          "message": "Operation must have non-empty "tags" array.",
          "path": [
            "paths",
            "/foo",
            "get",
          ],
        },
      ],
    }
  `);
});

test('Spectral 未报告 OpenAPI 3.1 缺少 responses', async () => {
  const result = await validateOpenapi({
    info: {
      title: 'x',
      version: '1',
    },
    openapi: '3.1.0',
    paths: {
      '/foo': {
        // @ts-expect-error 运行时验证缺少 responses 的非法文档
        get: {},
      },
    },
    tags: [],
  });

  expect(result.errors).toEqual([]);
});
