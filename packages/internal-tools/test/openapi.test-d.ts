import type { OpenAPI } from '../src';
import { expectType } from 'ts-expect';

{
  const document: OpenAPI.Document = {
    openapi: '3.2.0',
    info: { title: 'API', version: '1.0.0' },
    paths: {},
  };
  expectType<OpenAPI.Document>(document);
}

{
  const pathItem: OpenAPI.PathItemObject = {
    query: { responses: { '200': { description: 'OK' } } },
  };
  expectType<OpenAPI.PathItemObject>(pathItem);

  // @ts-expect-error OpenAPI operation must define responses
  const invalidPathItem: OpenAPI.PathItemObject = { query: {} };
  expectType<OpenAPI.PathItemObject>(invalidPathItem);
}

{
  const schema: OpenAPI.SchemaObject = {
    type: ['string', 'null'],
  };
  expectType<OpenAPI.SchemaObject>(schema);
}

{
  const schema: OpenAPI.SchemaObject = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    additionalProperties: false,
  };
  expectType<OpenAPI.SchemaObject>(schema);
}

{
  const schema: OpenAPI.SchemaObject = {
    // @ts-expect-error OpenAPI 3.2 不再使用 nullable
    nullable: true,
  };
  expectType<OpenAPI.SchemaObject>(schema);
}

{
  // @ts-expect-error Aomex 文档 API 仅接受对象 Schema
  const schema: OpenAPI.SchemaObject = true;
  expectType<OpenAPI.SchemaObject>(schema);
}
