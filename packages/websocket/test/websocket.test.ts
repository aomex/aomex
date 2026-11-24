import { once } from 'node:events';
import { IncomingMessage } from 'node:http';
import { join } from 'node:path';
import type http from 'node:http';
import { Socket } from 'node:net';
import { afterEach, expect, test, vi } from 'vitest';
import { rule } from '@aomex/common';
import { BaseWebRequest, type WebApp } from '@aomex/web';
import { TestWebApp } from '../../web/src/testing';
import { Channel, MemoryHub, channels, payload } from '../src';
import { TestWebsocketApp } from '../src/testing';
import { i18n } from '../src/i18n';
import { WsTransport } from '../../websocket-ws-transport/src';
import { listenWebsocket, closeServer, connect, recv, send } from './fixture/ws-helpers';
import type { AddressInfo } from 'node:net';

const fixtureDir = join(import.meta.dirname, 'fixture', 'channels');
const slot: { server?: http.Server } = {};

const raceMessage = (ws: WebSocket) =>
  Promise.race([
    recv(ws).then(() => 'got' as const),
    new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 150)),
  ]);

afterEach(async () => {
  await closeServer(slot);
});

test('同一 WebsocketApp 不可重复 attach', async () => {
  const app = new TestWebApp();
  const server = app.http({});
  const ws = new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    mount: [channels([])],
  });
  ws.attach(app, server);
  expect(() => ws.attach(app, server)).toThrow();
});

test('attach 向 WebApp 登记 onShutdown，触发 transport.shutdown', async () => {
  const app = new TestWebApp();
  const server = app.http({});
  const transport = new WsTransport({ heartbeatInterval: 0 });
  const spy = vi.spyOn(transport, 'shutdown');
  new TestWebsocketApp({
    transport,
    mount: [channels([])],
  }).attach(app, server);
  expect(app['shutdownHooks'].size).toBe(1);
  await app['runShutdownHooks']();
  expect(spy).toHaveBeenCalledTimes(1);
});

test('attach 只挂到指定 server，另一端口无 WS', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const app = new TestWebApp();
  const withWs = app.http({});
  const withoutWs = app.http({});
  new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    mount: [channels([channel])],
  }).attach(app, withWs);

  slot.server = withWs.listen(0) as http.Server;
  const wsPort = (slot.server.address() as import('node:net').AddressInfo).port;
  const plain = withoutWs.listen(0);
  const plainPort = (plain.address() as import('node:net').AddressInfo).port;

  const ok = await connect(wsPort);
  send(ok, 'ping');
  await expect(recv(ok)).resolves.toMatchObject({ event: 'pong' });
  ok.close();

  const bad = new WebSocket(`ws://127.0.0.1:${plainPort}/ws`);
  const outcome = await new Promise<'open' | 'closed'>((resolve) => {
    bad.addEventListener('open', () => resolve('open'));
    bad.addEventListener('close', () => resolve('closed'));
    bad.addEventListener('error', () => {});
  });
  expect(outcome).toBe('closed');
  await new Promise<void>((resolve, reject) => {
    plain.close((err) => (err ? reject(err) : resolve()));
  });
});

test('入站事件经 Channel 处理并可回发', async () => {
  const channel = new Channel();
  channel.on('echo', {
    action: async (ctx) => {
      expect(ctx.event).toBe('echo');
      ctx.client.send('echo', ctx.rawPayload);
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'echo', { hello: 'world' });
  await expect(recv(ws)).resolves.toEqual({
    event: 'echo',
    data: { hello: 'world' },
  });
  ws.close();
});

test('未知事件默认忽略', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'nope', {});
  send(ws, 'ping', {});
  await expect(recv(ws)).resolves.toEqual({ event: 'pong', data: undefined });
  ws.close();
});

test('unknownEvent: error 时未知事件回推 error', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });

  const { port } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel], unknownEvent: 'error' },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'nope', {});
  const msg = await recv(ws);
  expect(msg.event).toBe('error');
  ws.close();
});

test('非法帧关闭连接', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  ws.send('not-json');
  await once(ws, 'close');
});

