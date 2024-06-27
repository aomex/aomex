import { expect, test, vitest } from 'vitest';
import { MockCache } from './mock/caching.mock';

test('key长度', () => {
  const caching = new MockCache();

  expect(caching['buildKey']('foo')).toBe('foo');
  expect(caching['buildKey']('foo'.repeat(10) + 'f')).toBe(
    'foofoofoofoofoofoofoofoofoofoof',
  );
  expect(caching['buildKey']('foo'.repeat(10) + 'fo')).toBe(
    'a11a78b82ab930387e553f725c37c488',
  );
  expect(caching['buildKey']('foo'.repeat(20))).toBe('4c73f7f210f32dbe0b4079f1d280ac37');
});

test('设置值', async () => {
  const caching = new MockCache({});

  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'setValue').mockImplementation(async () => true);

  await caching.set('foo', 'bar');
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', undefined);
  expect(spy).toReturnWith(true);

  await caching.set('foo', ['bar']);
  expect(spy).toHaveBeenLastCalledWith('foo', '["bar"]', undefined);

  await caching.set('foo', { foo: 'bar' });
  expect(spy).toHaveBeenLastCalledWith('foo', '{"foo":"bar"}', undefined);

  await caching.set('foo', 'bar', 20);
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 20);
});

test('获取值', async () => {
  const caching = new MockCache({});
  vitest
    // @ts-expect-error
    .spyOn(caching, 'getValue')
    // @ts-expect-error
    .mockImplementationOnce(() => null)
    // @ts-expect-error
    .mockImplementationOnce(() => '"bar"');

  await expect(caching.get('foo')).resolves.toBeNull();
  await expect(caching.get('foo')).resolves.toBe('bar');
});

test('获取时携带默认值', async () => {
  const caching = new MockCache({});
  vitest
    // @ts-expect-error
    .spyOn(caching, 'getValue')
    // @ts-expect-error
    .mockImplementationOnce(() => null)
    // @ts-expect-error
    .mockImplementationOnce(() => '"bar"');
  await expect(caching.get('foo', 'default')).resolves.toBe('default');
  await expect(caching.get('foo', 'default')).resolves.toBe('bar');
});

test('不存在才设置', async () => {
  const caching = new MockCache({});
  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'addValue').mockImplementation(() => true);

  await expect(caching.add('foo', 'bar')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', undefined);
  await expect(caching.add('foo', 'bar', 200)).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 200);
});

test('判断存在', async () => {
  const caching = new MockCache({});
  const spy = vitest
    // @ts-expect-error
    .spyOn(caching, 'existsKey')
    // @ts-expect-error
    .mockImplementationOnce(async () => true)
    // @ts-expect-error
    .mockImplementationOnce(async () => false);

  await expect(caching.exists('foo1')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo1');
  await expect(caching.exists('foo2')).resolves.toBeFalsy();
  expect(spy).toHaveBeenLastCalledWith('foo2');
});

test('自增', async () => {
  const caching = new MockCache();
  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'increaseValue').mockImplementation(() => 1);

  await expect(caching.increment('foo')).resolves.toBe(1);
  expect(spy).toHaveBeenLastCalledWith('foo');
});

test('自减', async () => {
  const caching = new MockCache();
  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'decreaseValue').mockImplementation(() => 1);

  await expect(caching.decrement('foo')).resolves.toBe(1);
  expect(spy).toHaveBeenLastCalledWith('foo');
});

test('设置过期时间', async () => {
  const caching = new MockCache();
  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'expireValue').mockImplementation(() => true);

  await expect(caching.expires('foo', 20)).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', 20);
});

test('获取并设置', async () => {
  const caching = new MockCache({});
  const getSpy = vitest.spyOn(caching, 'get');
  const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);

  getSpy
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => 'bar');
  await expect(caching.getOrSet('foo', () => 'bar')).resolves.toBe('bar');
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenLastCalledWith('foo', 'bar', undefined);
  setSpy.mockReset();

  getSpy
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => 'bar1');
  await expect(caching.getOrSet('foo', () => 'bar2', 100)).resolves.toBe('bar1');
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenLastCalledWith('foo', 'bar2', 100);

  getSpy.mockImplementationOnce(async () => 'ok');
  await expect(caching.getOrSet('foo', () => 'bar')).resolves.toBe('ok');
  expect(setSpy).toHaveBeenCalledTimes(1);
});

test('获取并删除', async () => {
  const caching = new MockCache({});

  const getSpy = vitest.spyOn(caching, 'get');
  const deleteSpy = vitest.spyOn(caching, 'delete').mockImplementation(async () => true);

  getSpy.mockImplementationOnce(async () => null);
  await expect(caching.getAndDelete('foo')).resolves.toBeNull();
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(getSpy).toHaveBeenLastCalledWith('foo', undefined);
  expect(deleteSpy).toHaveBeenCalledTimes(0);

  getSpy.mockImplementationOnce(async () => 'bar');
  await expect(caching.getAndDelete('foo')).resolves.toBe('bar');
  expect(deleteSpy).toHaveBeenCalledTimes(1);
  expect(deleteSpy).toHaveBeenLastCalledWith('foo');
});

test('删除', async () => {
  const caching = new MockCache({});
  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'deleteValue').mockImplementation(() => true);

  await expect(caching.delete('foo')).resolves.toBeTruthy();
  expect(spy).toBeCalledWith('foo');
});

test('删除全部', async () => {
  const caching = new MockCache({});
  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'deleteAllValues').mockImplementation(() => true);

  await expect(caching.deleteAll()).resolves.toBeTruthy();
  expect(spy).toBeCalledWith();
});

test('回收已过期缓存', async () => {
  const caching = new MockCache({ gcProbability: 15 });
  const randomSpy = vitest
    .spyOn(Math, 'random')
    .mockImplementationOnce(() => 0.1)
    .mockImplementationOnce(() => 0.3);

  // @ts-expect-error
  const spy = vitest.spyOn(caching, 'gc');
  // @ts-expect-error
  vitest.spyOn(caching, 'setValue').mockImplementation(() => true);

  await caching.set('foo', 'bar');
  expect(spy).toBeCalledTimes(1);
  await caching.set('foo', 'bar');
  expect(spy).toBeCalledTimes(1);

  randomSpy.mockRestore();
});
