import type { RedisOptions } from 'ioredis';
import RedisMemoryServer from 'redis-memory-server';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { RedisCache } from '../src';
import { sleep } from '@aomex/internal-tools';

let redisServer: RedisMemoryServer;
let opts: RedisOptions;
let cache: RedisCache;

beforeAll(async () => {
  redisServer = await RedisMemoryServer.create();
  await redisServer.ensureInstance();
  opts = {
    host: await redisServer.getHost(),
    port: await redisServer.getPort(),
  };
  cache = new RedisCache({ redis: { ...opts } });
}, 50_000 /* 首次下载redis */);

afterEach(async () => {
  await cache.redis.flushall();
});

afterAll(async () => {
  cache.redis.disconnect();
  await redisServer.stop();
});

test('设置/获取', async () => {
  const result = await cache['setValue']('foo', 'bar');
  expect(result).toBeTruthy();
  await expect(cache['getValue']('foo')).resolves.toBe('bar');
});

test('携带过期时间', async () => {
  await cache['setValue']('foo', 'bar', 200);
  await sleep(800);
  await expect(cache['getValue']('foo')).resolves.toBeNull();
});

test('不存在才设置', async () => {
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeTruthy();
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeFalsy();
  await expect(cache['addValue']('foo-1', 'bar', 200)).resolves.toBeTruthy();
  await expect(cache['addValue']('foo-1', 'bar')).resolves.toBeFalsy();
  await sleep(800);
  await expect(cache['addValue']('foo', 'bar')).resolves.toBeFalsy();
  await expect(cache['addValue']('foo-1', 'bar')).resolves.toBeTruthy();
});

test('判断存在', async () => {
  await expect(cache['existsKey']('foo')).resolves.toBeFalsy();
  await cache['setValue']('foo', 'bar', 800);
  await expect(cache['existsKey']('foo')).resolves.toBeTruthy();
  await sleep(1800);
  await expect(cache['existsKey']('foo')).resolves.toBeFalsy();
});

describe('自增', async () => {
  test('默认设置0', async () => {
    await expect(cache['increaseValue']('foo')).resolves.toBe(1);
    await expect(cache['increaseValue']('foo')).resolves.toBe(2);
  });

  test('设置初始值', async () => {
    await cache['setValue']('foo', '30');
    await expect(cache['increaseValue']('foo')).resolves.toBe(31);
  });

  test('并发', async () => {
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
    await cache['setValue']('foo', '"30"');
    await expect(() => cache['increaseValue']('foo')).rejects.toThrowError();
  });
});

describe('自减', async () => {
  test('默认设置0', async () => {
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-1);
    await expect(cache['decreaseValue']('foo')).resolves.toBe(-2);
  });

  test('设置初始值', async () => {
    await cache['setValue']('foo', '30');
    await expect(cache['decreaseValue']('foo')).resolves.toBe(29);
  });
  test('并发', async () => {
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
    await cache['setValue']('foo', '"30"');
    await expect(() => cache['decreaseValue']('foo')).rejects.toThrowError();
  });
});

describe('过期时间', async () => {
  test('当缓存存在，未设置过期时间，设置成功', async () => {
    await cache['setValue']('foo', 'bar');
    await expect(cache['expireValue']('foo', 400)).resolves.toBeTruthy();
    await expect(cache['getValue']('foo')).resolves.toBe('bar');
    await sleep(800);
    await expect(cache['getValue']('foo')).resolves.toBeNull();
  });

  test('当缓存存在，已设置过期时间，设置成功', async () => {
    await cache['setValue']('foo', 'bar', 1200);
    await expect(cache['expireValue']('foo', 400)).resolves.toBeTruthy();
    await expect(cache['getValue']('foo')).resolves.toBe('bar');
    await sleep(800);
    await expect(cache['getValue']('foo')).resolves.toBeNull();
  });

  test('当缓存不存在，设置失败', async () => {
    await expect(cache['expireValue']('foo', 200)).resolves.toBeFalsy();
  });
});

test('删除缓存', async () => {
  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2');
  await expect(cache['deleteValue']('foo')).resolves.toBeTruthy();

  await expect(cache['getValue']('foo')).resolves.toBeNull();
  await expect(cache['getValue']('bar')).resolves.toBe('2');
});

test('删除全部缓存', async () => {
  await cache['setValue']('foo', '1');
  await cache['setValue']('bar', '2');
  await expect(cache['deleteAllValues']()).resolves.toBeTruthy();

  await expect(cache['getValue']('foo')).resolves.toBeNull();
  await expect(cache['getValue']('bar')).resolves.toBeNull();
});

test('删除全部指定前缀缓存', async () => {
  const cache1 = new RedisCache({ redis: { ...opts, keyPrefix: 'aaaa:', db: 0 } });
  const cache2 = new RedisCache({ redis: { ...opts, keyPrefix: 'bbbb:', db: 0 } });

  await cache1['setValue']('foo', '1');
  await cache1['setValue']('bar', '1');
  await cache2['setValue']('foo', '2');
  await cache2['setValue']('bar', '2');
  let keys = await cache2.redis.keys('*');
  expect(keys.sort()).toStrictEqual(['aaaa:bar', 'aaaa:foo', 'bbbb:bar', 'bbbb:foo']);

  await cache1['deleteAllValues']();
  keys = await cache2.redis.keys('*');
  expect(keys.sort()).toStrictEqual(['bbbb:bar', 'bbbb:foo']);

  cache1.redis.disconnect();
  cache2.redis.disconnect();
});

test('重写方法 getAndDelete', async () => {
  await cache.set('foo', 'bar');
  await expect(cache.getAndDelete('foo')).resolves.toBe('bar');
  await expect(cache.getAndDelete('foo')).resolves.toBeNull();
  await expect(cache.get('foo')).resolves.toBeNull();
  await expect(cache.getAndDelete('foo', 'a-foo')).resolves.toBe('a-foo');
});