test('room 广播只推给房内连接', async () => {
  const channel = new Channel();
  channel.on('room.join', {
    mount: [payload(rule.object({ roomId: rule.string() }))],
    action: async (ctx) => {
      await ctx.client.join(ctx.payload.roomId);
      ctx.client.send('room.joined', { roomId: ctx.payload.roomId });
    },
  });
  channel.on('chat.send', {
    mount: [payload(rule.object({ roomId: rule.string(), text: rule.string() }))],
    action: async (ctx) => {
      ctx.room(ctx.payload.roomId).send('chat.message', {
        text: ctx.payload.text,
        from: ctx.client.id,
      });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);

  const a = await connect(port);
  const b = await connect(port);
  const c = await connect(port);

  send(a, 'room.join', { roomId: 'lobby' });
  send(b, 'room.join', { roomId: 'lobby' });
  send(c, 'room.join', { roomId: 'other' });
  await recv(a);
  await recv(b);
  await recv(c);

  send(a, 'chat.send', { roomId: 'lobby', text: 'hello' });
  const [msgB, msgA] = await Promise.all([recv(b), recv(a)]);
  expect(msgA.event).toBe('chat.message');
  expect(msgB.event).toBe('chat.message');
  expect(msgA.data).toMatchObject({ text: 'hello' });
  expect(msgB.data).toMatchObject({ text: 'hello' });

  const late = Promise.race([
    recv(c).then(() => 'got'),
    new Promise((r) => setTimeout(() => r('timeout'), 200)),
  ]);
  await expect(late).resolves.toBe('timeout');

  a.close();
  b.close();
  c.close();
});

test('all.send 广播全体', async () => {
  const channel = new Channel();
  channel.on('shout', {
    mount: [payload(rule.object({ text: rule.string() }))],
    action: async (ctx) => {
      ctx.all.send('shout', { text: ctx.payload.text });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const a = await connect(port);
  const b = await connect(port);
  send(a, 'shout', { text: 'all' });
  const [msgA, msgB] = await Promise.all([recv(a), recv(b)]);
  expect(msgA).toEqual({ event: 'shout', data: { text: 'all' } });
  expect(msgB).toEqual({ event: 'shout', data: { text: 'all' } });
  a.close();
  b.close();
});

test('HTTP 写完后用 ws.room / ws.all 推给已连接客户端', async () => {
  const channel = new Channel();
  channel.on('order.watch', {
    mount: [payload(rule.object({ orderId: rule.string() }))],
    action: async (ctx) => {
      await ctx.client.join(`order:${ctx.payload.orderId}`);
      ctx.client.send('watched', { id: ctx.client.id });
    },
  });

  const { port, ws } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel] },
    slot,
  );
  const a = await connect(port);
  const b = await connect(port);
  const c = await connect(port);

  send(a, 'order.watch', { orderId: '1' });
  send(b, 'order.watch', { orderId: '1' });
  const watchedA = await recv(a);
  const watchedB = await recv(b);
  const idA = (watchedA.data as { id: string }).id;
  const idB = (watchedB.data as { id: string }).id;

  const outsider = raceMessage(c);
  await ws.room('order:1').send('order.updated', { id: '1', title: 'x' });
  const [msgA, msgB] = await Promise.all([recv(a), recv(b)]);
  expect(msgA).toEqual({ event: 'order.updated', data: { id: '1', title: 'x' } });
  expect(msgB).toEqual(msgA);
  await expect(outsider).resolves.toBe('timeout');

  const missedDm = raceMessage(b);
  await ws.room(idA).send('dm', { text: 'only-a' });
  await expect(recv(a)).resolves.toEqual({ event: 'dm', data: { text: 'only-a' } });
  await expect(missedDm).resolves.toBe('timeout');

  const skipped = raceMessage(b);
  await ws.all.send('notice', { text: 'all' }, { except: idB });
  const [noticeA, noticeC] = await Promise.all([recv(a), recv(c)]);
  expect(noticeA).toEqual({ event: 'notice', data: { text: 'all' } });
  expect(noticeC).toEqual(noticeA);
  await expect(skipped).resolves.toBe('timeout');

  expect(() => ws.room('')).toThrow();
  expect(() => ws.room('a\0b')).toThrow();
  const nobody = Promise.all([raceMessage(a), raceMessage(b), raceMessage(c)]);
  await ws.room('order:nobody').send('order.updated', { id: 'nobody' });
  await expect(nobody).resolves.toEqual(['timeout', 'timeout', 'timeout']);

  a.close();
  b.close();
  c.close();
});

test('广播等到 Hub onInit 完成才写出', async () => {
  class SlowHub extends MemoryHub {
    broadcasts = 0;
    release!: () => void;
    override onInit(): Promise<void> {
      return new Promise((resolve) => {
        this.release = resolve;
      });
    }
    override broadcastAll(...args: Parameters<MemoryHub['broadcastAll']>): Promise<void> {
      this.broadcasts += 1;
      return Promise.resolve(super.broadcastAll(...args));
    }
  }

  const hub = new SlowHub();
  const ws = new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    hub,
    mount: [channels([])],
  });
  let settled = false;
  const pending = ws.all.send('notice', { ok: true }).then(() => {
    settled = true;
  });
  await new Promise((resolve) => setImmediate(resolve));
  expect(hub.broadcasts).toBe(0);
  expect(settled).toBe(false);
  hub.release();
  await pending;
  expect(hub.broadcasts).toBe(1);
});

