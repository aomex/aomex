import { once } from 'node:events';
import type http from 'node:http';
import { afterEach, expect, test, vitest } from 'vitest';
import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { Channel } from '@aomex/websocket';
import { internalDestroyServices } from '@aomex/common';
import { TestWebApp } from '../../web/src/testing';
import {
  closeServer,
  connect,
  listenWebsocket,
  recv,
  send,
} from '../../websocket/test/fixture/ws-helpers';
import { Abuse } from '../src';

const slot: { server?: http.Server } = {};

afterEach(async () => {
  await closeServer(slot);
  await internalDestroyServices([]);
});

test('socket：未封禁时入站正常', async () => {
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket()],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});

test('socket：已封禁 IP 回推 error 后断开且不进业务', async () => {
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  let hit = false;
  const channel = new Channel();
  channel.on('ping', {
    action: async () => {
      hit = true;
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket()],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  // 标准 ws 握手 IP 为 ::ffff:127.0.0.1
  await abuse.blockIP('::ffff:127.0.0.1', '1 hour');
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({
    event: 'error',
    data: { message: '禁止访问' },
  });
  const [closed] = (await once(ws, 'close')) as [CloseEvent];
  expect(closed.code).toBe(1008);
  expect(closed.reason).toBe('禁止访问');
  expect(hit).toBe(false);
});

test('socket：errorMessage 可定制', async () => {
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });

  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket({ errorMessage: 'custom-blocked' })],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  await abuse.blockIP('::ffff:127.0.0.1', 60_000);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({
    event: 'error',
    data: { message: 'custom-blocked' },
  });
  const [closed] = (await once(ws, 'close')) as [CloseEvent];
  expect(closed.code).toBe(1008);
  expect(closed.reason).toBe('custom-blocked');
});

test('socket：bypass 跳过封禁检查', async () => {
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket({ bypass: () => true })],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  await abuse.blockIP('::ffff:127.0.0.1', 60_000);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});

test('socket：send error 失败时仍会 close', async () => {
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  await abuse.blockIP('203.0.113.10', '1h');
  const md = abuse.socket();
  let closed = false;
  await expect(
    md['fn'](
      {
        event: 'ping',
        client: {
          id: 'c1',
          request: { ip: '203.0.113.10' },
          send: async () => {
            throw new Error('send failed');
          },
          close: async () => {
            closed = true;
          },
          data: {},
        },
      } as any,
      async () => {},
    ),
  ).rejects.toThrow('send failed');
  expect(closed).toBe(true);
});

test('web 与 socket 共用封禁态', async () => {
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  await abuse.blockIP('203.0.113.9', '1h');
  await expect(abuse.isIPBlocked('203.0.113.9')).resolves.toBe(true);

  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.client.send('pong');
    },
  });
  // 直接跑中间件：模拟已封 IP
  const md = abuse.socket();
  let called = false;
  let closed = false;
  await md['fn'](
    {
      event: 'ping',
      client: {
        id: 'c1',
        request: { ip: '203.0.113.9' },
        send: async () => {},
        close: async () => {
          closed = true;
        },
        data: {},
      },
    } as any,
    async () => {
      called = true;
    },
  );
  expect(called).toBe(false);
  expect(closed).toBe(true);

  await abuse.unblockIP('203.0.113.9');
  await md['fn'](
    {
      event: 'ping',
      client: {
        id: 'c1',
        request: { ip: '203.0.113.9' },
        send: async () => {},
        close: async () => {},
        data: {},
      },
    } as any,
    async () => {
      called = true;
    },
  );
  expect(called).toBe(true);
});

test('socket-events：命中蜜罐事件满额后封禁', async () => {
  const onBlockIP = vitest.fn();
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'socket-events',
        events: ['admin.destroy', 'debug.*'],
        limit: 1,
        window: '1h',
        blockFor: '1d',
      },
    ],
    onBlockIP,
  });
  let hit = false;
  const channel = new Channel();
  channel.on('admin.destroy', {
    action: async () => {
      hit = true;
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket()],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'admin.destroy');
  await expect(recv(ws)).resolves.toMatchObject({
    event: 'error',
    data: { message: '禁止访问' },
  });
  const [closed] = (await once(ws, 'close')) as [CloseEvent];
  expect(closed.code).toBe(1008);
  expect(hit).toBe(false);
  expect(onBlockIP).toHaveBeenCalledWith('::ffff:127.0.0.1', 'socket-events', {
    count: 1,
    limit: 1,
    blockFor: expect.any(Number),
  });
});

test('socket-events：未满额仍放行业务', async () => {
  const onBlockIP = vitest.fn();
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'socket-events',
        events: ['trap'],
        limit: 2,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });
  const channel = new Channel();
  channel.on('trap', {
    action: async (ctx) => {
      await ctx.client.send('ok');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket()],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'trap');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'ok' });
  expect(onBlockIP).not.toHaveBeenCalled();
  send(ws, 'trap');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'error' });
  const [closed] = (await once(ws, 'close')) as [CloseEvent];
  expect(closed.code).toBe(1008);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'socket-events', {
    count: 2,
    limit: 2,
    blockFor: expect.any(Number),
  });
});

test('socket-events：未命中事件不计数', async () => {
  const onBlockIP = vitest.fn();
  const abuse = new Abuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'socket-events',
        events: ['trap'],
        limit: 1,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [abuse.socket()],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  expect(onBlockIP).not.toHaveBeenCalled();
  ws.close();
});

test('socket-events：空 events 创建即抛错', () => {
  expect(
    () =>
      new Abuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'socket-events',
            events: [],
            limit: 1,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
      }),
  ).toThrow(/events 不能为空/);
});
