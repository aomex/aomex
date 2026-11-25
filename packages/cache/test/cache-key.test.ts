import { createHash } from 'node:crypto';
import { expect, test } from 'vitest';
import { CacheKey } from '../src';

test('key 用冒号拼接片段', () => {
  const key = new CacheKey();
  expect(key.key('item', 1)['value']).toBe('item:1');
  expect(key.key('a', 'b', 'c')['value']).toBe('a:b:c');
  expect(key.key('only')['value']).toBe('only');
  expect(key.key()['value']).toBe('');
  expect(key.key(0, 'x')['value']).toBe('0:x');
});

test('key 保留已有前缀', () => {
  const key = new CacheKey('user');
  expect(key.key(1)['value']).toBe('user:1');
  expect(key.key('a', 'b')['value']).toBe('user:a:b');
  expect(key.key()['value']).toBe('user');
  expect(new CacheKey('a:b').key('c')['value']).toBe('a:b:c');
});

test('keyHash 无前缀时对本次参数 md5', () => {
  const key = new CacheKey();
  expect(key.keyHash('user', 1)['value']).toBe(
    createHash('md5').update('user:1').digest('hex'),
  );
  expect(key.keyHash('a', 'b', 'c')['value']).toBe(
    createHash('md5').update('a:b:c').digest('hex'),
  );
  expect(key.keyHash()['value']).toBe(createHash('md5').update('').digest('hex'));
  expect(key.keyHash('hello')['value']).toBe('5d41402abc4b2a76b9719d911017c592');
  expect(key.keyHash(123)['value']).toBe('202cb962ac59075b964b07152d234b70');
});

test('keyHash 只 md5 最新参数并保留前缀', () => {
  const key = new CacheKey('user');
  expect(key.keyHash(1)['value']).toBe(
    `user:${createHash('md5').update('1').digest('hex')}`,
  );
  expect(key.keyHash('a', 'b')['value']).toBe(
    `user:${createHash('md5').update('a:b').digest('hex')}`,
  );
  expect(key.keyHash()['value']).toBe(
    `user:${createHash('md5').update('').digest('hex')}`,
  );
  expect(new CacheKey('a:b').keyHash('c')['value']).toBe(
    `a:b:${createHash('md5').update('c').digest('hex')}`,
  );
});

test('toHash 对当前完整键做 md5', () => {
  expect(CacheKey.key('user', 1).toHash()['value']).toBe(
    createHash('md5').update('user:1').digest('hex'),
  );
  expect(new CacheKey('user').key(1).key('profile').toHash()['value']).toBe(
    createHash('md5').update('user:1:profile').digest('hex'),
  );
  expect(new CacheKey().toHash()['value']).toBe(
    createHash('md5').update('').digest('hex'),
  );
  expect(CacheKey.key('user', 1).toHash()['value']).toBe(
    CacheKey.keyHash('user', 1)['value'],
  );
  expect(new CacheKey('user').keyHash(1).toHash()['value']).toBe(
    createHash('md5')
      .update(`user:${createHash('md5').update('1').digest('hex')}`)
      .digest('hex'),
  );
});

test('key/keyHash/toHash 返回新的 CacheKey 实例', () => {
  const key = new CacheKey('seed');
  const a = key.key('a');
  const c = key.keyHash('c');
  const h = key.toHash();
  expect(a).toBeInstanceOf(CacheKey);
  expect(c).toBeInstanceOf(CacheKey);
  expect(h).toBeInstanceOf(CacheKey);
  expect(a).not.toBe(key);
  expect(c).not.toBe(key);
  expect(h).not.toBe(key);
});

test('构造时可带初始 value', () => {
  expect(new CacheKey('preset')['value']).toBe('preset');
  expect(new CacheKey()['value']).toBe('');
});

test('静态 key / keyHash 入口', () => {
  expect(CacheKey.key()['value']).toBe('');
  expect(CacheKey.key('user', 1)['value']).toBe('user:1');
  expect(CacheKey.key('user').key(1)['value']).toBe('user:1');
  expect(CacheKey.keyHash('user', 1)['value']).toBe(
    createHash('md5').update('user:1').digest('hex'),
  );
  expect(CacheKey.keyHash('user', 1)['value']).toBe(
    CacheKey.key('user', 1).toHash()['value'],
  );
});