test('自定义 path', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong', true);
    },
  });

  const { port } = await listenWebsocket(
    new TestWebApp(),
    { path: '/realtime', channels: [channel] },
    slot,
  );
  const ws = await connect(port, '/realtime');
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toEqual({ event: 'pong', data: true });
  ws.close();
});

test('跨 Channel 重复事件名在注册时抛错', async () => {
  const a = new Channel();
  const b = new Channel();
  a.on('ping', { action: async () => {} });
  b.on('ping', { action: async () => {} });

  await expect(
    listenWebsocket(new TestWebApp(), { channels: [a, b] }, slot),
  ).rejects.toThrow();
});

test('从目录加载 Channel', async () => {
  const { port } = await listenWebsocket(
    new TestWebApp(),
    { channels: fixtureDir },
    slot,
  );
  const ws = await vi.waitFor(
    async () => {
      const socket = new WebSocket(`ws://127.0.0.1:${port}/ws`);
      try {
        await Promise.race([
          once(socket, 'open'),
          once(socket, 'close').then(() => {
            throw new Error('closed before open');
          }),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('connect timeout')), 100);
          }),
        ]);
        return socket;
      } catch (err) {
        socket.close();
        throw err;
      }
    },
    { timeout: 5_000, interval: 50 },
  );
  send(ws, 'fixture.ping', { n: 1 });
  await expect(recv(ws)).resolves.toEqual({
    event: 'fixture.pong',
    data: { n: 1 },
  });
  ws.close();
});

test('空 Channel 列表可挂载', async () => {
  await expect(
    listenWebsocket(new TestWebApp(), { channels: [] }, slot),
  ).resolves.toBeTruthy();
});

test('action 抛错时回推 error', async () => {
  const channel = new Channel();
  channel.on('boom', {
    action: async () => {
      throw new Error('explode');
    },
  });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'boom');
  await expect(recv(ws)).resolves.toEqual({
    event: 'error',
    data: { message: 'explode' },
  });
  ws.close();
});

test('action 抛非 Error 时回推 error', async () => {
  const channel = new Channel();
  channel.on('boom', {
    action: async () => {
      throw 'raw';
    },
  });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'boom');
  const msg = await recv(ws);
  expect(msg.event).toBe('error');
  expect(msg.data).toMatchObject({ message: expect.any(String) });
  ws.close();
});

test('leave 后不再收到房间广播', async () => {
  const channel = new Channel();
  channel.on('join', {
    mount: [payload(rule.object({ roomId: rule.string() }))],
    action: async (ctx) => {
      await ctx.client.join(ctx.payload.roomId);
      ctx.client.send('joined', true);
    },
  });
  channel.on('leave', {
    mount: [payload(rule.object({ roomId: rule.string() }))],
    action: async (ctx) => {
      await ctx.client.leave(ctx.payload.roomId);
      ctx.client.send('left', true);
    },
  });
  channel.on('say', {
    mount: [payload(rule.object({ roomId: rule.string(), text: rule.string() }))],
    action: async (ctx) => {
      ctx.room(ctx.payload.roomId).send('said', { text: ctx.payload.text });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const a = await connect(port);
  const b = await connect(port);
  send(a, 'join', { roomId: 'r' });
  send(b, 'join', { roomId: 'r' });
  await recv(a);
  await recv(b);
  send(b, 'leave', { roomId: 'r' });
  await recv(b);

  send(a, 'say', { roomId: 'r', text: 'x' });
  await expect(recv(a)).resolves.toMatchObject({ event: 'said' });
  const late = Promise.race([
    recv(b).then(() => 'got'),
    new Promise((r) => setTimeout(() => r('timeout'), 150)),
  ]);
  await expect(late).resolves.toBe('timeout');
  a.close();
  b.close();
});

test('非法房间名 join 时回推 error', async () => {
  const channel = new Channel();
  channel.on('bad-join', {
    action: async (ctx) => {
      await ctx.client.join('');
    },
  });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'bad-join');
  const msg = await recv(ws);
  expect(msg.event).toBe('error');
  ws.close();
});

test('非法帧形态关闭连接', async () => {
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  ws.send(JSON.stringify([]));
  await once(ws, 'close');
});

test('空事件名帧关闭连接', async () => {
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  ws.send(JSON.stringify({ event: '', data: 1 }));
  await once(ws, 'close');
});

test('path 自动补斜杠', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    { path: 'ws', channels: [channel] },
    slot,
  );
  const ws = await connect(port, '/ws');
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});

