import RedisMemoryServer from 'redis-memory-server';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { RateLimitRedisStore } from '../src';
import { sleep } from '@aomex/internal-tools';
import { Redis } from 'ioredis';

let redisServer: RedisMemoryServer;
let store: RateLimitRedisStore;

beforeAll(async () => {
  redisServer = await RedisMemoryServer.create();
  await redisServer.ensureInstance();
  store = new RateLimitRedisStore({
    host: await redisServer.getHost(),
    port: await redisServer.getPort(),
  });
}, 50_000 /* 首次下载redis */);

afterEach(async () => {
  await store['redis'].flushall();
});

afterAll(async () => {
  store['redis'].disconnect();
  await redisServer.stop();
});

test('输出', async () => {
  const result = await store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 });
  expect(Object.keys(result)).toMatchInlineSnapshot(`
    [
      "key",
      "remaining",
      "resetAt",
    ]
  `);
});

test('根据ID寻找', async () => {
  await expect(
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
  await expect(
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 9);

  await expect(
    store.getAndSet({ key: 'bar', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
  await expect(
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 8);
});

test('并发', async () => {
  const result = await Promise.all([
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ]);

  expect(result.map((item) => item.remaining)).toStrictEqual([10, 9, 8, 7, 6]);
});

test('过期自动重置剩余次数', async () => {
  await expect(
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
  await expect(
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 9);

  await sleep(150);
  await expect(
    store.getAndSet({ key: 'foo', maxRequest: 10, duration: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
});

test('超过次数后，延长重置次数', async () => {
  const { resetAt: resetAt1 } = await store.getAndSet({
    key: 'foo',
    maxRequest: 2,
    duration: 2000,
  });
  await sleep(200);
  const { resetAt: resetAt2 } = await store.getAndSet({
    key: 'foo',
    maxRequest: 2,
    duration: 2000,
  });
  const { resetAt: resetAt3 } = await store.getAndSet({
    key: 'foo',
    maxRequest: 2,
    duration: 2000,
  });
  const { resetAt: resetAt4 } = await store.getAndSet({
    key: 'foo',
    maxRequest: 2,
    duration: 2000,
  });
  expect(resetAt1).toBe(resetAt2);
  expect(resetAt3).toBeGreaterThan(resetAt2);
  expect(resetAt4).toBeGreaterThan(resetAt3);
});

test('允许传入redis实例', () => {
  const redis = new Redis();
  const store = new RateLimitRedisStore(redis);
  expect(store['redis']).toBe(redis);
  redis.disconnect();
});
