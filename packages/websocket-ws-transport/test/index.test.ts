import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import type http from 'node:http';
import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { afterEach, expect, test, vi } from 'vitest';
import type { Logger } from '@aomex/logger';
import { internalDestroyServices } from '@aomex/common';
import { TestWebApp } from '../../web/src/testing';
import {
  Channel,
  WebsocketTransportAdapter,
  channels,
  type WebsocketAppOptions,
} from '@aomex/websocket';
import { TestWebsocketApp } from '../../websocket/src/testing';
import { i18n } from '../../websocket/src/i18n';
import { WsTransport } from '../src';

let server: http.Server | undefined;

afterEach(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => (err ? reject(err) : resolve()));
    });
    server = undefined;
  }
  // 等 server 'close' 触发的 destroy 跑完，避免和下一个用例的 lifecycle 登记竞态
  await internalDestroyServices([]);
  vi.useRealTimers();
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
  const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await once(ws, 'open');
  return ws;
};

const send = (ws: WebSocket, event: string, data?: unknown) => {
  ws.send(JSON.stringify({ event, data }));
};

const recv = async (ws: WebSocket) => {
  const [raw] = await once(ws, 'message');
  const data = raw instanceof MessageEvent ? raw.data : raw;
  const text =
    typeof data === 'string'
      ? data
      : Buffer.isBuffer(data)
        ? data.toString('utf8')
        : new TextDecoder().decode(data as ArrayBuffer);
  return JSON.parse(text) as { event: string; data: unknown };
};

class ProbeAdapter extends WsTransport {
  parse(raw: string | Buffer | Buffer[] | ArrayBuffer) {
    return this['parseFrame'](raw as never);
  }

  transport(
    socket: Parameters<WsTransport['createTransport']>[0],
    request: Parameters<WsTransport['createTransport']>[1],
  ) {
    return this['createTransport'](socket, request, 'zh-CN');
  }
}

class EnsureProbe extends WebsocketTransportAdapter {
  onInit(): void {}
  listen(): void {}
  onDestroy(): void {}
  ensure(req: IncomingMessage, app: TestWebApp) {
    return this['ensureRequest'](req, app);
  }
}

test('parseFrame 接受 string / Buffer / Buffer[] / ArrayBuffer', () => {
  const adapter = new ProbeAdapter();
  const frame = { event: 'ping', data: 1 };
  const json = JSON.stringify(frame);
  expect(adapter.parse(json)).toEqual(frame);
  expect(adapter.parse(Buffer.from(json))).toEqual(frame);
  expect(adapter.parse([Buffer.from('{'), Buffer.from(json.slice(1))])).toEqual(frame);
  expect(adapter.parse(Uint8Array.from(Buffer.from(json)).buffer)).toEqual(frame);
});

test('parseFrame 拒绝非法帧', () => {
  const adapter = new ProbeAdapter();
  expect(adapter.parse('not-json')).toBeNull();
  expect(adapter.parse(JSON.stringify([]))).toBeNull();
  expect(adapter.parse(JSON.stringify(null))).toBeNull();
  expect(adapter.parse(JSON.stringify({ event: '' }))).toBeNull();
  expect(adapter.parse(JSON.stringify({ event: 'a\0b' }))).toBeNull();
  expect(adapter.parse(JSON.stringify({ event: 'x'.repeat(200) }))).toBeNull();
});

test('WsTransport + 自定义 maxPayload / perMessageDeflate 可连', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const port = await start({
    channels: [channel],
    maxPayload: 64 * 1024,
    transport: new WsTransport({
      heartbeatInterval: 0,
      perMessageDeflate: false,
    }),
  });
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});

test('心跳超时会 terminate 半开连接', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  const port = await start({
    channels: [channel],
    transport: new WsTransport({ heartbeatInterval: 30 }),
  });

  const { WebSocket: WsClient } = await import('ws');
  const ws = new WsClient(`ws://127.0.0.1:${port}/ws`);
  await once(ws, 'open');
  ws.removeAllListeners('ping');
  ws.on('ping', () => {});

  const closed = once(ws, 'close');
  await vi.advanceTimersByTimeAsync(100);
  await closed;
});