test('path 去掉尾部斜杠', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    { path: '/ws/', channels: [channel] },
    slot,
  );
  const ws = await connect(port, '/ws');
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});

test('非法 maxPayload 回退默认仍可连', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  for (const maxPayload of [-1, Number.NaN, 0] as const) {
    const { port } = await listenWebsocket(
      new TestWebApp(),
      { channels: [channel], maxPayload },
      slot,
    );
    const ws = await connect(port);
    send(ws, 'ping');
    await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
    ws.close();
    await closeServer(slot);
  }
});

test('合法 maxPayload 写入 App 并仍可连', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port, ws } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel], maxPayload: 256 * 1024 },
    slot,
  );
  expect(ws['maxPayload']).toBe(256 * 1024);
  const sock = await connect(port);
  send(sock, 'ping');
  await expect(recv(sock)).resolves.toMatchObject({ event: 'pong' });
  sock.close();
});

test('attach 立刻 listen；Hub 等到广播或接入才初始化', async () => {
  const app = new TestWebApp();
  const server = app.http({});
  const hub = new MemoryHub();
  const order: string[] = [];
  const origHubInit = hub.onInit.bind(hub);
  hub.onInit = () => {
    order.push('hub-init');
    return origHubInit();
  };
  const transport = new WsTransport({ heartbeatInterval: 0 });
  const origTransportInit = transport.onInit.bind(transport);
  transport.onInit = () => {
    order.push('transport-init');
    return origTransportInit();
  };
  const origListen = transport.listen.bind(transport);
  transport.listen = ((...args: Parameters<typeof transport.listen>) => {
    order.push('listen');
    return origListen(...args);
  }) as typeof transport.listen;

  const ws = new TestWebsocketApp({
    transport,
    hub,
    mount: [channels([])],
  });
  ws.attach(app, server);
  expect(order).toEqual(['listen', 'transport-init']);

  await ws.room('lobby').send('hi', null);
  expect(order).toEqual(['listen', 'transport-init', 'hub-init']);

  slot.server = server.listen(0) as http.Server;
  const port = (slot.server.address() as AddressInfo).port;
  const sock = await connect(port);
  expect(order).toEqual(['listen', 'transport-init', 'hub-init']);
  sock.close();
});

test('Hub 初始化失败时 room.send 拒绝，attach 不产生未处理 rejection', async () => {
  class BoomHub extends MemoryHub {
    override onInit(): Promise<void> {
      return Promise.reject(new Error('hub-down'));
    }
  }

  const rejections: unknown[] = [];
  const onRejection = (err: unknown) => {
    rejections.push(err);
  };
  process.on('unhandledRejection', onRejection);
  try {
    const app = new TestWebApp();
    const server = app.http({});
    const ws = new TestWebsocketApp({
      transport: new WsTransport({ heartbeatInterval: 0 }),
      hub: new BoomHub(),
      mount: [channels([])],
    });
    ws.attach(app, server);
    await new Promise((resolve) => setImmediate(resolve));
    expect(rejections).toEqual([]);

    await expect(ws.all.send('notice', 1)).rejects.toThrow('hub-down');
    slot.server = server.listen(0) as http.Server;
    const port = (slot.server.address() as AddressInfo).port;
    const sock = new WebSocket(`ws://127.0.0.1:${port}/ws`);
    const closed = once(sock, 'close');
    await once(sock, 'open');
    await closed;
    await new Promise((resolve) => setImmediate(resolve));
    expect(rejections).toEqual([]);
  } finally {
    process.off('unhandledRejection', onRejection);
  }
});

