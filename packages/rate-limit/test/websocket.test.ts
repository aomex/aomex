import type http from 'node:http';
import { afterEach, expect, test, vitest } from 'vitest';
import supertest from 'supertest';
import { internalDestroyServices } from '@aomex/common';
import { Channel, type WebsocketContext } from '@aomex/websocket';
import { TestWebApp } from '../../web/src/testing';
import {
  closeServer,
  connect,
  listenWebsocket,
  recv,
  send,
} from '../../websocket/test/fixture/ws-helpers';
import { rateLimit as httpRateLimit } from '../src/rate-limit';
import { i18n } from '../src/i18n';
import { RateLimitMemoryStore } from '../src/memory-store';
import { RateLimitStore, type RateLimitState } from '../src/store';
import { websocketRateLimit, type WebsocketRateLimitOptions } from '../src/websocket';

const slot: { server?: http.Server } = {};

afterEach(async () => {
  await closeServer(slot);
  await internalDestroyServices([]);
});

const fakeCtx = (options: { id?: string; ip?: string } = {}) => {
  const sent: Array<{ event: string; data: unknown }> = [];
  const ctx = {
    event: 'ping',
    client: {
      id: options.id ?? 'c1',
      request: { ip: options.ip ?? '203.0.113.1' },
      send: async (event: string, data?: unknown) => {
        sent.push({ event, data });
      },
    },
  } as unknown as WebsocketContext;
  return { ctx, sent };
};

const run = async (options: WebsocketRateLimitOptions, ctx: WebsocketContext) => {
  let called = false;
  await websocketRateLimit(options)['fn'](ctx, async () => {
    called = true;
  });
  return called;
};

test('窗口内放行，超限回推 error 且不进入后续中间件', async () => {
  const store = new RateLimitMemoryStore();
  const { ctx, sent } = fakeCtx();
  const options = { store, limit: 1, window: 60_000 };

  await expect(run(options, ctx)).resolves.toBe(true);
  expect(sent).toEqual([]);

  await expect(run(options, ctx)).resolves.toBe(false);
  expect(sent).toEqual([
    { event: 'error', data: { message: i18n.t('too_many_requests') } },
  ]);
});

test('不同 IP 各自计数；同一 IP 的不同连接共享配额', async () => {
  const store = new RateLimitMemoryStore();
  const options = { store, limit: 1, window: 60_000 };
  const a = fakeCtx({ id: 'a', ip: '203.0.113.1' });
  const b = fakeCtx({ id: 'b', ip: '203.0.113.2' });
  const sameIp = fakeCtx({ id: 'c', ip: '203.0.113.1' });

  await expect(run(options, a.ctx)).resolves.toBe(true);
  await expect(run(options, b.ctx)).resolves.toBe(true);
  await expect(run(options, sameIp.ctx)).resolves.toBe(false);
});

test('id 返回 false 或命中白名单时不计数', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const { ctx } = fakeCtx();

  await expect(run({ store, limit: 1, id: () => false }, ctx)).resolves.toBe(true);
  await expect(run({ store, limit: 1, allowList: async () => true }, ctx)).resolves.toBe(
    true,
  );
  expect(spy).not.toHaveBeenCalled();
});

test('黑名单优先于白名单，回推拒绝且不计数', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const { ctx, sent } = fakeCtx();

  await expect(
    run(
      {
        store,
        denyList: async () => true,
        allowList: () => true,
      },
      ctx,
    ),
  ).resolves.toBe(false);
  expect(spy).not.toHaveBeenCalled();
  expect(sent).toEqual([{ event: 'error', data: { message: i18n.t('denied') } }]);
});

test('可定制超限文案；空字符串沿用默认文案', async () => {
  const deny = async (errorMessage: string) => {
    const { ctx, sent } = fakeCtx();
    const store = new RateLimitMemoryStore();
    await run({ store, limit: 1, errorMessage }, ctx);
    sent.length = 0;
    await run({ store, limit: 1, errorMessage }, ctx);
    return sent;
  };

  await expect(deny('稍后再试')).resolves.toEqual([
    { event: 'error', data: { message: '稍后再试' } },
  ]);
  await expect(deny('')).resolves.toEqual([
    { event: 'error', data: { message: i18n.t('too_many_requests') } },
  ]);
});

