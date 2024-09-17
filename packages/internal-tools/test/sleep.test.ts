import { expect, test, vitest } from 'vitest';
import { sleep } from '../src';

test('异步等待', () => {
  expect(sleep(1)).toBeInstanceOf(Promise);
  expect(sleep(0)).toBeInstanceOf(Promise);
  expect(sleep(-10)).toBeInstanceOf(Promise);
});

test('延迟效果', async () => {
  let value = 0;
  (async () => {
    await sleep(2000);
    value = 1;
  })();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  expect(value).toBe(0);
  await new Promise((resolve) => setTimeout(resolve, 700));
  expect(value).toBe(1);
});

test('传入非正数则立即执行', () => {
  const spy = vitest.spyOn(globalThis, 'setTimeout');
  sleep(0);
  expect(spy).toHaveBeenCalledTimes(0);
  sleep(-10);
  expect(spy).toHaveBeenCalledTimes(0);
  spy.mockRestore();
});
