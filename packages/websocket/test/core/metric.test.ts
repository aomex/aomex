import { afterEach, expect, test } from 'vitest';
import type http from 'node:http';
import { Channel, type WebsocketMetricEvent } from '../../src';
import { TestWebApp } from '../../../web/src/testing';
import { closeServer, connect, listenWebsocket, recv, send } from '../fixture/ws-helpers';

const slot: { server?: http.Server } = {};

afterEach(async () => {
  await closeServer(slot);
});

const waitFor = async (predicate: () => boolean, timeout = 3_000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (predicate()) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error('wait timeout');
};

test('onMetric：连接上下线上报 online', async () => {
  const events: WebsocketMetricEvent[] = [];
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      onMetric: (e) => {
        events.push(e);
      },
    },
    slot,
  );

  const ws = await connect(port);
  await waitFor(() => events.some((e) => e.type === 'online' && e.online === 1));
  expect(events.filter((e) => e.type === 'online').at(-1)).toEqual({
    type: 'online',
    online: 1,
  });

  ws.close();
  await waitFor(() => events.some((e) => e.type === 'online' && e.online === 0));
});

test('onMetric：房间广播上报 fanout', async () => {
  const events: WebsocketMetricEvent[] = [];
  const channel = new Channel();
  channel.on('join', {
    action: async (ctx) => {
      await ctx.client.join('lobby');
    },
  });
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.room('lobby').send('pong', { ok: true });
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      onMetric: (e) => {
        events.push(e);
      },
    },
    slot,
  );

  const ws = await connect(port);
  send(ws, 'join');
  await new Promise((r) => setTimeout(r, 30));
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });

  const fanout = events.find(
    (e) => e.type === 'fanout' && e.scope === 'room' && e.room === 'lobby',
  );
  expect(fanout).toMatchObject({
    type: 'fanout',
    scope: 'room',
    room: 'lobby',
    targets: 1,
    failed: 0,
  });
  expect(
    fanout && fanout.type === 'fanout' ? fanout.durationMs : -1,
  ).toBeGreaterThanOrEqual(0);
  ws.close();
});

test('stats：连接与进房后快照正确', async () => {
  const channel = new Channel();
  channel.on('join', {
    action: async (ctx) => {
      await ctx.client.join('lobby');
      ctx.client.send('joined');
    },
  });
  const { port, ws } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel] },
    slot,
  );

  expect(await ws.stats()).toEqual({
    online: 0,
    rooms: 0,
    subscribedRooms: 0,
  });

  const waitStats = async (
    predicate: (s: Awaited<ReturnType<typeof ws.stats>>) => boolean,
  ) => {
    const start = Date.now();
    while (Date.now() - start < 3_000) {
      const s = await ws.stats();
      if (predicate(s)) return s;
      await new Promise((r) => setTimeout(r, 20));
    }
    throw new Error('wait stats timeout');
  };

  const a = await connect(port);
  // 接入后自动 join(client.id)，故 rooms 至少为 1
  expect(await waitStats((s) => s.online === 1)).toMatchObject({
    online: 1,
    rooms: 1,
    subscribedRooms: 0,
  });
  send(a, 'join');
  await expect(recv(a)).resolves.toMatchObject({ event: 'joined' });
  // client.id 房间 + lobby
  expect(await waitStats((s) => s.rooms === 2)).toMatchObject({
    online: 1,
    rooms: 2,
    subscribedRooms: 0,
  });

  const b = await connect(port);
  await waitStats((s) => s.online === 2);
  a.close();
  b.close();
  await waitStats((s) => s.online === 0 && s.rooms === 0);
});

test('onMetric：broadcastAll 上报 fanout scope=all', async () => {
  const events: WebsocketMetricEvent[] = [];
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.all.send('notice', { ok: true });
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      onMetric: (e) => {
        events.push(e);
      },
    },
    slot,
  );

  const a = await connect(port);
  const b = await connect(port);
  await waitFor(() => events.filter((e) => e.type === 'online').length >= 2);
  send(a, 'ping');
  await waitFor(() =>
    events.some((e) => e.type === 'fanout' && e.scope === 'all' && e.targets === 2),
  );
  const fanout = events.find((e) => e.type === 'fanout' && e.scope === 'all');
  expect(fanout).toMatchObject({
    type: 'fanout',
    scope: 'all',
    targets: 2,
    failed: 0,
  });
  a.close();
  b.close();
});

test('onMetric：入站上报成败与耗时', async () => {
  const events: WebsocketMetricEvent[] = [];
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  channel.on('boom', {
    action: async () => {
      throw new Error('explode');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      onMetric: (e) => {
        events.push(e);
      },
    },
    slot,
  );

  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  const ok = events.find((e) => e.type === 'inbound' && e.ok);
  expect(ok).toMatchObject({ type: 'inbound', ok: true });
  expect(ok && ok.type === 'inbound' ? ok.durationMs : -1).toBeGreaterThanOrEqual(0);

  send(ws, 'boom');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'error' });
  const failed = events.find((e) => e.type === 'inbound' && !e.ok);
  expect(failed).toMatchObject({ type: 'inbound', ok: false });
  expect(
    failed && failed.type === 'inbound' ? failed.durationMs : -1,
  ).toBeGreaterThanOrEqual(0);
  ws.close();
});

test('onMetric 抛错不影响收发', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      onMetric: () => {
        throw new Error('metric-boom');
      },
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});
