import { describe, expect, test } from 'vitest';
import { sleep } from '@aomex/internal-tools';
import { MemoryCache } from '../src';

test('设置/获取', async () => {
  const cache = new MemoryCache();

  const result = await cache['setValue']('foo', 'bar');
  expect(result).toBeTruthy();
  await expect(cache['getValue']('foo')).resolves.toBe('bar');
});

test('携带过期时间', async () => {
  const cache = new MemoryCache();

  await cache['setValue']('foo', 'bar', 1000);
  await sleep(2000);
  await expect(cache['getValue']('foo')).resolves.toBeNull();
});

test('不存在才设置', async () => {
  const cache = new MemoryCache();

  await expect(cache['addValue']('foo', 'bar')).resolves.toBeTruthy();
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeFalsy();
  await expect(cache['addValue']('foo-1', 'bar', 1000)).resolves.toBeTruthy();
  await expect(cache['addValue']('foo-1', 'bar')).resolves.toBeFalsy();
  await sleep(2000);
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeFalsy();
  await expect(cache['addValue']('foo-1', 'bar')).resolves.toBeTruthy();
});

test('判断存在', async () => {
  const cache = new MemoryCache();
  await expect(cache['existsKey']('foo')).resolves.toBeFalsy();
  await cache['setValue']('foo', 'bar', 1000);
  await expect(cache['existsKey']('foo')).resolves.toBeTruthy();
  await sleep(2000);
  await expect(cache['existsKey']('foo')).resolves.toBeFalsy();
});

describe('自增', async () => {
  test('默认设置0', async () => {
    const cache = new MemoryCache();
    await expect(cache['increaseValue']('foo')).resolves.toBe(1);
    await expect(cache['increaseValue']('foo')).resolves.toBe(2);
  });

  test('设置初始值', async () => {
    const cache = new MemoryCache();
    await cache['setValue']('foo', '30');
    await expect(cache['increaseValue']('foo')).resolves.toBe(31);
  });

  test('并发', async () => {
    const cache = new MemoryCache();
    const result = await Promise.all([
      cache['increaseValue']('foo'),
      cache['increaseValue']('foo'),
      cache['increaseValue']('foo'),
      cache['increaseValue']('foo'),
      cache['increaseValue']('foo'),
      cache['increaseValue']('foo'),
      cache['increaseValue']('foo'),
    ]);
    expect(result.sort()).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('字符串无法自增', async () => {
    const cache = new MemoryCache();
    await cache['setValue']('foo', '"30"');
    await expect(() => cache['increaseValue']('foo')).rejects.toThrowError();
  });
});

describe('自减', async () => {
  test('默认设置0', async () => {
    const cache = new MemoryCache();
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-1);
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-2);
  });

  test('设置初始值', async () => {
    const cache = new MemoryCache();
    await cache['setValue']('foo', '30');
    await expect(cache['decreaseValue']('foo')).resolves.toBe(29);
  });
  test('并发', async () => {
    const cache = new MemoryCache();
    const result = await Promise.all([
      cache['decreaseValue']('foo'),
      cache['decreaseValue']('foo'),
      cache['decreaseValue']('foo'),
      cache['decreaseValue']('foo'),
      cache['decreaseValue']('foo'),
      cache['decreaseValue']('foo'),
      cache['decreaseValue']('foo'),
    ]);
    expect(result.sort()).toStrictEqual([-1, -2, -3, -4, -5, -6, -7]);
  });

  test('字符串无法自增', async () => {
    const cache = new MemoryCache();
    await cache['setValue']('foo', '"30"');
    await expect(() => cache['decreaseValue']('foo')).rejects.toThrowError();
  });
});

describe('过期时间', async () => {
  test('当缓存存在，未设置过期时间，设置成功', async () => {
    const cache = new MemoryCache();
    await cache['setValue']('foo', 'bar');
    await expect(cache['expireValue']('foo', 1000)).resolves.toBeTruthy();
    await expect(cache['getValue']('foo')).resolves.toBe('bar');
    await sleep(2000);
    await expect(cache['getValue']('foo')).resolves.toBeNull();
  });

  test('当缓存存在，已设置过期时间，设置成功', async () => {
    const cache = new MemoryCache();
    await cache['setValue']('foo', 'bar', 5000);
    await expect(cache['expireValue']('foo', 1000)).resolves.toBeTruthy();
    await expect(cache['getValue']('foo')).resolves.toBe('bar');
    await sleep(2000);
    await expect(cache['getValue']('foo')).resolves.toBeNull();
  });

  test('当缓存不存在，设置失败', async () => {
    const cache = new MemoryCache();
    await expect(cache['expireValue']('foo', 200)).resolves.toBeFalsy();
  });
});

test('删除缓存', async () => {
  const cache = new MemoryCache();
  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2');
  await expect(cache['deleteValue']('foo')).resolves.toBeTruthy();

  await expect(cache['getValue']('foo')).resolves.toBeNull();
  await expect(cache['getValue']('bar')).resolves.toBe('2');
});

test('删除全部缓存', async () => {
  const cache = new MemoryCache();
  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2');
  await expect(cache['deleteAllValues']()).resolves.toBeTruthy();

  await expect(cache['getValue']('foo')).resolves.toBeNull();
  await expect(cache['getValue']('bar')).resolves.toBeNull();
});

test('垃圾回收', async () => {
  const cache = new MemoryCache();

  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2', 50);
  await sleep(100);
  expect(Array.from(cache['data'].keys())).toStrictEqual(['foo', 'bar']);
  await cache['gc']();
  expect(Array.from(cache['data'].keys())).toStrictEqual(['foo']);
});