test('createTransport 在非 OPEN 时 send 为空操作，并可 terminate', async () => {
  const adapter = new ProbeAdapter();
  const { WebSocketServer } = await import('ws');
  const wss = new WebSocketServer({ port: 0 });
  const { port } = wss.address() as { port: number };
  const { WebSocket: WsClient } = await import('ws');

  const serverSocket = await new Promise<import('ws').WebSocket>((resolve) => {
    wss.on('connection', (socket) => resolve(socket));
    void new WsClient(`ws://127.0.0.1:${port}`);
  });

  const app = new TestWebApp();
  const req = new IncomingMessage(new Socket());
  const request = new EnsureProbe().ensure(req, app);
  const transport = adapter.transport(
    serverSocket as Parameters<ProbeAdapter['transport']>[0],
    request,
  );

  serverSocket.close();
  await once(serverSocket, 'close');
  expect(() => transport.send('x', 1)).not.toThrow();

  const again = await new Promise<import('ws').WebSocket>((resolve) => {
    wss.once('connection', (socket) => resolve(socket));
    void new WsClient(`ws://127.0.0.1:${port}`);
  });
  const t2 = adapter.transport(
    again as Parameters<ProbeAdapter['transport']>[0],
    request,
  );
  t2.terminate?.();
  await once(again, 'close');
  await new Promise<void>((resolve, reject) => {
    wss.close((err) => (err ? reject(err) : resolve()));
  });
});

test('close reason 截在多字节字符前，不超过 123 字节', async () => {
  const intact = `${'a'.repeat(120)}中`;
  const split = `${'a'.repeat(122)}中`;
  expect(Buffer.byteLength(intact)).toBe(123);
  expect(Buffer.byteLength(split)).toBe(125);

  const channel = new Channel();
  channel.on('kick', {
    action: async (ctx) => {
      const reason = typeof ctx.rawPayload === 'string' ? ctx.rawPayload : '';
      await ctx.client.close(4000, reason);
    },
  });
  const port = await start({
    channels: [channel],
    transport: new WsTransport({ heartbeatInterval: 0 }),
  });

  const expectReason = async (reason: string, expected: string) => {
    const ws = await connect(port);
    send(ws, 'kick', reason);
    const [event] = (await once(ws, 'close')) as [CloseEvent];
    expect(event.code).toBe(4000);
    expect(event.reason).toBe(expected);
    expect(Buffer.byteLength(event.reason)).toBeLessThanOrEqual(123);
    expect(event.reason.includes('\uFFFD')).toBe(false);
  };

  await expectReason(intact, intact);
  await expectReason(split, 'a'.repeat(122));
  await expectReason(`${'a'.repeat(121)}😀`, 'a'.repeat(121));
});

test('close reason 超长会被截断', async () => {
  const channel = new Channel();
  channel.on('kick', {
    action: async (ctx) => {
      await ctx.client.close(4000, 'x'.repeat(200));
    },
  });
  const port = await start({
    channels: [channel],
    transport: new WsTransport({ heartbeatInterval: 0 }),
  });
  const ws = await connect(port);
  send(ws, 'kick');
  await once(ws, 'close');
});

test('二进制帧被忽略；心跳 pong 维持连接', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const port = await start({
    channels: [channel],
    transport: new WsTransport({ heartbeatInterval: 40 }),
  });
  const { WebSocket: WsClient } = await import('ws');
  const ws = new WsClient(`ws://127.0.0.1:${port}/ws`);
  await once(ws, 'open');
  ws.send(Buffer.from([1, 2, 3]), { binary: true });
  await new Promise((r) => setTimeout(r, 100));
  ws.send(JSON.stringify({ event: 'ping' }));
  const [raw] = await once(ws, 'message');
  const text = Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw);
  expect(JSON.parse(text)).toMatchObject({ event: 'pong' });
  ws.close();
});

