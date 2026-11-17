import RedisMemoryServer from 'redis-memory-server';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { getRedisBinary } from '../../cache-redis-adapter/test/helper/get-redis-binary';
import { RateLimitRedisStore } from '../src';
import sleep from 'sleep-promise';

let redisServer: RedisMemoryServer;
let store: RateLimitRedisStore;

beforeAll(async () => {
  redisServer = await RedisMemoryServer.create({
    binary: getRedisBinary(),
  });
  await redisServer.ensureInstance();
  store = new RateLimitRedisStore({
    host: await redisServer.getHost(),
    port: await redisServer.getPort(),
  });
  await store.onInit();
}, 60_000 /* start redis */);

afterEach(async () => {
  await store['redis'].flushall();
});

afterAll(async () => {
  await store.onDestroy();
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

test('onInit 连接，onDestroy 可幂等', async () => {
  const local = new RateLimitRedisStore({
    host: await redisServer.getHost(),
    port: await redisServer.getPort(),
  });
  expect(local['redis'].status).toBe('wait');
  await local.onInit();
  expect(local['redis'].status).toBe('ready');
  await expect(local.onDestroy()).resolves.toBeUndefined();
  await expect(local.onDestroy()).resolves.toBeUndefined();
});
