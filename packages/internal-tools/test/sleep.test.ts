import { expect, test } from 'vitest';
import { sleep } from '../src';

test('异步等待', () => {
  expect(sleep(1)).toBeInstanceOf(Promise);
});

test('使用毫秒作为参数', async () => {
  const now = Date.now();
  await sleep(200);
  const diff = Date.now() - now;
  expect(diff).toBeGreaterThanOrEqual(200);
  expect(diff).toBeLessThan(206);
});

test('参数为负数时立即结束', async () => {
  const now = Date.now();
  await sleep(-100);
  const diff = Date.now() - now;
  expect(diff).toBeLessThan(5);
});
