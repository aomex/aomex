import { describe, expect, test } from 'vitest';
import { sleep } from '@aomex/internal-tools';
import { CacheMemoryStore } from '../src';

test('设置/获取', async () => {
  const store = new CacheMemoryStore();

  const result = await store.setValue('foo', 'bar');
  expect(result).toBeTruthy();
  await expect(store.getValue('foo')).resolves.toBe('bar');
});

test('携带过期时间', async () => {
  const store = new CacheMemoryStore();

  await store.setValue('foo', 'bar', 1000);
  await sleep(2000);
  await expect(store.getValue('foo')).resolves.toBeNull();
});

test('不存在才设置', async () => {
  const store = new CacheMemoryStore();

  await expect(store.setNotExistValue('foo', 'bar')).resolves.toBeTruthy();
  await expect(store.setNotExistValue('foo', 'bar')).resolves.toBeFalsy();
  await expect(store.setNotExistValue('foo-1', 'bar', 1000)).resolves.toBeTruthy();
  await expect(store.setNotExistValue('foo-1', 'bar')).resolves.toBeFalsy();
  await sleep(2000);
  await expect(store.setNotExistValue('foo', 'bar')).resolves.toBeFalsy();
  await expect(store.setNotExistValue('foo-1', 'bar')).resolves.toBeTruthy();
});

test('判断存在', async () => {
  const store = new CacheMemoryStore();

  await expect(store.existsKey('foo')).resolves.toBeFalsy();
  await store.setValue('foo', 'bar', 1000);
  await expect(store.existsKey('foo')).resolves.toBeTruthy();
  await sleep(2000);
  await expect(store.existsKey('foo')).resolves.toBeFalsy();
});

