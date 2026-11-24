import type http from 'node:http';
import { afterEach, expect, test, vi } from 'vitest';
import * as common from '@aomex/common';
import { rule } from '@aomex/common';
import { TestWebApp } from '../../../web/src/testing';
import { Channel, payload } from '../../src';
import { closeServer, connect, recv, send, listenWebsocket } from '../fixture/ws-helpers';

const slot: { server?: http.Server } = {};

afterEach(async () => {
  await closeServer(slot);
  vi.restoreAllMocks();
});

test('payload 校验成功写入 ctx.payload（字段表字面量）', async () => {
  const channel = new Channel();
  channel.on('chat.send', {
    mount: [payload({ text: rule.string() })],
    action: async (ctx) => {
      ctx.client.send('chat.message', ctx.payload);
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'chat.send', { text: 'hi' });
  await expect(recv(ws)).resolves.toEqual({
    event: 'chat.message',
    data: { text: 'hi' },
  });
  ws.close();
});

test('payload 校验失败回推 error', async () => {
  const channel = new Channel();
  channel.on('chat.send', {
    mount: [payload({ text: rule.string() })],
    action: async (ctx) => {
      ctx.client.send('ok', ctx.payload);
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'chat.send', { text: 1 });
  const msg = await recv(ws);
  expect(msg.event).toBe('error');
  expect(msg.data).toMatchObject({ message: expect.any(String) });
  ws.close();
});

test('payload 接受 rule.object', async () => {
  const channel = new Channel();
  channel.on('obj', {
    mount: [payload(rule.object({ id: rule.number() }))],
    action: async (ctx) => {
      ctx.client.send('ok', ctx.payload);
    },
  });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'obj', { id: 7 });
  await expect(recv(ws)).resolves.toEqual({ event: 'ok', data: { id: 7 } });
  ws.close();
});

test('payload 接受 string / number / boolean / array', async () => {
  const channel = new Channel();
  channel.on('str', {
    mount: [payload(rule.string())],
    action: async (ctx) => {
      ctx.client.send('str', ctx.payload);
    },
  });
  channel.on('num', {
    mount: [payload(rule.number())],
    action: async (ctx) => {
      ctx.client.send('num', ctx.payload);
    },
  });
  channel.on('bool', {
    mount: [payload(rule.boolean())],
    action: async (ctx) => {
      ctx.client.send('bool', ctx.payload);
    },
  });
  channel.on('arr', {
    mount: [payload(rule.array(rule.number()))],
    action: async (ctx) => {
      ctx.client.send('arr', ctx.payload);
    },
  });

  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);

  send(ws, 'str', 'hi');
  await expect(recv(ws)).resolves.toEqual({ event: 'str', data: 'hi' });
  send(ws, 'num', 3);
  await expect(recv(ws)).resolves.toEqual({ event: 'num', data: 3 });
  send(ws, 'bool', true);
  await expect(recv(ws)).resolves.toEqual({ event: 'bool', data: true });
  send(ws, 'arr', [1, 2]);
  await expect(recv(ws)).resolves.toEqual({ event: 'arr', data: [1, 2] });
  ws.close();
});

test('payload 非 Error 拒绝时仍回推 message', async () => {
  vi.spyOn(common, 'validate').mockRejectedValueOnce('not-an-error');

  const channel = new Channel();
  channel.on('x', {
    mount: [payload(rule.string())],
    action: async (ctx) => {
      ctx.client.send('ok', ctx.payload);
    },
  });
  const { port } = await listenWebsocket(new TestWebApp(), { channels: [channel] }, slot);
  const ws = await connect(port);
  send(ws, 'x', 'hi');
  const msg = await recv(ws);
  expect(msg.event).toBe('error');
  expect(msg.data).toEqual({ message: 'not-an-error' });
  ws.close();
});
