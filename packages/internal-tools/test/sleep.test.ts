import { expect, test, vitest } from 'vitest';
import { sleep } from '../src';

test('异步等待', () => {
  expect(sleep(1)).toBeInstanceOf(Promise);
  expect(sleep(0)).toBeInstanceOf(Promise);
  expect(sleep(-10)).toBeInstanceOf(Promise);
});

test('内部调用setTimeout', () => {
  const spy = vitest.spyOn(globalThis, 'setTimeout');
  sleep(1);
  expect(spy).toHaveBeenCalledOnce();
  spy.mockRestore();
});

test('传入非正数则立即执行', () => {
  const spy = vitest.spyOn(globalThis, 'setTimeout');
  sleep(0);
  expect(spy).toHaveBeenCalledTimes(0);
  sleep(-10);
  expect(spy).toHaveBeenCalledTimes(0);
  spy.mockRestore();
});
