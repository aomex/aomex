import { TestWebApp } from '../../web/src/testing';
import { internalDestroyServices, middleware } from '@aomex/common';
import { afterEach, expect, test, vitest } from 'vitest';
import { rateLimit } from '../src/rate-limit';
import supertest from 'supertest';
import { RateLimitMemoryStore } from '@aomex/rate-limit/memory';
import { RateLimitStore } from '../src/store';
import sleep from 'sleep-promise';

afterEach(async () => {
  await internalDestroyServices([]);
});

test('设置黑名单', async () => {
  const app = new TestWebApp({
    mount: [
      rateLimit({
        denyList: () => true,
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect(403);
});

test('设置白名单', async () => {
  const app = new TestWebApp({
    mount: [
      rateLimit({
        limit: 1,
        allowList: () => true,
      }),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await Promise.all([
    supertest(app.listen()).get('/').expect(200),
    supertest(app.listen()).get('/').expect(200),
    supertest(app.listen()).get('/').expect(200),
    supertest(app.listen()).get('/').expect(200),
  ]);
});

test('无法识别ID视为白名单', async () => {
  const app = new TestWebApp({
    mount: [
      rateLimit({
        limit: 1,
        id: () => false,
      }),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await Promise.all([
    supertest(app.listen()).get('/').expect(200),
    supertest(app.listen()).get('/').expect(200),
    supertest(app.listen()).get('/').expect(200),
    supertest(app.listen()).get('/').expect(200),
  ]);
});

test('可读时长先折成毫秒；非法时长在创建时抛错', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const app = new TestWebApp({
    mount: [rateLimit({ store, window: '10s' })],
  });
  await supertest(app.listen()).get('/');
  expect(spy).toHaveBeenCalledWith({
    window: 10_000,
    key: 'aomex-rate-limit:::ffff:127.0.0.1',
    limit: 2500,
  });

  expect(() => rateLimit({ window: -1 })).toThrow(RangeError);
  expect(() => rateLimit({ window: Number.NaN })).toThrow(RangeError);
  expect(() =>
    rateLimit({
      // @ts-expect-error 无单位字符串不是 DurationInput，运行时仍拒绝
      window: 'soon',
    }),
  ).toThrow(TypeError);
});

test('默认id为客户端IP', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const app = new TestWebApp({
    mount: [rateLimit({ store })],
  });
  await supertest(app.listen()).get('/');
  expect(spy).toHaveBeenCalledWith({
    window: 3600000,
    key: 'aomex-rate-limit:::ffff:127.0.0.1',
    limit: 2500,
  });
});

test('携带额外报头', async () => {
  const app = new TestWebApp({
    mount: [rateLimit({ limit: 20 })],
  });
  await supertest(app.listen())
    .get('/')
    .expect('X-RateLimit-Remaining', '19')
    .expect('X-RateLimit-Limit', '20')
    .expect((res) => {
      expect(res.headers['x-ratelimit-reset']).toMatch(/^\d{10}$/);
    });
});

test('超过速率后抛出429状态码', async () => {
  const app = new TestWebApp({
    mount: [rateLimit({ limit: 2 })],
  });
  await supertest(app.listen()).get('/').expect(404).expect('x-ratelimit-remaining', '1');
  await supertest(app.listen()).get('/').expect(404).expect('x-ratelimit-remaining', '0');
  await supertest(app.listen())
    .get('/')
    .expect(429)
    .expect('x-ratelimit-remaining', '0')
    .expect((res) => {
      expect(res.headers).toHaveProperty('retry-after');
    });
});

test('retry-after格式为秒', async () => {
  const app = new TestWebApp({
    mount: [rateLimit({ limit: 1, window: 3600_000 })],
  });
  await supertest(app.listen()).get('/');
  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.headers['retry-after']).toMatch(/^3\d{3}$/);
    });
});

test('可以取消headers', async () => {
  const app = new TestWebApp({
    mount: [rateLimit({ headers: false })],
  });
  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('x-ratelimit-remaining');
      expect(res.headers).not.toHaveProperty('x-ratelimit-reset');
      expect(res.headers).not.toHaveProperty('x-ratelimit-limit');
    });
});

test('定制重置周期', async () => {
  const app = new TestWebApp({
    mount: [rateLimit({ window: 1500, limit: 2 })],
  });

  await supertest(app.listen()).get('/').expect(404);
  await supertest(app.listen()).get('/').expect(404);
  await supertest(app.listen()).get('/').expect(429);
  await supertest(app.listen()).get('/').expect(429);

  await sleep(1800);
  await supertest(app.listen()).get('/').expect(404);
  await supertest(app.listen()).get('/').expect(404);
  await supertest(app.listen()).get('/').expect(429);
});

test('定制报错信息', async () => {
  const app = new TestWebApp({
    mount: [rateLimit({ errorMessage: 'Wait a minute', limit: 1 })],
  });
  await supertest(app.listen()).get('/').expect(404);
  await supertest(app.listen()).get('/').expect(429, 'Wait a minute');
});

test('rateLimit 首次请求时才登记 store 生命周期', async () => {
  const order: string[] = [];
  class TrackingStore extends RateLimitStore {
    override async onInit() {
      order.push('init');
    }
    override async onDestroy() {
      order.push('destroy');
    }
    override async getAndSet() {
      return { key: 'k', remaining: 1, resetAt: 0 };
    }
  }

  const app = new TestWebApp({
    mount: [rateLimit({ store: new TrackingStore() })],
  });
  expect(order).toEqual([]);
  await supertest(app.listen()).get('/');
  expect(order).toEqual(['init']);
  await supertest(app.listen()).get('/');
  expect(order).toEqual(['init']);
  await internalDestroyServices([]);
  expect(order).toEqual(['init', 'destroy']);
});
