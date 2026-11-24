import { expect, test } from 'vitest';
import { RateLimitMemoryStore } from '@aomex/rate-limit/memory';
import sleep from 'sleep-promise';

test('输出', async () => {
  const store = new RateLimitMemoryStore();
  const result = await store.getAndSet({ key: 'foo', limit: 10, window: 100 });
  expect(Object.keys(result)).toMatchInlineSnapshot(`
    [
      "key",
      "remaining",
      "resetAt",
    ]
  `);
});

test('根据ID寻找', async () => {
  const store = new RateLimitMemoryStore();
  await expect(
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
  await expect(
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 9);

  await expect(
    store.getAndSet({ key: 'bar', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
  await expect(
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 8);
});

test('并发', async () => {
  const store = new RateLimitMemoryStore();
  const result = await Promise.all([
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ]);

  expect(result.map((item) => item.remaining)).toStrictEqual([10, 9, 8, 7, 6]);
});

test('过期自动重置剩余次数', async () => {
  const store = new RateLimitMemoryStore();
  await expect(
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
  await expect(
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 9);

  await sleep(150);
  await expect(
    store.getAndSet({ key: 'foo', limit: 10, window: 100 }),
  ).resolves.toHaveProperty('remaining', 10);
});

test('超过次数后，延长重置次数', async () => {
  const store = new RateLimitMemoryStore();
  const { resetAt: resetAt1 } = await store.getAndSet({
    key: 'foo',
    limit: 2,
    window: 2000,
  });
  await sleep(200);
  const { resetAt: resetAt2 } = await store.getAndSet({
    key: 'foo',
    limit: 2,
    window: 2000,
  });
  const { resetAt: resetAt3 } = await store.getAndSet({
    key: 'foo',
    limit: 2,
    window: 2000,
  });
  const { resetAt: resetAt4 } = await store.getAndSet({
    key: 'foo',
    limit: 2,
    window: 2000,
  });
  expect(resetAt1).toBe(resetAt2);
  expect(resetAt3).toBeGreaterThan(resetAt2);
  expect(resetAt4).toBeGreaterThan(resetAt3);
});

test('onDestroy 清空内存记录', async () => {
  const store = new RateLimitMemoryStore();
  await store.getAndSet({ key: 'foo', limit: 10, window: 1000 });
  expect(store['store'].size).toBe(1);
  await store.onDestroy();
  expect(store['store'].size).toBe(0);
  await store.onDestroy();
});
