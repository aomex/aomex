import { expect, test } from 'vitest';
import { RateLimitMemoryStore } from '../src/memory-store';
import { sleep } from '@aomex/internal-tools';

test('输出', async () => {
  const store = new RateLimitMemoryStore();
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
  const store = new RateLimitMemoryStore();
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
  const store = new RateLimitMemoryStore();
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
  const store = new RateLimitMemoryStore();
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
  const store = new RateLimitMemoryStore();
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
