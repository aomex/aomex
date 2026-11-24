import type http from 'node:http';
import { afterEach, expect, test } from 'vitest';
import { middleware, rule } from '@aomex/common';
import { TestWebApp } from '../../../web/src/testing';
import { Channel, payload } from '../../src';
import { closeServer, connect, recv, send, listenWebsocket } from '../fixture/ws-helpers';

const slot: { server?: http.Server } = {};

afterEach(async () => {
  await closeServer(slot);
});

test('同 Channel 重复事件名抛错', () => {
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  expect(() => channel.on('ping', { action: async () => {} })).toThrow();
});

test('非法事件名注册抛错', () => {
  const channel = new Channel();
  expect(() => channel.on('', { action: async () => {} })).toThrow();
  expect(() => channel.on('a\0b', { action: async () => {} })).toThrow();
});

test('disabled 事件不注册', async () => {
  const channel = new Channel();
  channel.on('ping', {
    disabled: true,
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  channel.on('ok', {
    action: async (ctx) => {
      ctx.client.send('ok');
    },
  });

  const { port } = await listenWebsocket(
    new TestWebApp(),
    { channels: [channel], unknownEvent: 'error' },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'ping');
  const msg = await recv(ws);
  expect(msg.event).toBe('error');
  ws.close();
});

test('Channel 级 mount 先于事件级执行', async () => {
  const order: string[] = [];
  const channel = new Channel({
    mount: [
      middleware.socket(async (_ctx, next) => {
        order.push('channel');
        return next();
      }),
    ],
  });
  channel.on('x', {
    mount: [
      middleware.socket(async (_ctx, next) => {
        order.push('event');
        return next();
      }),
    ],
    action: async (ctx) => {
      order.push('action');
      ctx.client.send('done');
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'x');
  await recv(ws);
  expect(order).toEqual(['channel', 'event', 'action']);
  ws.close();
});

test('App 级 mount 先于 Channel 与事件级', async () => {
  const order: string[] = [];
  const channel = new Channel({
    mount: [
      middleware.socket(async (_ctx, next) => {
        order.push('channel');
        return next();
      }),
    ],
  });
  channel.on('x', {
    mount: [
      middleware.socket(async (_ctx, next) => {
        order.push('event');
        return next();
      }),
    ],
    action: async (ctx) => {
      order.push('action');
      ctx.client.send('done');
    },
  });

  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      channels: [channel],
      mount: [
        middleware.socket(async (_ctx, next) => {
          order.push('app');
          return next();
        }),
      ],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'x');
  await recv(ws);
  expect(order).toEqual(['app', 'channel', 'event', 'action']);
  ws.close();
});

test('Channel 级 payload 写入 ctx.payload', async () => {
  const channel = new Channel({
    mount: [payload({ token: rule.string() })],
  });
  channel.on('x', {
    action: async (ctx) => {
      ctx.client.send('ok', ctx.payload);
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'x', { token: 'abc' });
  await expect(recv(ws)).resolves.toEqual({
    event: 'ok',
    data: { token: 'abc' },
  });
  ws.close();
});

test('ctx.send 等同 ctx.client.send', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      await ctx.send('pong', ctx.rawPayload);
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'ping', { n: 1 });
  await expect(recv(ws)).resolves.toEqual({
    event: 'pong',
    data: { n: 1 },
  });
  ws.close();
});
