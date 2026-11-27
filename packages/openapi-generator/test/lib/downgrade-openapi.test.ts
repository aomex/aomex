import { expect, test } from 'vitest';
import { downgradeSpecV32ToV31 } from '@openapi-spec/downgrader';

test('OpenAPI 3.2 到 3.1 降级结果', () => {
  const document = {
    openapi: '3.2.1',
    $self: 'https://api.example.test/openapi.json',
    info: { title: 'Pets API', version: '1.0.0' },
    servers: [{ name: 'production', url: 'https://api.example.test' }],
    tags: [{ name: 'pets', summary: 'Pet operations', kind: 'nav' }],
    paths: {
      '/pets': {
        query: {
          operationId: 'searchPets',
          responses: { '200': { description: 'OK' } },
        },
        get: {
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/jsonl': {
                  $ref: '#/components/mediaTypes/jsonl',
                },
              },
            },
          },
        },
      },
    },
    components: {
      mediaTypes: {
        jsonl: { itemSchema: { type: 'string' } },
      },
      schemas: {
        nullableText: { type: ['string', 'null'] },
      },
    },
  } satisfies Parameters<typeof downgradeSpecV32ToV31>[0];

  expect(downgradeSpecV32ToV31(document)).toMatchInlineSnapshot(`
    {
      "components": {
        "schemas": {
          "nullableText": {
            "type": [
              "string",
              "null",
            ],
          },
        },
      },
      "info": {
        "title": "Pets API",
        "version": "1.0.0",
      },
      "openapi": "3.1.2",
      "paths": {
        "/pets": {
          "get": {
            "responses": {
              "200": {
                "content": {
                  "application/jsonl": {
                    "schema": {
                      "items": {
                        "type": "string",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "OK",
              },
            },
          },
        },
      },
      "servers": [
        {
          "url": "https://api.example.test",
        },
      ],
      "tags": [
        {
          "description": "Pet operations",
          "name": "pets",
        },
      ],
    }
  `);
});
