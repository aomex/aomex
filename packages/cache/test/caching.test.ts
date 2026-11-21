import { describe, expect, test, vitest } from 'vitest';
import { MockStore } from './mock/caching.mock';
import { CacheKey, Caching } from '../src';

const caching = new Caching(new MockStore());

test('设置值', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'setValue')
    // @ts-expect-error
    .mockImplementation(() => true);

  await caching.set('foo', 'bar');
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', undefined);
  expect(spy).toHaveReturnedWith(true);

  await caching.set('foo', ['bar']);
  expect(spy).toHaveBeenLastCalledWith('foo', '["bar"]', undefined);

  await caching.set('foo', { foo: 'bar' });
  expect(spy).toHaveBeenLastCalledWith('foo', '{"foo":"bar"}', undefined);

  await caching.set('foo', 'bar', 20);
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 20);

  await caching.set('foo', 'bar', '1 minute');
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 60_000);

  await caching.set('foo', 'bar', '500ms');
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 500);

  const key = new CacheKey().key('ns', 'foo');
  await caching.set(key, 'bar', 30);
  expect(spy).toHaveBeenLastCalledWith('ns:foo', '"bar"', 30);

  await expect(caching.set('foo', 'bar', 'bad' as `${number}ms`)).rejects.toThrow(
    /无效的时长/,
  );

  spy.mockRestore();
});

test('获取值', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'getValue')
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => '"bar"')
    .mockImplementationOnce(async () => '"baz"');

  await expect(caching.get('foo')).resolves.toBeNull();
  await expect(caching.get('foo')).resolves.toBe('bar');
  await expect(caching.get(new CacheKey().key('foo'))).resolves.toBe('baz');
  expect(spy).toHaveBeenLastCalledWith('foo');

  spy.mockRestore();
});

test('获取时携带默认值', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'getValue')
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => '"bar"');

  await expect(caching.get('foo', 'default')).resolves.toBe('default');
  await expect(caching.get('foo', 'default')).resolves.toBe('bar');

  spy.mockRestore();
});

test('不存在才设置', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'setNotExistValue')
    .mockImplementation(async () => true);

  await expect(caching.setNX('foo', 'bar')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', undefined);
  await expect(caching.setNX('foo', 'bar', 200)).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 200);
  await expect(caching.setNX('foo', 'bar', '20 seconds')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', 20_000);

  spy.mockRestore();
});

test('判断存在', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'existsKey')
    .mockImplementationOnce(async () => true)
    .mockImplementationOnce(async () => false)
    .mockImplementationOnce(async () => true);

  await expect(caching.exists('foo1')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo1');
  await expect(caching.exists('foo2')).resolves.toBeFalsy();
  expect(spy).toHaveBeenLastCalledWith('foo2');
  const hashed = new CacheKey().keyHash('a', 1);
  await expect(caching.exists(hashed)).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith(hashed['value']);
  expect(hashed['value']).toMatch(/^[a-f0-9]{32}$/);

  spy.mockRestore();
});

test('自增', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'increaseValue')
    .mockImplementation(async () => 1);

  await expect(caching.increment('foo')).resolves.toBe(1);
  expect(spy).toHaveBeenLastCalledWith('foo');

  spy.mockRestore();
});

test('自减', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'decreaseValue')
    .mockImplementation(async () => 1);

  await expect(caching.decrement('foo')).resolves.toBe(1);
  expect(spy).toHaveBeenLastCalledWith('foo');

  spy.mockRestore();
});

test('设置过期时间', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'expireKey')
    .mockImplementation(async () => true);

  await expect(caching.expire('foo', 20)).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', 20);
  await expect(caching.expire('foo', '1.5 hours')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', 5_400_000);
  await expect(caching.expire('foo', '2 months')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', 5_184_000_000);

  spy.mockRestore();
});

test('查看剩余时间', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'ttlKey')
    .mockImplementation(async () => 100);

  await expect(caching.ttl('foo')).resolves.toBe(100);
  expect(spy).toHaveBeenLastCalledWith('foo');

  spy.mockRestore();
});

test('数组左边推入', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'leftPushValue')
    .mockImplementation(async () => true);

  await expect(caching.leftPush('foo', 'bar', 'baz')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo', '"bar"', '"baz"');

  spy.mockRestore();
});

test('数组右边取出', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'rightPopValue')
    .mockImplementation(async () => '"bar"');

  await expect(caching.rightPop('foo')).resolves.toBe('bar');
  expect(spy).toHaveBeenCalledWith('foo');

  spy.mockRestore();
});

test('删除', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'deleteValue')
    .mockImplementation(async () => true);

  await expect(caching.delete('foo')).resolves.toBeTruthy();
  expect(spy).toHaveBeenCalledWith('foo');

  await expect(caching.delete(new CacheKey().key('bar', 2))).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('bar:2');

  spy.mockRestore();
});