describe('自增', async () => {
  test('默认设置0', async () => {
    const store = new CacheMemoryStore();

    await expect(store.increaseValue('foo')).resolves.toBe(1);
    await expect(store.increaseValue('foo')).resolves.toBe(2);
  });

  test('设置初始值', async () => {
    const store = new CacheMemoryStore();

    await store.setValue('foo', '30');
    await expect(store.increaseValue('foo')).resolves.toBe(31);
  });

  test('并发', async () => {
    const store = new CacheMemoryStore();

    const result = await Promise.all([
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
      store.increaseValue('foo'),
    ]);
    expect(result.sort()).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('字符串无法自增', async () => {
    const store = new CacheMemoryStore();

    await store.setValue('foo', '"30"');
    await expect(() => store.increaseValue('foo')).rejects.toThrowError();
  });
});

describe('自减', async () => {
  test('默认设置0', async () => {
    const store = new CacheMemoryStore();

    await expect(store.decreaseValue('foo')).resolves.toBe(-1);
    await expect(store.decreaseValue('foo')).resolves.toBe(-2);
  });

  test('设置初始值', async () => {
    const store = new CacheMemoryStore();

    await store.setValue('foo', '30');
    await expect(store.decreaseValue('foo')).resolves.toBe(29);
  });
  test('并发', async () => {
    const store = new CacheMemoryStore();

    const result = await Promise.all([
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
      store.decreaseValue('foo'),
    ]);
    expect(result.sort()).toStrictEqual([-1, -2, -3, -4, -5, -6, -7]);
  });

  test('字符串无法自增', async () => {
    const store = new CacheMemoryStore();

    await store.setValue('foo', '"30"');
    await expect(() => store.decreaseValue('foo')).rejects.toThrowError();
  });
});

describe('过期时间', async () => {
  test('当缓存存在，未设置过期时间，设置成功', async () => {
    const store = new CacheMemoryStore();

    await store.setValue('foo', 'bar');
    await expect(store.expireKey('foo', 1000)).resolves.toBeTruthy();
    await expect(store.getValue('foo')).resolves.toBe('bar');
    await sleep(2000);
    await expect(store.getValue('foo')).resolves.toBeNull();
  });

  test('当缓存存在，已设置过期时间，设置成功', async () => {
    const store = new CacheMemoryStore();

    await store.setValue('foo', 'bar', 5000);
    await expect(store.expireKey('foo', 1000)).resolves.toBeTruthy();
    await expect(store.getValue('foo')).resolves.toBe('bar');
    await sleep(2000);
    await expect(store.getValue('foo')).resolves.toBeNull();
  });

  test('当缓存不存在，设置失败', async () => {
    const store = new CacheMemoryStore();

    await expect(store.expireKey('foo', 200)).resolves.toBeFalsy();
  });
});

describe('查看剩余时间', () => {
  test('不存在的缓存', async () => {
    const store = new CacheMemoryStore();
    await expect(store.ttlKey('foo')).resolves.toBe(-2);
  });

  test('过期的缓存', async () => {
    const store = new CacheMemoryStore();
    store.setValue('foo', 'bar', 500);
    await sleep(1000);
    await expect(store.ttlKey('foo')).resolves.toBe(-2);
  });

  test('未设置时间', async () => {
    const store = new CacheMemoryStore();
    store.setValue('foo', 'bar');
    await expect(store.ttlKey('foo')).resolves.toBe(-1);
  });

  test('已设置时间', async () => {
    const store = new CacheMemoryStore();
    store.setValue('foo', 'bar', 5000);
    await expect(store.ttlKey('foo')).resolves.toBeGreaterThan(4500);
  });
});

describe('数组操作', () => {
  test('左边推入，右边取出', async () => {
    const store = new CacheMemoryStore();
    await store.leftPushValue('foo', 'bar', 'baz', 'test');
    await expect(store.rightPopValue('foo')).resolves.toBe('test');
    await expect(store.rightPopValue('foo')).resolves.toBe('baz');
    await expect(store.rightPopValue('foo')).resolves.toBe('bar');
    await expect(store.rightPopValue('foo')).resolves.toBe(null);
  });

  test('不能用get获取', async () => {
    const store = new CacheMemoryStore();
    await store.leftPushValue('foo', 'bar');
    await expect(store.getValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 错误的值类型]`,
    );
  });

  test('可以使用exists判断', async () => {
    const store = new CacheMemoryStore();
    await store.leftPushValue('foo', 'bar');
    await expect(store.existsKey('foo')).resolves.toBeTruthy();
  });

  test('不能自增', async () => {
    const store = new CacheMemoryStore();
    await store.leftPushValue('foo', 'bar');
    await expect(store.increaseValue('foo')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 错误的值类型]`,
    );
  });

  test('数组清空后可以自增', async () => {
    const store = new CacheMemoryStore();
    await store.leftPushValue('foo', 'bar');
    await store.rightPopValue('foo');
    await expect(store.increaseValue('foo')).resolves.toBe(1);
  });
});

test('删除缓存', async () => {
  const store = new CacheMemoryStore();

  await store.setValue('foo', '1');
  await store.setValue('bar', '2');
  await expect(store.deleteValue('foo')).resolves.toBeTruthy();

  await expect(store.getValue('foo')).resolves.toBeNull();
  await expect(store.getValue('bar')).resolves.toBe('2');
});

test('删除全部缓存', async () => {
  const store = new CacheMemoryStore();

  await store.setValue('foo', '1');
  await store.setValue('bar', '2');
  await expect(store.deleteAllValues()).resolves.toBeTruthy();

  await expect(store.getValue('foo')).resolves.toBeNull();
  await expect(store.getValue('bar')).resolves.toBeNull();
});

test('垃圾回收', async () => {
  const store = new CacheMemoryStore();

  await store.setValue('foo', '1');
  await store.setValue('bar', '2', 50);
  await sleep(100);
  expect(Array.from(store['data'].keys())).toStrictEqual(['foo', 'bar']);
  await store.gc();
  expect(Array.from(store['data'].keys())).toStrictEqual(['foo']);
});
