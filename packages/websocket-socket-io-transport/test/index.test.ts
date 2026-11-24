import type { AddressInfo } from 'node:net';
import type http from 'node:http';
import { afterEach, expect, test, vi } from 'vitest';
import { io as ioClient, type Socket } from 'socket.io-client';
import { internalDestroyServices, middleware, rule } from '@aomex/common';
import { TestWebApp } from '../../web/src/testing';
import { Channel, payload, channels, type WebsocketAppOptions } from '@aomex/websocket';
import { TestWebsocketApp } from '../../websocket/src/testing';
import { SocketIoTransport } from '../src';

let server: http.Server | undefined;
let sockets: Socket[] = [];

afterEach(async () => {
  for (const s of sockets) s.close();
  sockets = [];
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => (err ? reject(err) : resolve()));
    });
    server = undefined;
  }
  await internalDestroyServices([]);
});

const start = async (
  options: Omit<WebsocketAppOptions, 'logger' | 'language'> & {
    logger?: WebsocketAppOptions['logger'];
    language?: WebsocketAppOptions['language'];
    channels?: Parameters<typeof channels>[0];
  },
) => {
  const app = new TestWebApp();
  const httpServer = app.http({});
  const { channels: channelSource, mount = [], ...rest } = options;
  new TestWebsocketApp({
    ...rest,
    logger: app['logger'],
    mount: [...mount, ...(channelSource !== undefined ? [channels(channelSource)] : [])],
  }).attach(app, httpServer);
  server = httpServer.listen(0) as http.Server;
  return (server.address() as AddressInfo).port;
};

const connect = async (port: number, path = '/ws') => {
  const socket = ioClient(`http://127.0.0.1:${port}`, {
    path,
    transports: ['websocket'],
    forceNew: true,
  });
  sockets.push(socket);
  await new Promise<void>((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });
  return socket;
};

const onceEvent = <T = unknown>(socket: Socket, event: string) =>
  new Promise<T>((resolve) => {
    socket.once(event, resolve);
  });

test('Socket.IO 适配器可收发 Channel 事件', async () => {
  const channel = new Channel();
  channel.on('echo', {
    mount: [payload(rule.object({ text: rule.string() }))],
    action: async (ctx) => {
      ctx.client.send('echo', ctx.payload);
    },
  });

  const port = await start({
    path: '/ws',
    channels: [channel],
    transport: new SocketIoTransport(),
  });

  const socket = await connect(port);
  const reply = onceEvent(socket, 'echo');
  socket.emit('echo', { text: 'sio' });
  await expect(reply).resolves.toEqual({ text: 'sio' });
});

test('Socket.IO 适配器支持 room 广播', async () => {
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
      ctx.room(ctx.payload.roomId).send('said', { text: ctx.payload.text });
    },
  });

  const port = await start({
    channels: [channel],
    transport: new SocketIoTransport(),
  });

  const a = await connect(port);
  const b = await connect(port);
  const joinedA = onceEvent(a, 'joined');
  const joinedB = onceEvent(b, 'joined');
  a.emit('join', { roomId: 'r1' });
  b.emit('join', { roomId: 'r1' });
  await joinedA;
  await joinedB;

  const saidB = onceEvent(b, 'said');
  a.emit('say', { roomId: 'r1', text: 'hi' });
  await expect(saidB).resolves.toEqual({ text: 'hi' });
});

test('Socket.IO 入站忽略 ack 回调，不把函数当 payload', async () => {
  const channel = new Channel();
  channel.on('echo', {
    mount: [payload(rule.object({ text: rule.string() }))],
    action: async (ctx) => {
      ctx.client.send('echo', ctx.payload);
    },
  });

  const port = await start({
    channels: [channel],
    transport: new SocketIoTransport(),
  });

  const socket = await connect(port);
  const reply = onceEvent(socket, 'echo');
  socket.emit('echo', { text: 'with-ack' }, () => {
    // 服务端不调用 ack；仅验证带回调时 payload 仍正确
  });
  await expect(reply).resolves.toEqual({ text: 'with-ack' });
});

test('client.id 由传输层 CSPRNG 生成，不复用 socket.id', async () => {
  const channel = new Channel();
  channel.on('whoami', {
    action: async (ctx) => {
      ctx.client.send('id', ctx.client.id);
    },
  });
  const port = await start({
    channels: [channel],
    transport: new SocketIoTransport(),
  });
  const socket = await connect(port);
  const idPromise = onceEvent<string>(socket, 'id');
  socket.emit('whoami');
  const clientId = await idPromise;
  expect(clientId).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(clientId).not.toBe(socket.id);
  socket.close();
});

test('Socket.IO 点对点：room(对方 id) 可推送', async () => {
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

  const port = await start({
    channels: [channel],
    transport: new SocketIoTransport(),
  });

  const a = await connect(port);
  const b = await connect(port);
  const idBPromise = onceEvent<string>(b, 'id');
  a.emit('whoami');
  b.emit('whoami');
  const bId = await idBPromise;

  const got = onceEvent(b, 'dm');
  a.emit('dm', { to: bId, text: 'hi' });
  await expect(got).resolves.toEqual({ text: 'hi' });
});

test('Socket.IO 适配器支持服务端断开', async () => {
  const channel = new Channel();
  channel.on('kick', {
    action: async (ctx) => {
      await ctx.client.close();
    },
  });

  const port = await start({
    channels: [channel],
    transport: new SocketIoTransport(),
  });

  const socket = await connect(port);
  const disconnected = onceEvent(socket, 'disconnect');
  socket.emit('kick');
  await disconnected;
});

test('超长事件名会断开且不进入处理链', async () => {
  const seen: string[] = [];
  const port = await start({
    transport: new SocketIoTransport(),
    mount: [
      middleware.socket(async (ctx, next) => {
        seen.push(ctx.event);
        await next?.();
      }),
    ],
  });
  const socket = await connect(port);
  const ok = 'e'.repeat(128);
  socket.emit(ok, { n: 1 });
  await vi.waitFor(() => {
    expect(seen).toEqual([ok]);
  });

  const disconnected = onceEvent(socket, 'disconnect');
  socket.emit('e'.repeat(129), { n: 2 });
  await disconnected;
  await new Promise((resolve) => setTimeout(resolve, 30));
  expect(seen).toEqual([ok]);
});

test('registerLifecycle：关停时自动 close Socket.IO Server', async () => {
  const transport = new SocketIoTransport();
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  await start({ channels: [channel], transport });
  await vi.waitFor(() => {
    expect(transport['io']).toBeTruthy();
  });
  await internalDestroyServices([]);
  expect(transport['io']).toBeUndefined();
});

test('transport.shutdown：关掉 Socket.IO', async () => {
  const transport = new SocketIoTransport();
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  await start({ channels: [channel], transport });
  await vi.waitFor(() => {
    expect(transport['io']).toBeTruthy();
  });
  await transport.shutdown();
  expect(transport['io']).toBeUndefined();
  expect(transport['destroying']).toBe(true);
  await internalDestroyServices([]);
});
