import { expect, test } from 'vitest';
import { rule } from '@aomex/common';
import { emit, payload, type SocketMiddleware } from '../../src';
import { createAsyncApiEventContext } from '../fixture/asyncapi-event-context';
import { emptyAsyncApiDocument } from '../fixture/empty-asyncapi';

test('payload 只填入站 message.payload', () => {
  const md = payload({
    text: rule.string(),
    roomId: rule.string().optional(),
  }) as SocketMiddleware;
  const ctx = createAsyncApiEventContext('chat.send');

  md['asyncapi']().onEvent?.(ctx);

  expect(ctx.message.payload).toMatchObject({
    schemaFormat: 'application/vnd.oai.openapi;version=3.2.0',
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        roomId: { type: 'string' },
      },
      required: ['text'],
    },
  });
  // 中间件不负责新建其它事件的 channel
  expect(Object.keys(ctx.document.channels ?? {})).toEqual(['chat.send']);
});

test('emit 经 addSend 填出站 message / operation', () => {
  const md = emit({
    event: 'chat.message',
    description: '房间内聊天消息',
    data: {
      from: rule.string(),
      text: rule.string(),
    },
  }) as SocketMiddleware;
  const document = emptyAsyncApiDocument();
  const ctx = createAsyncApiEventContext('chat.send', document);

  md['asyncapi']().onEvent?.(ctx);

  expect(document.components?.messages?.['chat.message']).toMatchObject({
    name: 'chat.message',
    description: '房间内聊天消息',
    payload: {
      schemaFormat: 'application/vnd.oai.openapi;version=3.2.0',
      schema: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          text: { type: 'string' },
        },
        required: ['from', 'text'],
      },
    },
  });
  expect(document.operations?.['send:chat.message']).toMatchObject({
    action: 'send',
    description: '房间内聊天消息',
  });
  expect(document.operations?.['receive:chat.send']).toMatchObject({
    action: 'receive',
  });
});

test('emit 无 data 时不写 payload', () => {
  const md = emit({ event: 'chat.ack', description: '确认' }) as SocketMiddleware;
  const ctx = createAsyncApiEventContext('ignored');
  md['asyncapi']().onEvent?.(ctx);

  expect(ctx.document.components?.messages?.['chat.ack']).toEqual({
    name: 'chat.ack',
    contentType: 'application/json',
    description: '确认',
  });
  expect(
    (ctx.document.components?.messages?.['chat.ack'] as { payload?: unknown }).payload,
  ).toBeUndefined();
});

test('同一上下文可叠加 payload + emit', () => {
  const document = emptyAsyncApiDocument();
  const ctx = createAsyncApiEventContext('chat.send', document);
  const inbound = payload({ text: rule.string() }) as SocketMiddleware;
  const outbound = emit({
    event: 'chat.message',
    data: { text: rule.string() },
  }) as SocketMiddleware;

  inbound['asyncapi']().onEvent?.(ctx);
  outbound['asyncapi']().onEvent?.(ctx);

  expect(Object.keys(document.channels ?? {}).sort()).toEqual([
    'chat.message',
    'chat.send',
  ]);
  expect(ctx.message.payload).toBeDefined();
  expect(document.operations?.['send:chat.message']).toMatchObject({
    action: 'send',
  });
});
