import { FileCache } from '../src';
import { tmpdir } from 'node:os';
import path, { resolve } from 'node:path';
import { sleep } from '@aomex/internal-tools';
import { test, expect, describe } from 'vitest';
import { existsSync, rmSync } from 'node:fs';

const getFileName = () =>
  path.join(tmpdir(), 'aomex.cache.' + Date.now() + Math.random());

test('默认的文件名', async () => {
  const file = resolve('aomex.cache');
  try {
    rmSync(file);
  } catch {}
  expect(existsSync(file)).toBeFalsy();
  const cache = new FileCache();
  const db = await cache['connect']();
  expect(existsSync(file)).toBeTruthy();
  await db.close();
  rmSync(file);
});

test('设置/获取', async () => {
  const cache = new FileCache({ filename: getFileName() });

  const result = await cache['setValue']('foo', 'bar');
  expect(result).toBeTruthy();
  await expect(cache['getValue']('foo')).resolves.toBe('bar');
});

test('携带过期时间', async () => {
  const cache = new FileCache({ filename: getFileName() });

  await cache['setValue']('foo', 'bar', 200);
  await expect(cache['getValue']('foo')).resolves.toBe('bar');
  await sleep(800);
  await expect(cache['getValue']('foo')).resolves.toBeNull();
});

test('不存在才设置', async () => {
  const cache = new FileCache({ filename: getFileName() });

  await expect(cache['addValue']('foo', 'bar')).resolves.toBeTruthy();
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeFalsy();
  await expect(cache['addValue']('foo-1', 'bar', 200)).resolves.toBeTruthy();
  await expect(cache['addValue']('foo-1', 'bar')).resolves.toBeFalsy();
  await sleep(800);
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeFalsy();
  await expect(cache['addValue']('foo-1', 'bar')).resolves.toBeTruthy();
});

test('判断存在', async () => {
  const cache = new FileCache({ filename: getFileName() });

  await expect(cache['existsKey']('foo')).resolves.toBeFalsy();
  await cache['setValue']('foo', 'bar', 800);
  await expect(cache['existsKey']('foo')).resolves.toBeTruthy();
  await sleep(1800);
  await expect(cache['existsKey']('foo')).resolves.toBeFalsy();
});

describe('自增', async () => {
  test('默认设置0', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await expect(cache['increaseValue']('foo')).resolves.toBe(1);
    await expect(cache['increaseValue']('foo')).resolves.toBe(2);
  });

  test('设置初始值', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await cache['setValue']('foo', '30');
    await expect(cache['increaseValue']('foo')).resolves.toBe(31);
  });

  test('并发', async () => {
    const cache = new FileCache({ filename: getFileName() });
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
    const cache = new FileCache({ filename: getFileName() });
    await cache['setValue']('foo', '"30"');
    await expect(cache['increaseValue']('foo')).resolves.toBe(1);
  });
});

describe('自减', async () => {
  test('默认设置0', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-1);
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-2);
  });

  test('设置初始值', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await cache['setValue']('foo', '30');
    await expect(cache['decreaseValue']('foo')).resolves.toBe(29);
  });
  test('并发', async () => {
    const cache = new FileCache({ filename: getFileName() });
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
    const cache = new FileCache({ filename: getFileName() });
    await cache['setValue']('foo', '"30"');
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-1);
  });
});

describe('过期时间', async () => {
  test('当缓存存在，未设置过期时间，设置成功', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await cache['setValue']('foo', 'bar');
    await expect(cache['expireValue']('foo', 400)).resolves.toBeTruthy();
    await expect(cache['getValue']('foo')).resolves.toBe('bar');
    await sleep(800);
    await expect(cache['getValue']('foo')).resolves.toBeNull();
  });

  test('当缓存存在，已设置过期时间，设置成功', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await cache['setValue']('foo', 'bar', 1200);
    await expect(cache['expireValue']('foo', 400)).resolves.toBeTruthy();
    await expect(cache['getValue']('foo')).resolves.toBe('bar');
    await sleep(800);
    await expect(cache['getValue']('foo')).resolves.toBeNull();
  });

  test('当缓存不存在，设置失败', async () => {
    const cache = new FileCache({ filename: getFileName() });
    await expect(cache['expireValue']('foo', 200)).resolves.toBeFalsy();
  });
});

test('删除缓存', async () => {
  const cache = new FileCache({ filename: getFileName() });

  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2');
  await expect(cache['deleteValue']('foo')).resolves.toBeTruthy();

  await expect(cache['getValue']('foo')).resolves.toBeNull();
  await expect(cache['getValue']('bar')).resolves.toBe('2');
});

test('删除全部缓存', async () => {
  const cache = new FileCache({ filename: getFileName() });

  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2');
  await expect(cache['deleteAllValues']()).resolves.toBeTruthy();

  await expect(cache['getValue']('foo')).resolves.toBeNull();
  await expect(cache['getValue']('bar')).resolves.toBeNull();
});

test('垃圾回收', async () => {
  const cache = new FileCache({ filename: getFileName() });

  const db = await cache['connect']();
  const sql = `select name,value from ${cache['tableName']}`;

  await cache['setValue']('a', 'aaa');
  await cache['setValue']('b', 'bbb', 200);
  await cache['setValue']('c', 'ccc', 1200);

  await sleep(600);
  await expect(db.all(sql)).resolves.toStrictEqual([
    { name: 'a', value: 'aaa' },
    { name: 'b', value: 'bbb' },
    { name: 'c', value: 'ccc' },
  ]);
  await cache['gc']();
  await expect(db.all(sql)).resolves.toStrictEqual([
    { name: 'a', value: 'aaa' },
    { name: 'c', value: 'ccc' },
  ]);
  await sleep(700);
  await cache['gc']();
  await expect(db.all(sql)).resolves.toStrictEqual([{ name: 'a', value: 'aaa' }]);
});

test('前缀', async () => {
  const filename = getFileName();
  const cache1 = new FileCache({ filename, keyPrefix: 'myprefix_' });
  const cache2 = new FileCache({ filename, keyPrefix: 'myprefix_' });
  const cache3 = new FileCache({ filename, keyPrefix: 'prefix1_' });
  const cache4 = new FileCache({ filename });

  await cache1.set('foo', 'bar');
  await expect(cache1.get('foo')).resolves.toBe('bar');
  await expect(cache2.get('foo')).resolves.toBe('bar');
  await expect(cache3.get('foo')).resolves.toBeNull();
  await expect(cache4.get('foo')).resolves.toBeNull();
});