test('可读时长会先折成毫秒；非法时长在创建时抛错', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const { ctx } = fakeCtx();
  await run({ store, window: '10s' }, ctx);
  expect(spy).toHaveBeenCalledWith({
    window: 10_000,
    limit: 2500,
    key: 'aomex-rate-limit:ws:203.0.113.1',
  });

  expect(() => websocketRateLimit({ window: -1 })).toThrow(RangeError);
  expect(() => websocketRateLimit({ window: Number.NaN })).toThrow(RangeError);
  expect(() =>
    websocketRateLimit({
      // @ts-expect-error 无单位字符串不是 DurationInput，运行时仍拒绝
      window: 'soon',
    }),
  ).toThrow(TypeError);
});

test('默认身份、窗口和键前缀', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const { ctx } = fakeCtx({ ip: '198.51.100.10' });
  await run({ store }, ctx);
  expect(spy).toHaveBeenCalledWith({
    window: 3_600_000,
    limit: 2500,
    key: 'aomex-rate-limit:ws:198.51.100.10',
  });
});

test('存储抛错会冒泡；回推失败也会冒泡', async () => {
  class BoomStore extends RateLimitStore {
    override async getAndSet(): Promise<RateLimitState> {
      throw new Error('store-down');
    }
  }
  const { ctx } = fakeCtx();
  await expect(run({ store: new BoomStore(), limit: 1 }, ctx)).rejects.toThrow(
    'store-down',
  );

  const limited = fakeCtx();
  limited.ctx.client.send = async () => {
    throw new Error('gone');
  };
  const store = new RateLimitMemoryStore();
  await run({ store, limit: 1 }, limited.ctx);
  await expect(run({ store, limit: 1 }, limited.ctx)).rejects.toThrow('gone');
});

test('websocketRateLimit 首次处理消息时才登记 store 生命周期', async () => {
  const order: string[] = [];
  class TrackingStore extends RateLimitStore {
    override async onInit() {
      order.push('init');
    }
    override async onDestroy() {
      order.push('destroy');
    }
    override async getAndSet(): Promise<RateLimitState> {
      return { key: 'k', remaining: 1, resetAt: 0 };
    }
  }

  const { ctx } = fakeCtx();
  const mdw = websocketRateLimit({ store: new TrackingStore() });
  expect(order).toEqual([]);
  await mdw['fn'](ctx, async () => {});
  expect(order).toEqual(['init']);
  await mdw['fn'](ctx, async () => {});
  expect(order).toEqual(['init']);
  await internalDestroyServices([]);
  expect(order).toEqual(['init', 'destroy']);
});

test('真实连接超限后仍保持打开', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [websocketRateLimit({ limit: 1, window: 60_000 })],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toEqual({
    event: 'error',
    data: { message: i18n.t('too_many_requests') },
  });
  expect(ws.readyState).toBe(WebSocket.OPEN);
  ws.close();
});

test('与 HTTP rateLimit 共用 store 时键前缀隔离、配额不混用', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const identity = 'user-1';

  const httpApp = new TestWebApp({
    mount: [
      httpRateLimit({
        store,
        limit: 1,
        window: 60_000,
        id: () => identity,
      }),
    ],
  });
  await supertest(httpApp.listen()).get('/').expect(404);
  await supertest(httpApp.listen()).get('/').expect(429);

  const { ctx, sent } = fakeCtx();
  await expect(
    run(
      {
        store,
        limit: 1,
        window: 60_000,
        id: () => identity,
      },
      ctx,
    ),
  ).resolves.toBe(true);
  expect(sent).toEqual([]);

  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ key: `aomex-rate-limit:${identity}` }),
  );
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ key: `aomex-rate-limit:ws:${identity}` }),
  );
});

test('超限与拒绝文案跟随 WebsocketApp 的 language', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port: limitedPort } = await listenWebsocket(
    new TestWebApp(),
    {
      language: { mode: 'fixed', language: 'en-US' },
      mount: [websocketRateLimit({ limit: 1, window: 60_000 })],
      channels: [channel],
    },
    slot,
  );
  const limited = await connect(limitedPort);
  send(limited, 'ping');
  await expect(recv(limited)).resolves.toMatchObject({ event: 'pong' });
  send(limited, 'ping');
  await expect(recv(limited)).resolves.toEqual({
    event: 'error',
    data: { message: 'Too many requests' },
  });
  limited.close();
  await closeServer(slot);

  const { port: deniedPort } = await listenWebsocket(
    new TestWebApp(),
    {
      language: { mode: 'fixed', language: 'en-US' },
      mount: [websocketRateLimit({ denyList: () => true })],
      channels: [channel],
    },
    slot,
  );
  const denied = await connect(deniedPort);
  send(denied, 'ping');
  await expect(recv(denied)).resolves.toEqual({
    event: 'error',
    data: { message: 'Denied' },
  });
  expect(denied.readyState).toBe(WebSocket.OPEN);
  denied.close();
});
