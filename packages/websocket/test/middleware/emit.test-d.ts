import { expectType, type TypeEqual } from 'ts-expect';
import { rule, type Middleware } from '@aomex/common';
import {
  Channel,
  emit,
  payload,
  type CollectEmitMap,
  type EmitContracts,
} from '../../src';

// emit 返回的契约 Props
{
  const withData = emit({
    event: 'chat.message',
    description: '聊天消息',
    data: rule.object({ text: rule.string() }),
  });
  type Props = Middleware.Infer<typeof withData>;
  expectType<TypeEqual<EmitContracts<{ 'chat.message': { text: string } }>, Props>>(true);

  const noData = emit({ event: 'chat.ack', description: '确认' });
  type AckProps = Middleware.Infer<typeof noData>;
  expectType<TypeEqual<EmitContracts<{ 'chat.ack': void }>, AckProps>>(true);

  // @ts-expect-error description 必须是 string
  emit({ event: 'x', description: 1 });
  // @ts-expect-error description 必须是 string
  emit({ event: 'x', description: true });
}

// 多个 emit 交叉后 CollectEmitMap 合并
{
  type Merged = EmitContracts<{ a: number }> & EmitContracts<{ b: string }>;
  type Map = CollectEmitMap<Merged>;
  expectType<TypeEqual<{ a: number } & { b: string }, Map>>(true);
}

// 声明出站事件后，send 按事件名收窄 data
{
  const channel = new Channel();
  channel.on('chat.send', {
    mount: [
      payload({ text: rule.string() }),
      emit({
        event: 'chat.message',
        data: {
          from: rule.string(),
          text: rule.string(),
        },
      }),
      emit({ event: 'chat.ack' }),
    ],
    action: async (ctx) => {
      expectType<string>(ctx.payload.text);

      ctx.send('chat.message', {
        from: ctx.client.id,
        text: ctx.payload.text,
      });
      ctx.send('chat.ack');
      ctx.client.send('chat.message', {
        from: ctx.client.id,
        text: ctx.payload.text,
      });
      ctx.client.send('chat.ack');
      ctx.room('lobby').send('chat.message', {
        from: 'u1',
        text: 'hi',
      });
      ctx
        .room('lobby')
        .send('chat.message', { from: 'u1', text: 'hi' }, { except: ctx.client });
      ctx.all.send('chat.ack');
      ctx.all.send('chat.ack', undefined, { except: ctx.client.id });

      // 仍可读写连接态
      await ctx.client.join('lobby');
      ctx.client.data['x'] = 1;

      // @ts-expect-error 未声明的事件
      ctx.send('unknown', {});
      // @ts-expect-error 未声明的事件
      ctx.client.send('unknown', {});
      // @ts-expect-error data 形状错误
      ctx.send('chat.message', { from: 1, text: 'x' });
      // @ts-expect-error data 形状错误
      ctx.client.send('chat.message', { from: 1, text: 'x' });
      // @ts-expect-error 缺少必填字段
      ctx.send('chat.message', { from: 'u1' });
      // @ts-expect-error 缺少必填字段
      ctx.client.send('chat.message', { from: 'u1' });
      ctx.send('chat.message', {
        from: 'u1',
        text: 'hi',
        // @ts-expect-error 多余字段
        extra: true,
      });
      ctx.client.send('chat.message', {
        from: 'u1',
        text: 'hi',
        // @ts-expect-error 多余字段
        extra: true,
      });
      ctx.room('lobby').send('chat.message', {
        from: 'u1',
        text: 'hi',
        // @ts-expect-error room 同样禁多余字段
        extra: true,
      });
      // @ts-expect-error chat.ack 无载荷
      ctx.send('chat.ack', { x: 1 });
      // @ts-expect-error chat.ack 无载荷
      ctx.client.send('chat.ack', { x: 1 });
      // @ts-expect-error room 同样收窄
      ctx.room('lobby').send('chat.message', { text: 'hi' });
      // @ts-expect-error all 同样收窄
      ctx.all.send('chat.message', { from: 1, text: 'x' });
    },
  });
}

