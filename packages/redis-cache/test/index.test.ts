import { createClient } from 'redis';
import { createHash } from 'crypto';
import { sleep } from '@aomex/utility';
import { RedisCache } from '../src';

const cache = new RedisCache({
  redis: {
    url: 'redis://localhost:6379',
    database:
      process.env['REDIS_DB'] === undefined
        ? 12
        : Number(process.env['REDIS_DB']),
  },
});

beforeEach(async () => {
  await cache.redis.flushDb();
});

test('set and get', async () => {
  await expect(cache.get('my-key')).resolves.toBeNull();
  await cache.set('my-key', 'my-value');
  await expect(cache.get('my-key')).resolves.toBe('my-value');
});

test('get with default value', async () => {
  await expect(cache.get('my-key', 'default')).resolves.toBe('default');
  await cache.set('my-key', 'my-value');
  await expect(cache.get('my-key')).resolves.toBe('my-value');
});

test('override previous value when set again', async () => {
  await cache.set('my-key', 'my-value');
  await expect(cache.get('my-key')).resolves.toBe('my-value');
  await cache.set('my-key', 'value-123');
  await expect(cache.get('my-key')).resolves.toBe('value-123');
});

test('add without overriding', async () => {
  await expect(cache.add('my-key', 'my-value')).resolves.toBeTruthy();
  await expect(cache.get('my-key')).resolves.toBe('my-value');
  await expect(cache.add('my-key', 'other-value')).resolves.toBeFalsy();
  await expect(cache.get('my-key')).resolves.toBe('my-value');
});

test('set with expire', async () => {
  await cache.set('my-key', 'test', 10);
  await expect(cache.get('my-key')).resolves.toBe('test');
  await sleep(12);
  await expect(cache.get('my-key')).resolves.toBeNull();
});

test('add with expire', async () => {
  await expect(cache.add('my-key', 'test', 10)).resolves.toBeTruthy();
  await expect(cache.get('my-key')).resolves.toBe('test');
  await sleep(12);
  await expect(cache.get('my-key')).resolves.toBeNull();
  await expect(cache.add('my-key', 'test-1', 10)).resolves.toBeTruthy();
  await expect(cache.get('my-key')).resolves.toBe('test-1');
});

test('getOrSet', async () => {
  await expect(cache.getOrSet('my-key', () => 'value')).resolves.toBe('value');
  await expect(cache.getOrSet('my-key', () => 'value-123')).resolves.toBe(
    'value',
  );
  await expect(cache.get('my-key')).resolves.toBe('value');
});

test('getOrSet with expire', async () => {
  await cache.getOrSet('my-key', () => 'test', 10);
  await expect(cache.get('my-key')).resolves.toBe('test');
  await sleep(12);
  await expect(cache.getOrSet('my-key', () => 'test2')).resolves.toBe('test2');
});

test('exists', async () => {
  await expect(cache.exists('my-key')).resolves.toBeFalsy();
  await cache.set('my-key', 'my-value');
  await expect(cache.exists('my-key')).resolves.toBeTruthy();
});

test('not exists when key expired', async () => {
  await expect(cache.exists('my-key')).resolves.toBeFalsy();
  await cache.set('my-key', 'my-value', 10);
  await expect(cache.exists('my-key')).resolves.toBeTruthy();
  await sleep(11);
  await expect(cache.exists('my-key')).resolves.toBeFalsy();
});

test('should delete specific key', async () => {
  await cache.set('my-key', 'my-value');
  await expect(cache.get('my-key')).resolves.toBe('my-value');
  await cache.delete('my-key');
  await expect(cache.get('my-key')).resolves.toBeNull();
});

test('should not delete unrelated key', async () => {
  await cache.set('my-key', 'my-value');
  await cache.delete('other-key');
  await expect(cache.get('my-key')).resolves.toBe('my-value');
});

describe('flush db', () => {
  test('flush keys with specific cache prefix', async () => {
    const cache = new RedisCache({
      redis: {
        url: 'redis://localhost:6379',
        database: 7,
      },
      keyPrefix: 'bbb-',
    });

    await cache.set('key-a', 'value');
    await cache.redis.set('key-b', 'value');
    await cache.deleteAll();
    await expect(cache.exists('key-a')).resolves.toBeFalsy();
    await expect(cache.redis.exists('key-b')).resolves.toBe(1);
  });

  test('flush all keys without prefix', async () => {
    await cache.set('my-key', 'my-value');
    await cache.set('next-key', 'my-value');
    await cache.redis.set('redis-key', 'value');
    await cache.deleteAll();
    await expect(cache.get('my-key')).resolves.toBeNull();
    await expect(cache.get('next-key')).resolves.toBeNull();
    await expect(cache.redis.get('redis-key')).resolves.toBeNull();
  });

  test('not flush other db', async () => {
    const redis1 = createClient({
      url: 'redis://localhost:6379',
      database: 8,
    });
    await redis1.connect();

    await cache.set('key-a', 'value');
    await redis1.set('key-b', 'value');
    await cache.deleteAll();
    await expect(cache.exists('key-a')).resolves.toBeFalsy();
    await expect(redis1.exists('key-b')).resolves.toBe(1);
  });

  test('empty keys', async () => {
    await expect(cache.deleteAll()).resolves.toBeTruthy();
  });
});

test('convert key to md5', async () => {
  const key = '-'.repeat(33);
  await cache.set(key, 'value');
  await expect(
    cache.get(createHash('md5').update('x').digest('hex')),
  ).resolves.not.toBe('value');
  await expect(
    cache.get(createHash('md5').update(key).digest('hex')),
  ).resolves.toBe('value');
});
