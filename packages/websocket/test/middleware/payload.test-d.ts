import { expectType } from 'ts-expect';
import { rule } from '@aomex/common';
import { Channel, payload } from '../../src';

// Channel.on + payload 推断（字段表字面量）
{
  const channel = new Channel();
  channel.on('chat.send', {
    mount: [
      payload({
        roomId: rule.string(),
        text: rule.string(),
      }),
    ],
    action: async (ctx) => {
      expectType<{ roomId: string; text: string }>(ctx.payload);
      ctx.client.send('chat.message', ctx.payload);
      ctx.room(ctx.payload.roomId).send('chat.message', ctx.payload);
      ctx.all.send('chat.message', ctx.payload);
      // @ts-expect-error 无此字段
      ctx.payload.missing;
    },
  });

  channel.on('noop', {
    action: async (ctx) => {
      expectType<unknown>(ctx.payload);
      ctx.client.id;
    },
  });
}

// payload 也接受 rule.object / 标量 / 数组
{
  const channel = new Channel();
  channel.on('obj', {
    mount: [payload(rule.object({ id: rule.number() }))],
    action: async (ctx) => {
      expectType<{ id: number }>(ctx.payload);
    },
  });
  channel.on('str', {
    mount: [payload(rule.string())],
    action: async (ctx) => {
      expectType<string>(ctx.payload);
    },
  });
  channel.on('num', {
    mount: [payload(rule.number())],
    action: async (ctx) => {
      expectType<number>(ctx.payload);
    },
  });
  channel.on('arr', {
    mount: [payload(rule.array(rule.number()))],
    action: async (ctx) => {
      expectType<number[]>(ctx.payload);
    },
  });
  channel.on('bool', {
    mount: [payload(rule.boolean())],
    action: async (ctx) => {
      expectType<boolean>(ctx.payload);
    },
  });
}

// Channel 级 mount 与事件级 mount 交叉
{
  const withAuth = new Channel({
    mount: [payload({ token: rule.string().optional() })],
  });
  withAuth.on('x', {
    mount: [payload({ text: rule.string() })],
    action: async (ctx) => {
      expectType<string>(ctx.payload.text);
    },
  });
}