test('ctx.client.close 断开连接', async () => {
  const channel = new Channel();
  channel.on('kick', {
    action: async (ctx) => {
      await ctx.client.close();
    },
  });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'kick');
  await once(ws, 'close');
});

test('room.send + except 广播排除自己', async () => {
  const channel = new Channel();
  channel.on('join', {
    mount: [payload(rule.object({ roomId: rule.string() }))],
    action: async (ctx) => {
      await ctx.client.join(ctx.payload.roomId);
      ctx.client.send('joined', true);
    },
  });
  channel.on('say', {
    mount: [payload(rule.object({ roomId: rule.string(), text: rule.string() }))],
    action: async (ctx) => {
      ctx
        .room(ctx.payload.roomId)
        .send('said', { text: ctx.payload.text }, { except: ctx.client });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const a = await connect(port);
  const b = await connect(port);
  send(a, 'join', { roomId: 'r' });
  send(b, 'join', { roomId: 'r' });
  await recv(a);
  await recv(b);

  send(a, 'say', { roomId: 'r', text: 'hi' });
  await expect(recv(b)).resolves.toEqual({ event: 'said', data: { text: 'hi' } });
  const late = Promise.race([
    recv(a).then(() => 'got'),
    new Promise((r) => setTimeout(() => r('timeout'), 150)),
  ]);
  await expect(late).resolves.toBe('timeout');
  a.close();
  b.close();
});

test('room.send + except 可用 client.id 字符串', async () => {
  const channel = new Channel();
  channel.on('join', {
    mount: [payload(rule.object({ roomId: rule.string() }))],
    action: async (ctx) => {
      await ctx.client.join(ctx.payload.roomId);
      ctx.client.send('joined', true);
    },
  });
  channel.on('say', {
    mount: [payload(rule.object({ roomId: rule.string(), text: rule.string() }))],
    action: async (ctx) => {
      ctx
        .room(ctx.payload.roomId)
        .send('said', { text: ctx.payload.text }, { except: ctx.client.id });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const a = await connect(port);
  const b = await connect(port);
  send(a, 'join', { roomId: 'r' });
  send(b, 'join', { roomId: 'r' });
  await recv(a);
  await recv(b);
  send(a, 'say', { roomId: 'r', text: 'hi' });
  await expect(recv(b)).resolves.toEqual({ event: 'said', data: { text: 'hi' } });
  a.close();
  b.close();
});

test('verify 拒绝握手', async () => {
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel], verify: () => false },
    slot,
  );
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  const outcome = await new Promise<'open' | 'closed'>((resolve) => {
    ws.addEventListener('open', () => resolve('open'));
    ws.addEventListener('close', () => resolve('closed'));
    ws.addEventListener('error', () => {
      // 浏览器/Node 在握手失败时通常先 error 再 close
    });
  });
  expect(outcome).toBe('closed');
});

test('verify 返回 HttpErrorStatus 拒绝握手', async () => {
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel], verify: () => 401 },
    slot,
  );
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  const outcome = await new Promise<'open' | 'closed'>((resolve) => {
    ws.addEventListener('open', () => resolve('open'));
    ws.addEventListener('close', () => resolve('closed'));
    ws.addEventListener('error', () => {});
  });
  expect(outcome).toBe('closed');
});

test('verify 抛错时拒绝握手', async () => {
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      verify: () => {
        throw new Error('boom');
      },
    },
    slot,
  );
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  const outcome = await new Promise<'open' | 'closed'>((resolve) => {
    ws.addEventListener('open', () => resolve('open'));
    ws.addEventListener('close', () => resolve('closed'));
    ws.addEventListener('error', () => {});
  });
  expect(outcome).toBe('closed');
});

test('verify 使用 BaseWebRequest cookies / ip / request.req 自引用', async () => {
  const { WebSocket: WsClient } = await import('ws');
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  let seenCookie: string | undefined;
  let seenIp: string | undefined;
  let seenReqSelf = false;
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      verify: (request) => {
        seenCookie = request.cookies['token'];
        seenIp = request.ip;
        seenReqSelf = request.req === request;
        return request.cookies['token'] === 'ok';
      },
    },
    slot,
  );
  const ws = new WsClient(`ws://127.0.0.1:${port}/ws`, {
    headers: { Cookie: 'token=ok' },
  });
  await once(ws, 'open');
  expect(seenCookie).toBe('ok');
  expect(seenIp).toBeTruthy();
  expect(seenReqSelf).toBe(true);
  ws.close();
});

