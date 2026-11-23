import { join } from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { rule } from '@aomex/common';
import { Channel, emit, payload } from '@aomex/websocket';
import { generateAsyncapi, validateAsyncapi } from '../../src';
import { rm } from 'node:fs/promises';

afterEach(async () => {
  await rm(join(import.meta.dirname, 'tmp-asyncapi.json'), { force: true });
});

test('指定基础文档', async () => {
  const result = await generateAsyncapi({
    channels: [],
    docs: {
      asyncapi: '3.1.0',
      info: { title: 'ws-demo', version: '1.2.3' },
    },
  });
  expect(result).toMatchObject({
    asyncapi: '3.1.0',
    info: { title: 'ws-demo', version: '1.2.3' },
    channels: {},
    operations: {},
  });
});

test('docs 的 servers 与 info 其余字段会进入文档', async () => {
  const result = await generateAsyncapi({
    channels: [],
    docs: {
      asyncapi: '3.1.0',
      id: 'urn:aomex:chat',
      defaultContentType: 'application/json',
      servers: {
        prod: { host: 'example.com', protocol: 'wss', pathname: '/ws' },
      },
      info: {
        title: 'chat',
        version: '1.0.0',
        description: '房间',
        contact: { name: 'aomex', email: 'dev@example.com' },
        license: { name: 'MIT' },
      },
    },
  });

  expect(result.id).toBe('urn:aomex:chat');
  expect(result.defaultContentType).toBe('application/json');
  expect(result.servers).toEqual({
    prod: { host: 'example.com', protocol: 'wss', pathname: '/ws' },
  });
  expect(result.info).toEqual({
    title: 'chat',
    version: '1.0.0',
    description: '房间',
    contact: { name: 'aomex', email: 'dev@example.com' },
    license: { name: 'MIT' },
  });
  expect(result.channels).toEqual({});
  expect(result.operations).toEqual({});
  expect(result.components).toEqual({ messages: {} });
});

test('允许 asyncapi 3.0.0', async () => {
  const result = await generateAsyncapi({
    channels: [],
    docs: { asyncapi: '3.0.0', info: { title: 'v3', version: '0.0.1' } },
  });
  expect(result.asyncapi).toBe('3.0.0');
});

test('从 Channel 实例收集 payload / emit', async () => {
  const channel = new Channel();
  channel.on('chat.send', {
    mount: [
      payload({ text: rule.string() }),
      emit({
        event: 'chat.message',
        data: { text: rule.string() },
      }),
    ],
    action: async () => {},
  });

  const result = await generateAsyncapi({
    channels: [channel],
    docs: { asyncapi: '3.1.0', info: { title: 'chat', version: '1.0.0' } },
  });

  expect(result.channels?.['chat.send']).toMatchObject({ address: 'chat.send' });
  expect(result.channels?.['chat.message']).toMatchObject({ address: 'chat.message' });
  expect(result.operations?.['receive:chat.send']).toMatchObject({
    action: 'receive',
  });
  expect(result.operations?.['send:chat.message']).toMatchObject({
    action: 'send',
  });
  expect(result.components?.messages?.['chat.send']).toMatchObject({
    payload: {
      schemaFormat: 'application/vnd.oai.openapi;version=3.0.0',
      schema: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text'],
      },
    },
  });
});

test('从文件 glob 加载 Channel', async () => {
  const result = await generateAsyncapi({
    channels: join(import.meta.dirname, '..', 'fixtures', 'chat.channel.ts'),
    docs: { asyncapi: '3.1.0', info: { title: 'from-file', version: '0.1.0' } },
  });

  expect(Object.keys(result.channels ?? {}).sort()).toEqual([
    'chat.ack',
    'chat.message',
    'chat.send',
  ]);
});

test('手动 fix', async () => {
  const result = await generateAsyncapi({
    channels: [],
    docs: { asyncapi: '3.1.0', info: { title: 'a', version: '1.0.0' } },
    fix(doc) {
      doc.info.description = 'patched';
    },
  });
  expect(result.info.description).toBe('patched');
});

test('Spectral asyncapi 校验可通过', async () => {
  const channel = new Channel();
  channel.on('ping', {
    mount: [payload({ n: rule.int() }), emit({ event: 'pong', data: rule.int() })],
    action: async () => {},
  });
  const document = await generateAsyncapi({
    channels: [channel],
    docs: { asyncapi: '3.1.0', info: { title: 'ping', version: '1.0.0' } },
  });
  const { errors } = await validateAsyncapi(document);
  expect(errors).toEqual([]);
});
