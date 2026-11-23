import { expect, test } from 'vitest';
import {
  encodeJsonPointerSegment,
  ensureAsyncApiMessage,
  initializeDocument,
} from '../../src';

test('JSON Pointer 转义 channel 名中的 ~ 与 /', async () => {
  const document = await initializeDocument({ asyncapi: '3.1.0' });
  ensureAsyncApiMessage(document, { event: 'a~/b', action: 'receive' });

  expect(document.channels?.['a~/b']).toMatchObject({
    messages: {
      'a~/b': { $ref: '#/components/messages/a~0~1b' },
    },
  });
  expect(document.operations?.['receive:a~/b']).toMatchObject({
    channel: { $ref: '#/channels/a~0~1b' },
    messages: [{ $ref: '#/channels/a~0~1b/messages/a~0~1b' }],
  });
  expect(encodeJsonPointerSegment('a~/b')).toBe('a~0~1b');
});

test('同名再次 ensure 不覆盖已填字段', async () => {
  const document = await initializeDocument({ asyncapi: '3.1.0' });
  const first = ensureAsyncApiMessage(document, { event: 'ping', action: 'receive' });
  first.message.description = '已填';
  first.message.payload = {
    schemaFormat: 'application/vnd.oai.openapi;version=3.0.0',
    schema: { type: 'string' },
  };

  const second = ensureAsyncApiMessage(document, { event: 'ping', action: 'receive' });
  expect(second.message).toBe(first.message);
  expect(second.message.description).toBe('已填');
  expect(second.message.payload).toMatchObject({
    schema: { type: 'string' },
  });
});

test('receive 与 send 可共用同一 channel / message', async () => {
  const document = await initializeDocument({ asyncapi: '3.1.0' });
  const receive = ensureAsyncApiMessage(document, { event: 'echo', action: 'receive' });
  const send = ensureAsyncApiMessage(document, { event: 'echo', action: 'send' });

  expect(send.message).toBe(receive.message);
  expect(send.channel).toBe(receive.channel);
  expect(receive.operation.action).toBe('receive');
  expect(send.operation.action).toBe('send');
});