test('client.data 与 rooms / request 可用', async () => {
  const channel = new Channel();
  channel.on('auth', {
    mount: [payload(rule.object({ userId: rule.string() }))],
    action: async (ctx) => {
      ctx.client.data['userId'] = ctx.payload.userId;
      await ctx.client.join('vip');
      ctx.client.send('ok', {
        userId: ctx.client.data['userId'],
        rooms: [...(await ctx.client.getRooms())],
        ip: ctx.client.request.ip,
      });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'auth', { userId: 'u1' });
  const msg = await recv(ws);
  expect(msg.event).toBe('ok');
  const data = msg.data as { userId: string; rooms: string[]; ip: string };
  expect(data.userId).toBe('u1');
  expect(data.ip).toBeTruthy();
  expect(data.rooms).toContain('vip');
  expect(data.rooms.length).toBeGreaterThanOrEqual(2);
  ws.close();
});

test('room(client.id) 可点对点推送', async () => {
  const channel = new Channel();
  channel.on('whoami', {
    action: async (ctx) => {
      ctx.client.send('id', ctx.client.id);
    },
  });
  channel.on('dm', {
    mount: [payload(rule.object({ to: rule.string(), text: rule.string() }))],
    action: async (ctx) => {
      ctx.room(ctx.payload.to).send('dm', { text: ctx.payload.text });
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const a = await connect(port);
  const b = await connect(port);
  send(a, 'whoami');
  send(b, 'whoami');
  const idA = (await recv(a)).data as string;
  const idB = (await recv(b)).data as string;
  expect(idA).toBeTruthy();
  expect(idB).toBeTruthy();

  send(a, 'dm', { to: idB, text: 'hi' });
  await expect(recv(b)).resolves.toEqual({ event: 'dm', data: { text: 'hi' } });
  a.close();
  b.close();
});

const languageRequest = (headers: http.IncomingHttpHeaders) => {
  const raw = new IncomingMessage(new Socket());
  for (const [name, value] of Object.entries(headers)) {
    if (value !== undefined) raw.headers[name] = value;
  }
  Object.setPrototypeOf(raw, BaseWebRequest.prototype);
  return raw as unknown as BaseWebRequest;
};

test('TestWebsocketApp 默认 fixed zh-CN，并忽略请求头', () => {
  const transport = new WsTransport({ heartbeatInterval: 0 });
  const plain = new TestWebsocketApp({
    transport,
    mount: [channels([])],
  });
  expect(plain['options'].logger).toBeTruthy();
  expect(plain['resolveLanguage']()).toBe('zh-CN');
  expect(plain['resolveLanguage'](languageRequest({ 'accept-language': 'en-US' }))).toBe(
    'zh-CN',
  );

  const fixed = new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    language: { mode: 'fixed', language: 'en-US' },
    mount: [channels([])],
  });
  expect(fixed['resolveLanguage'](languageRequest({ 'accept-language': 'ja-JP' }))).toBe(
    'en-US',
  );
});

test('dynamic 按握手头协商，对不上用 fallback', () => {
  const ws = new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    language: { mode: 'dynamic', header: 'X-Language', fallback: 'en-US' },
    mount: [channels([])],
  });

  expect(ws['resolveLanguage']()).toBe('en-US');
  expect(ws['resolveLanguage'](languageRequest({}))).toBe('en-US');
  expect(ws['resolveLanguage'](languageRequest({ 'x-language': '*' }))).toBe('en-US');
  expect(ws['resolveLanguage'](languageRequest({ 'x-language': 'nope' }))).toBe('en-US');
  expect(ws['resolveLanguage'](languageRequest({ 'x-language': 'ja-JP' }))).toBe('ja-JP');
  expect(ws['resolveLanguage'](languageRequest({ 'x-language': 'zh_cn' }))).toBe('zh-CN');
  expect(
    ws['resolveLanguage'](languageRequest({ 'x-language': 'en-US;q=0.1, ja-JP;q=0.9' })),
  ).toBe('en-US');
  expect(ws['resolveLanguage'](languageRequest({ 'x-language': '*, ja-JP' }))).toBe(
    'ja-JP',
  );
  expect(
    ws['resolveLanguage'](languageRequest({ 'x-language': ['ja-JP', 'en-US'] })),
  ).toBe('ja-JP');
  expect(ws['resolveLanguage'](languageRequest({ 'x-language': ' , ,en-US' }))).toBe(
    'en-US',
  );
});

test('dynamic 的 accept-language 按 q 排序', () => {
  const ws = new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    language: { mode: 'dynamic', fallback: 'zh-CN' },
    mount: [channels([])],
  });
  expect(
    ws['resolveLanguage'](
      languageRequest({ 'accept-language': 'en;q=0.1, ja-JP;q=0.9' }),
    ),
  ).toBe('ja-JP');
  expect(ws['resolveLanguage'](languageRequest({ 'accept-language': 'en' }))).toBe(
    'en-US',
  );
  expect(ws['resolveLanguage'](languageRequest({ 'accept-language': '*' }))).toBe(
    'zh-CN',
  );
});

