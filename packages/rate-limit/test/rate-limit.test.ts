import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import { expect, test, vitest } from 'vitest';
import { rateLimit } from '../src/rate-limit';
import supertest from 'supertest';
import { RateLimitMemoryStore } from '../src/memory-store';
import { sleep } from '@aomex/internal-tools';

test('设置黑名单', async () => {
  const app = new WebApp({
    mount: [
      rateLimit({
        denyList: () => true,
      }),
    ],
  });

  await supertest(app.listen()).get('/').expect(403);
});

test('设置白名单', async () => {
  const app = new WebApp({
    mount: [
      rateLimit({
        maxRequest: 1,
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
  const app = new WebApp({
    mount: [
      rateLimit({
        maxRequest: 1,
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

test('默认id为客户端IP', async () => {
  const store = new RateLimitMemoryStore();
  const spy = vitest.spyOn(store, 'getAndSet');
  const app = new WebApp({
    mount: [rateLimit({ store })],
  });
  await supertest(app.listen()).get('/');
  expect(spy).toBeCalledWith({
    duration: 3600000,
    key: 'aomex-rate-limit:::ffff:127.0.0.1',
    maxRequest: 2500,
  });
});

test('携带额外报头', async () => {
  const app = new WebApp({
    mount: [rateLimit({ maxRequest: 20 })],
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
  const app = new WebApp({
    mount: [rateLimit({ maxRequest: 2 })],
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
  const app = new WebApp({
    mount: [rateLimit({ maxRequest: 1, duration: 3600_000 })],
  });
  await supertest(app.listen()).get('/');
  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.headers['retry-after']).toMatch(/^3\d{3}$/);
    });
});

test('可以取消headers', async () => {
  const app = new WebApp({
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
  const app = new WebApp({
    mount: [rateLimit({ duration: 1500, maxRequest: 2 })],
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
  const app = new WebApp({
    mount: [rateLimit({ errorMessage: 'Wait a minute', maxRequest: 1 })],
  });
  await supertest(app.listen()).get('/').expect(404);
  await supertest(app.listen()).get('/').expect(429, 'Wait a minute');
});
