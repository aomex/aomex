import { expect, test } from 'vitest';
import { rule } from '@aomex/common';
import { Channel, emit, payload } from '../../src';

test('emit 运行时不改行为，仅作类型契约', async () => {
  const seen: unknown[] = [];
  const channel = new Channel();
  channel.on('chat.send', {
    mount: [
      payload({ text: rule.string() }),
      emit({
        event: 'chat.message',
        data: { text: rule.string() },
      }),
      emit({ event: 'chat.ack' }),
    ],
    action: async (ctx) => {
      seen.push(ctx.payload);
      ctx.client.send('chat.message', { text: ctx.payload.text });
      ctx.client.send('chat.ack');
    },
  });

  const fn = channel['collect']().get('chat.send');
  expect(fn).toBeTypeOf('function');

  const fakeCtx = {
    rawPayload: { text: 'hi' },
    payload: undefined as unknown,
    client: {
      id: 'c1',
      send: (event: string, data?: unknown) => {
        seen.push(data === undefined ? [event] : [event, data]);
      },
    },
  };
  await fn!(fakeCtx as any, async () => {});
  expect(seen).toEqual([{ text: 'hi' }, ['chat.message', { text: 'hi' }], ['chat.ack']]);
});

test('emit 中间件可单独 compose', async () => {
  let called = false;
  const { compose } = await import('@aomex/common');
  await compose([emit({ event: 'x', data: rule.string() })])({}, async () => {
    called = true;
  });
  expect(called).toBe(true);
});