test('重复 attach 的错误文案跟随 language', () => {
  const app = new TestWebApp();
  const server = app.http({});
  const ws = new TestWebsocketApp({
    transport: new WsTransport({ heartbeatInterval: 0 }),
    language: { mode: 'fixed', language: 'en-US' },
    mount: [channels([])],
  });
  ws.attach(app, server);
  expect(() => ws.attach(app, server)).toThrow('WebsocketApp is already attached');
});

test('fixed 语言包住握手校验和入站处理', async () => {
  let seen = '';
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      seen = i18n.language;
      expect(ctx.client.language).toBe('en-US');
      ctx.client.send('pong');
    },
  });
  let verifyLanguage = '';
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      language: { mode: 'fixed', language: 'en-US' },
      channels: [channel],
      unknownEvent: 'error',
      verify: () => {
        verifyLanguage = i18n.language;
        return true;
      },
    },
    slot,
  );
  const ws = await connect(port);
  expect(verifyLanguage).toBe('en-US');
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toEqual({ event: 'pong', data: undefined });
  expect(seen).toBe('en-US');
  send(ws, 'nope');
  await expect(recv(ws)).resolves.toEqual({
    event: 'error',
    data: { message: 'Unknown event: nope' },
  });
  ws.close();
});

test('dynamic 按握手头翻译未知事件，缺失时用 fallback', async () => {
  const { WebSocket: WsClient } = await import('ws');
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      language: { mode: 'dynamic', header: 'x-language', fallback: 'en-US' },
      channels: [channel],
      unknownEvent: 'error',
    },
    slot,
  );

  const japanese = new WsClient(`ws://127.0.0.1:${port}/ws`, {
    headers: { 'x-language': 'ja-JP' },
  });
  await once(japanese, 'open');
  japanese.send(JSON.stringify({ event: 'nope' }));
  const [raw] = await once(japanese, 'message');
  expect(JSON.parse(String(raw))).toEqual({
    event: 'error',
    data: { message: '未知のイベント：nope' },
  });
  japanese.close();

  const fallback = new WsClient(`ws://127.0.0.1:${port}/ws`);
  await once(fallback, 'open');
  fallback.send(JSON.stringify({ event: 'nope' }));
  const [fallbackRaw] = await once(fallback, 'message');
  expect(JSON.parse(String(fallbackRaw))).toEqual({
    event: 'error',
    data: { message: 'Unknown event: nope' },
  });
  fallback.close();
});

test('非法帧的关闭原因跟随 language', async () => {
  const { port } = await listenWebsocket(
    new TestWebApp(),
    { language: { mode: 'fixed', language: 'en-US' }, channels: [] },
    slot,
  );
  const ws = await connect(port);
  const closed = new Promise<CloseEvent>((resolve) => {
    ws.addEventListener('close', (event) => resolve(event));
  });
  ws.send('not-json');
  const event = await closed;
  expect(event.code).toBe(1003);
  expect(event.reason).toBe('Invalid WebSocket frame');
});

test('握手校验抛错的日志跟随 language', async () => {
  const messages: string[] = [];
  const logger = {
    error(_err: unknown, message?: string) {
      messages.push(message ?? '');
    },
    warn() {},
  } as unknown as WebApp.Logger;
  const { port } = await listenWebsocket(
    new TestWebApp({ logger }),
    {
      language: { mode: 'fixed', language: 'en-US' },
      channels: [],
      verify: () => {
        throw new Error('nope');
      },
    },
    slot,
  );
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  await new Promise<void>((resolve) => {
    ws.addEventListener('close', () => resolve());
    ws.addEventListener('error', () => {});
  });
  expect(messages).toContain('WebSocket handshake failed');
});