test('resolveKey 将 CacheKey 转为字符串', () => {
  expect(caching['resolveKey']('plain')).toBe('plain');
  expect(caching['resolveKey'](new CacheKey().key('a', 1))).toBe('a:1');
  expect(caching['resolveKey'](new CacheKey().keyHash('x'))).toBe(
    '9dd4e461268c8034f5c8564e155c67a6',
  );
});

test('删除全部', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'deleteAllValues')
    .mockImplementation(async () => true);

  await expect(caching.deleteAll()).resolves.toBeTruthy();
  expect(spy).toHaveBeenCalledWith();

  spy.mockRestore();
});

describe('复杂对象', () => {
  test('Map', async () => {
    const result = caching['encodeValue'](new Map([['foo', 'bar']]));
    expect(result).toMatchInlineSnapshot(
      `"{"_$caching_type$_":"Map","_$caching_data$_":[["foo","bar"]]}"`,
    );
    expect(caching['decodeValue'](result)).toMatchInlineSnapshot(`
      Map {
        "foo" => "bar",
      }
    `);
  });

  test('Set', async () => {
    const result = caching['encodeValue'](new Set(['a', 'bcc']));
    expect(result).toMatchInlineSnapshot(
      `"{"_$caching_type$_":"Set","_$caching_data$_":["a","bcc"]}"`,
    );
    expect(caching['decodeValue'](result)).toMatchInlineSnapshot(`
      Set {
        "a",
        "bcc",
      }
    `);
  });

  test('Date', async () => {
    const result = caching['encodeValue'](new Date('2024-10-24T00:10:24.123Z'));
    expect(result).toMatchInlineSnapshot(
      `"{"_$caching_type$_":"Date","_$caching_data$_":"2024-10-24T00:10:24.123Z"}"`,
    );
    const resume = caching['decodeValue'](result);
    expect(resume).toMatchInlineSnapshot(`2024-10-24T00:10:24.123Z`);
    expect(resume).toBeInstanceOf(Date);
  });

  test('BigInt', async () => {
    const result = caching['encodeValue'](1234n);
    expect(result).toMatchInlineSnapshot(
      `"{"_$caching_type$_":"BigInt","_$caching_data$_":"1234"}"`,
    );
    expect(caching['decodeValue'](result)).toMatchInlineSnapshot(`1234n`);
  });

  test('深层复杂对象', async () => {
    const result = caching['encodeValue']({
      foo: 'x',
      bar: {
        baz: new Date('2024-10-24T00:10:24.123Z'),
        test2: new Map([['foo', new Set(['a', 'bcc'])]]),
        test3: {
          ok: new Set(['a', new Date('2024-10-24T00:10:24.123Z')]),
        },
        test4: [
          new Date('2024-10-24T00:10:24.123Z'),
          2,
          new Date('2024-10-24T00:10:24.123Z'),
          {
            test5: new Date('2024-10-24T00:10:24.123Z'),
          },
        ],
      },
      baz: 1234n,
    });
    expect(result).toMatchInlineSnapshot(
      `"{"foo":"x","bar":{"baz":{"_$caching_type$_":"Date","_$caching_data$_":"2024-10-24T00:10:24.123Z"},"test2":{"_$caching_type$_":"Map","_$caching_data$_":[["foo",{"_$caching_type$_":"Set","_$caching_data$_":["a","bcc"]}]]},"test3":{"ok":{"_$caching_type$_":"Set","_$caching_data$_":["a",{"_$caching_type$_":"Date","_$caching_data$_":"2024-10-24T00:10:24.123Z"}]}},"test4":[{"_$caching_type$_":"Date","_$caching_data$_":"2024-10-24T00:10:24.123Z"},2,{"_$caching_type$_":"Date","_$caching_data$_":"2024-10-24T00:10:24.123Z"},{"test5":{"_$caching_type$_":"Date","_$caching_data$_":"2024-10-24T00:10:24.123Z"}}]},"baz":{"_$caching_type$_":"BigInt","_$caching_data$_":"1234"}}"`,
    );
    expect(caching['decodeValue'](result)).toMatchInlineSnapshot(`
      {
        "bar": {
          "baz": 2024-10-24T00:10:24.123Z,
          "test2": Map {
            "foo" => Set {
              "a",
              "bcc",
            },
          },
          "test3": {
            "ok": Set {
              "a",
              2024-10-24T00:10:24.123Z,
            },
          },
          "test4": [
            2024-10-24T00:10:24.123Z,
            2,
            2024-10-24T00:10:24.123Z,
            {
              "test5": 2024-10-24T00:10:24.123Z,
            },
          ],
        },
        "baz": 1234n,
        "foo": "x",
      }
    `);
  });
});
