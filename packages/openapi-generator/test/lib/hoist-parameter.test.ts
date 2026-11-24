import type { OpenAPI } from '@aomex/common';
import { expect, test } from 'vitest';
import { methodParameterToPathParameter } from '../../src';

test('每个item都有相同的参数', () => {
  const document: OpenAPI.Document = {
    info: {
      title: 'x',
      version: '1',
    },
    openapi: '3.0.3',
    paths: {
      '/foo': {
        get: {
          responses: {},
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
            },
            {
              in: 'query',
              name: 'page',
              schema: {
                default: 1,
                exclusiveMinimum: false,
                minimum: 1,
                type: 'integer',
              },
            },
          ],
        },
        post: {
          responses: {},
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ],
        },
        put: {
          responses: {},
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
    },
    tags: [],
  };

  methodParameterToPathParameter(document);
  expect(document).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "x",
        "version": "1",
      },
      "openapi": "3.0.3",
      "paths": {
        "/foo": {
          "get": {
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
            ],
            "responses": {},
          },
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "integer",
              },
            },
          ],
          "post": {
            "responses": {},
          },
          "put": {
            "responses": {},
          },
        },
      },
      "tags": [],
    }
  `);
});

test('不是每个item都有相同的参数', () => {
  const document: OpenAPI.Document = {
    info: {
      title: 'x',
      version: '1',
    },
    openapi: '3.0.3',
    paths: {
      '/foo': {
        get: {
          responses: {},
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: {
                default: 1,
                exclusiveMinimum: false,
                minimum: 1,
                type: 'integer',
              },
            },
          ],
        },
        post: {
          responses: {},
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ],
        },
        put: {
          responses: {},
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
    },
    tags: [],
  };

  methodParameterToPathParameter(document);
  expect(document).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "x",
        "version": "1",
      },
      "openapi": "3.0.3",
      "paths": {
        "/foo": {
          "get": {
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
            ],
            "responses": {},
          },
          "post": {
            "parameters": [
              {
                "in": "path",
                "name": "id",
                "required": true,
                "schema": {
                  "type": "integer",
                },
              },
            ],
            "responses": {},
          },
          "put": {
            "parameters": [
              {
                "in": "path",
                "name": "id",
                "required": true,
                "schema": {
                  "type": "integer",
                },
              },
            ],
            "responses": {},
          },
        },
      },
      "tags": [],
    }
  `);
});

test('单个item不提升', () => {
  const document: OpenAPI.Document = {
    info: {
      title: 'x',
      version: '1',
    },
    openapi: '3.0.3',
    paths: {
      '/foo': {
        get: {
          responses: {},
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: {
                default: 1,
                exclusiveMinimum: false,
                minimum: 1,
                type: 'integer',
              },
            },
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
    },
    tags: [],
  };

  methodParameterToPathParameter(document);
  expect(document).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "x",
        "version": "1",
      },
      "openapi": "3.0.3",
      "paths": {
        "/foo": {
          "get": {
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
                "in": "path",
                "name": "id",
                "required": true,
                "schema": {
                  "type": "integer",
                },
              },
            ],
            "responses": {},
          },
        },
      },
      "tags": [],
    }
  `);
});