// 未挂 emit 时仍是宽松 send
{
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.send('anything', { a: 1 });
      ctx.send('pong');
      ctx.client.send('anything', { a: 1 });
      ctx.client.send('pong');
      ctx.all.send('y', undefined, { except: ctx.client });
      ctx.room('r').send('y', undefined, { except: ctx.client });
      ctx.room('r').send('y', undefined, { except: ctx.client.id });
    },
  });
}

// Channel 级 emit + 事件级 emit 叠加
{
  const channel = new Channel({
    mount: [emit({ event: 'global.tick', data: rule.number() })],
  });
  channel.on('x', {
    mount: [emit({ event: 'local.done' })],
    action: async (ctx) => {
      ctx.send('global.tick', 1);
      ctx.send('local.done');
      ctx.client.send('global.tick', 1);
      ctx.client.send('local.done');
      // @ts-expect-error
      ctx.send('global.tick', 'x');
      // @ts-expect-error
      ctx.client.send('global.tick', 'x');
      // @ts-expect-error
      ctx.send('missing');
      // @ts-expect-error
      ctx.client.send('missing');
    },
  });
}

// 标量 / 数组 / 布尔 / 可选字段
{
  const channel = new Channel();
  channel.on('x', {
    mount: [
      emit({ event: 'str', data: rule.string() }),
      emit({ event: 'num', data: rule.number() }),
      emit({ event: 'bool', data: rule.boolean() }),
      emit({ event: 'arr', data: rule.array(rule.string()) }),
      emit({
        event: 'opt',
        data: rule.object({
          a: rule.string(),
          b: rule.number().optional(),
        }),
      }),
    ],
    action: async (ctx) => {
      ctx.send('str', 'ok');
      ctx.send('num', 1);
      ctx.send('bool', true);
      ctx.send('arr', ['a']);
      ctx.send('opt', { a: 'x' });
      ctx.send('opt', { a: 'x', b: 1 });
      ctx.client.send('str', 'ok');
      ctx.client.send('num', 1);
      ctx.client.send('bool', true);
      ctx.client.send('arr', ['a']);
      ctx.client.send('opt', { a: 'x' });
      ctx.client.send('opt', { a: 'x', b: 1 });
      // @ts-expect-error
      ctx.send('str', 1);
      // @ts-expect-error
      ctx.client.send('str', 1);
      // @ts-expect-error
      ctx.send('arr', [1]);
      // @ts-expect-error
      ctx.client.send('arr', [1]);
      // @ts-expect-error
      ctx.send('opt', { b: 1 });
      // @ts-expect-error
      ctx.client.send('opt', { b: 1 });
      // @ts-expect-error 多余字段
      ctx.send('opt', { a: 'x', extra: true });
      // @ts-expect-error 广播同样禁多余字段
      ctx.all.send('opt', { a: 'x', extra: true }, { except: ctx.client });
    },
  });
}

// 嵌套 / 可空 / 数组元素
{
  const channel = new Channel();
  channel.on('x', {
    mount: [
      emit({
        event: 'pack',
        data: {
          user: rule.object({ id: rule.number() }).nullable(),
          rows: rule.array({ n: rule.number() }),
        },
      }),
    ],
    action: async (ctx) => {
      ctx.send('pack', { user: null, rows: [] });
      ctx.send('pack', { user: { id: 1 }, rows: [{ n: 1 }] });
      ctx.client.send('pack', { user: { id: 1 }, rows: [{ n: 0 }] });
      // @ts-expect-error user 不能 undefined
      ctx.send('pack', { user: undefined, rows: [] });
      ctx.send('pack', {
        user: {
          id: 1,
          // @ts-expect-error 嵌套多余
          x: 1,
        },
        rows: [],
      });
      ctx.send('pack', {
        user: null,
        rows: [
          {
            n: 1,
            // @ts-expect-error 数组元素多余
            x: 1,
          },
        ],
      });
      const wider = {
        user: null as { id: number } | null,
        rows: [] as { n: number }[],
        extra: 1,
      };
      // @ts-expect-error 变量带回多余键
      ctx.send('pack', wider);
    },
  });
}

// __emitContracts 不出现在业务 ctx
{
  const channel = new Channel();
  channel.on('x', {
    mount: [emit({ event: 'a', data: rule.string() })],
    action: async (ctx) => {
      // @ts-expect-error
      ctx.__emitContracts;
    },
  });
}
