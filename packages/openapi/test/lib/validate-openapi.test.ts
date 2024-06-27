import { expect, test } from 'vitest';
import { validateOpenapi } from '../../src';

test('验证', async () => {
  const result = await validateOpenapi({
    info: {
      title: 'x',
      version: '1',
    },
    openapi: '3.0.3',
    paths: {
      // @ts-expect-error
      '/foo': {
        get: {},
      },
    },
    tags: [],
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "errors": [
        {
          "message": ""get" property must have required property "responses".",
          "path": [
            "paths",
            "/foo",
            "get",
          ],
        },
      ],
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
