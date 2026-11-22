import type { AsyncAPI } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

{
  const doc: AsyncAPI.Document = {
    asyncapi: '3.1.0',
    info: { title: 'demo', version: '1.0.0' },
  };
  expectType<AsyncAPI.Document>(doc);
}

{
  const doc: AsyncAPI.Document = {
    asyncapi: '3.0.0',
    id: 'urn:example:chat',
    info: {
      title: 'chat',
      version: '1.0.0',
      contact: { name: 'aomex', email: 'dev@example.com' },
      license: { name: 'MIT' },
      tags: [{ name: 'realtime' }],
    },
    defaultContentType: 'application/json',
    servers: {
      production: {
        host: 'broker.example.com',
        protocol: 'ws',
        pathname: '/ws',
        security: [{ type: 'http', scheme: 'bearer' }],
      },
    },
    channels: {
      'chat.send': {
        address: 'chat.send',
        messages: {
          'chat.send': { $ref: '#/components/messages/chat.send' },
        },
      },
    },
    operations: {
      'receive:chat.send': {
        action: 'receive',
        channel: { $ref: '#/channels/chat.send' },
        messages: [{ $ref: '#/channels/chat.send/messages/chat.send' }],
        reply: {
          channel: { $ref: '#/channels/chat.message' },
          messages: [{ $ref: '#/channels/chat.message/messages/chat.message' }],
        },
      },
    },
    components: {
      messages: {
        'chat.send': {
          name: 'chat.send',
          contentType: 'application/json',
          payload: { type: 'object', properties: { text: { type: 'string' } } },
        },
      },
      securitySchemes: {
        bearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        oidc: {
          type: 'openIdConnect',
          openIdConnectUrl: 'https://example.com/.well-known/openid-configuration',
        },
      },
    },
  };
  expectType<AsyncAPI.Document>(doc);
}

{
  const bad: AsyncAPI.Document = {
    // @ts-expect-error 不支持 2.x
    asyncapi: '2.6.0',
    info: { title: 'x', version: '1' },
  };
  void bad;
}

{
  const op: AsyncAPI.OperationObject = {
    // @ts-expect-error action 仅 send | receive
    action: 'publish',
    channel: { $ref: '#/channels/x' },
  };
  void op;
}

{
  // @ts-expect-error Server 缺 protocol
  const server: AsyncAPI.ServerObject = {
    host: 'example.com',
  };
  void server;
}

{
  const payload: AsyncAPI.AnySchemaObject = {
    schemaFormat: 'application/schema+json;version=draft-07',
    schema: { type: 'string' },
  };
  expectType<AsyncAPI.MultiFormatSchemaObject>(payload);
}

{
  expectType<TypeEqual<'3.0.0' | '3.1.0', AsyncAPI.Document['asyncapi']>>(true);
}