test('非法 heartbeatInterval 回退默认仍可连', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const port = await start({
    channels: [channel],
    transport: new WsTransport({ heartbeatInterval: Number.NaN }),
  });
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  ws.close();
});

test('registerLifecycle：关停时自动 close WebSocketServer', async () => {
  const transport = new WsTransport({ heartbeatInterval: 0 });
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  await start({ channels: [channel], transport });
  await vi.waitFor(() => {
    expect(transport['wss']).toBeTruthy();
  });
  await internalDestroyServices([]);
  expect(transport['wss']).toBeUndefined();
});

test('transport.shutdown：关掉 WebSocketServer', async () => {
  const transport = new WsTransport({ heartbeatInterval: 0 });
  const channel = new Channel();
  channel.on('ping', { action: async () => {} });
  await start({ channels: [channel], transport });
  await vi.waitFor(() => {
    expect(transport['wss']).toBeTruthy();
  });
  await transport.shutdown();
  expect(transport['wss']).toBeUndefined();
  expect(transport['destroying']).toBe(true);
  await internalDestroyServices([]);
});

test('传输初始化失败由 attach 记一条，握手不再重复', async () => {
  class BoomTransport extends WsTransport {
    override onInit(): Promise<void> {
      return Promise.reject(new Error('init-down'));
    }
  }

  const messages: string[] = [];
  const logger = {
    error(_err: unknown, message?: string) {
      messages.push(message ?? '');
    },
    warn() {},
  } as unknown as Logger;
  const transport = new BoomTransport();
  const app = new TestWebApp({ logger });
  const httpServer = app.http({});
  new TestWebsocketApp({ logger, transport, mount: [channels([])] }).attach(
    app,
    httpServer,
  );
  await new Promise((resolve) => setImmediate(resolve));

  await expect(
    transport['beforeHandshake'](
      { app, path: '/ws', maxPayload: 1024, onConnection() {} },
      new IncomingMessage(new Socket()),
    ),
  ).resolves.toEqual({ statusCode: 503, message: 'Service Unavailable' });
  expect(messages).toEqual([i18n.t('transport_init_failed', undefined, 'zh-CN')]);
  await transport['failHandshake'](
    { app, path: '/ws', maxPayload: 1024, onConnection() {} },
    new IncomingMessage(new Socket()),
    new Error('verify-down'),
  );
  expect(messages).toEqual([
    i18n.t('transport_init_failed', undefined, 'zh-CN'),
    i18n.t('handshake_failed', undefined, 'zh-CN'),
  ]);
});

test('attach 把传输初始化失败交给日志且不产生未处理 rejection', async () => {
  class BoomTransport extends WsTransport {
    override onInit(): Promise<void> {
      return Promise.reject(new Error('init-down'));
    }
  }

  const messages: string[] = [];
  const logger = {
    error(_err: unknown, message?: string) {
      messages.push(message ?? '');
    },
    warn() {},
  } as unknown as Logger;
  const transport = new BoomTransport();
  const app = new TestWebApp({ logger });
  const httpServer = app.http({});
  const rejections: unknown[] = [];
  const onRejection = (err: unknown) => {
    rejections.push(err);
  };
  process.on('unhandledRejection', onRejection);
  try {
    new TestWebsocketApp({ logger, transport, mount: [channels([])] }).attach(
      app,
      httpServer,
    );
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => resolve());
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(messages).toEqual([i18n.t('transport_init_failed', undefined, 'zh-CN')]);
    expect(rejections).toEqual([]);
  } finally {
    process.off('unhandledRejection', onRejection);
    if (httpServer.listening) {
      await new Promise<void>((resolve, reject) => {
        httpServer.close((err) => (err ? reject(err) : resolve()));
      });
    }
    await internalDestroyServices([]);
  }
});
