import { type OpenAPI } from '@aomex/common';
import { test, expect, vitest } from 'vitest';
import { hoistSchemaRef } from '../../src';

const emptyDoc = (): OpenAPI.Document => ({
  openapi: '3.0.3',
  info: { title: '', version: '' },
  paths: {},
});

test('提取 x-ref 到 components 并替换为 $ref', () => {
  const document = emptyDoc();
  document.paths['/'] = {
    get: {
      responses: {},
      requestBody: {
        content: {
          'application/json': {
            schema: {
              'type': 'object',
              'properties': { foo: { type: 'string' } },
              'required': ['foo'],
              'additionalProperties': false,
              'x-ref': 'CreateUser',
            } as OpenAPI.SchemaObject,
          },
        },
      },
    },
  };

  hoistSchemaRef(document);

  expect(document.paths['/']!.get!.requestBody).toMatchObject({
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/CreateUser' },
      },
    },
  });
  expect(document.components?.schemas?.['CreateUser']).toEqual({
    type: 'object',
    properties: { foo: { type: 'string' } },
    required: ['foo'],
    additionalProperties: false,
  });
});

test('嵌套 x-ref 自底向上提取', () => {
  const document = emptyDoc();
  document.paths['/'] = {
    post: {
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: {
                'type': 'object',
                'x-ref': 'User',
                'properties': {
                  profile: {
                    'type': 'object',
                    'x-ref': 'Profile',
                    'properties': { bio: { type: 'string' } },
                    'required': ['bio'],
                    'additionalProperties': false,
                  },
                },
                'required': ['profile'],
                'additionalProperties': false,
              } as OpenAPI.SchemaObject,
            },
          },
        },
      },
    },
  };

  hoistSchemaRef(document);

  expect(document.components?.schemas?.['Profile']).toMatchObject({
    type: 'object',
    properties: { bio: { type: 'string' } },
  });
  expect(document.components?.schemas?.['User']).toMatchObject({
    type: 'object',
    properties: {
      profile: { $ref: '#/components/schemas/Profile' },
    },
  });
});

test('同名不同结构时 warn 并加数字后缀', () => {
  const document = emptyDoc();
  document.paths['/a'] = {
    get: {
      responses: {},
      requestBody: {
        content: {
          'application/json': {
            schema: {
              'type': 'object',
              'properties': { a: { type: 'string' } },
              'x-ref': 'Dup',
            } as OpenAPI.SchemaObject,
          },
        },
      },
    },
  };
  document.paths['/b'] = {
    get: {
      responses: {},
      requestBody: {
        content: {
          'application/json': {
            schema: {
              'type': 'object',
              'properties': { a: { type: 'number' } },
              'x-ref': 'Dup',
            } as OpenAPI.SchemaObject,
          },
        },
      },
    },
  };

  const warn = vitest.spyOn(console, 'warn').mockImplementation(() => {});
  hoistSchemaRef(document);
  expect(warn).toHaveBeenCalledOnce();
  expect(document.components?.schemas?.['Dup']).toMatchObject({
    properties: { a: { type: 'string' } },
  });
  expect(document.components?.schemas?.['Dup-duplicated-2']).toMatchObject({
    properties: { a: { type: 'number' } },
  });
  expect(document.paths['/b']!.get!.requestBody).toMatchObject({
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Dup-duplicated-2' },
      },
    },
  });
  warn.mockRestore();
});

test('相同 x-ref 复用组件', () => {
  const schema = {
    'type': 'object' as const,
    'properties': { foo: { type: 'string' as const } },
    'x-ref': 'Shared',
  } as OpenAPI.SchemaObject;
  const document = emptyDoc();
  document.paths['/a'] = {
    get: {
      responses: {},
      requestBody: {
        content: { 'application/json': { schema: { ...schema } } },
      },
    },
  };
  document.paths['/b'] = {
    get: {
      responses: {},
      requestBody: {
        content: { 'application/json': { schema: { ...schema } } },
      },
    },
  };

  hoistSchemaRef(document);
  expect(Object.keys(document.components!.schemas!)).toEqual(['Shared']);
});
