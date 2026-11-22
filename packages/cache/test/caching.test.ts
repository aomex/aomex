import { describe, expect, test, vitest } from 'vitest';
import { sleep } from '@aomex/common';
import { MockStore } from './mock/caching.mock';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';
import { CacheKey, Caching, SINGLE_FLIGHT_LOCK_MS } from '../src';

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

test('原子获取并删除', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'getAndDeleteValue')
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => '"bar"')
    .mockImplementationOnce(async () => '"baz"');

  await expect(caching.getAndDelete('foo')).resolves.toBeNull();
  await expect(caching.getAndDelete('foo')).resolves.toBe('bar');
  await expect(caching.getAndDelete(new CacheKey().key('foo'))).resolves.toBe('baz');
  expect(spy).toHaveBeenLastCalledWith('foo');

  spy.mockRestore();
});

test('原子获取并删除时携带默认值', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'getAndDeleteValue')
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => '"bar"');

  await expect(caching.getAndDelete('foo', 'default')).resolves.toBe('default');
  await expect(caching.getAndDelete('foo', 'default')).resolves.toBe('bar');

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

describe('singleFlight', () => {
  test('单次调用执行 factory 并返回结果', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest.fn(async () => 'hello');

    await expect(cache.singleFlight('k', spy)).resolves.toBe('hello');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('并发调用只执行一次 factory，结果共享', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest.fn(async () => {
      await sleep(50);
      return { n: 42 };
    });

    const results = await Promise.all([
      cache.singleFlight('same', spy),
      cache.singleFlight('same', spy),
      cache.singleFlight('same', spy),
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(results).toEqual([{ n: 42 }, { n: 42 }, { n: 42 }]);
  });

  test('不写入用户 key，飞行结束后再次调用会重新执行', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    let n = 0;
    const spy = vitest.fn(async () => ++n);

    await expect(cache.singleFlight('k', spy)).resolves.toBe(1);
    await expect(cache.get('k')).resolves.toBeNull();
    await expect(cache.singleFlight('k', spy)).resolves.toBe(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('可共享 null 结果', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest.fn(async () => {
      await sleep(30);
      return null;
    });

    const results = await Promise.all([
      cache.singleFlight('null-key', spy),
      cache.singleFlight('null-key', spy),
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(results).toEqual([null, null]);
  });

  test('执行方抛错时等待方收到相同错误文案', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    let started = 0;
    const spy = vitest.fn(async () => {
      started += 1;
      await sleep(40);
      throw new Error('boom-sf');
    });

    const p1 = cache.singleFlight('err', spy);
    // 让 winner 先抢到锁
    await sleep(5);
    const p2 = cache.singleFlight('err', spy);

    await expect(p1).rejects.toThrow('boom-sf');
    await expect(p2).rejects.toThrow('boom-sf');
    expect(started).toBe(1);
  });

  test('非 Error 抛值时等待方收到 String 后的文案', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest.fn(async () => {
      await sleep(40);
      throw 'raw-fail';
    });

    const p1 = cache.singleFlight('raw-err', spy);
    await sleep(5);
    const p2 = cache.singleFlight('raw-err', spy);

    await expect(p1).rejects.toBe('raw-fail');
    await expect(p2).rejects.toThrow('raw-fail');
  });

  test('等待方读不到结果时重新竞争执行', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest.fn(async () => 'after-retry');
    const setNx = vitest
      .spyOn(cache, 'setNX')
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    const exists = vitest.spyOn(cache, 'exists').mockResolvedValueOnce(false);
    const get = vitest.spyOn(cache, 'get').mockResolvedValueOnce(null);

    await expect(cache.singleFlight('orphan', spy)).resolves.toBe('after-retry');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(setNx).toHaveBeenCalledTimes(2);
    expect(exists).toHaveBeenCalled();
    expect(get).toHaveBeenCalled();

    setNx.mockRestore();
    exists.mockRestore();
    get.mockRestore();
  });

  test('连续读不到结果时抛错，不无限重试', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest.fn(async () => 'never');
    const setNx = vitest.spyOn(cache, 'setNX').mockResolvedValue(false);
    const exists = vitest.spyOn(cache, 'exists').mockResolvedValue(false);
    const get = vitest.spyOn(cache, 'get').mockResolvedValue(null);

    await expect(cache.singleFlight('exhausted', spy)).rejects.toThrow(
      /单飞未获得共享结果|singleFlight did not obtain/,
    );
    expect(spy).not.toHaveBeenCalled();
    expect(setNx).toHaveBeenCalledTimes(5);

    setNx.mockRestore();
    exists.mockRestore();
    get.mockRestore();
  });

  test('抛错后仍清理 waiting key，后续可再次竞争', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const spy = vitest
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockResolvedValueOnce('recovered');

    await expect(cache.singleFlight('retry', spy)).rejects.toThrow('first');
    await expect(cache.singleFlight('retry', spy)).resolves.toBe('recovered');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('赢锁后删除残留 resultKey，不会沿用旧错误', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const resultKey = 'stale:singleFlight:$#_result_#$';
    await cache.set(resultKey, { ok: false, e: 'stale-error' }, 60_000);

    const deleted: string[] = [];
    const deleteSpy = vitest.spyOn(cache, 'delete').mockImplementation(async (key) => {
      deleted.push(String(key));
      return Caching.prototype.delete.call(cache, key);
    });
    const spy = vitest.fn(async () => 'fresh');

    await expect(cache.singleFlight('stale', spy)).resolves.toBe('fresh');
    expect(deleted[0]).toBe(resultKey);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(await cache.get(resultKey)).toEqual({ ok: true, v: 'fresh' });

    deleteSpy.mockRestore();
  });

  test('赢锁清除残留后若未写入结果，等待方重新竞争而非读旧错误', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const resultKey = 'crash:singleFlight:$#_result_#$';
    const waitingKey = 'crash:singleFlight:$#_waiting_#$';
    await cache.set(resultKey, { ok: false, e: 'stale-error' }, 60_000);

    let swallowResultWrite = true;
    const setSpy = vitest
      .spyOn(cache, 'set')
      .mockImplementation(async (key, value, ttl) => {
        if (swallowResultWrite && key === resultKey) {
          return true;
        }
        return Caching.prototype.set.call(cache, key, value, ttl);
      });

    const spy = vitest
      .fn()
      .mockImplementationOnce(async () => {
        throw new Error('crash-before-publish');
      })
      .mockResolvedValueOnce('recovered');

    // 持锁方抛错且结果写入被吞掉 → 等价于崩溃未发布；残留已在赢锁时删掉
    await expect(cache.singleFlight('crash', spy)).rejects.toThrow(
      'crash-before-publish',
    );
    expect(await cache.get(resultKey)).toBeNull();
    expect(await cache.exists(waitingKey)).toBeFalsy();

    swallowResultWrite = false;
    await expect(cache.singleFlight('crash', spy)).resolves.toBe('recovered');
    expect(spy).toHaveBeenCalledTimes(2);

    setSpy.mockRestore();
  });

  test('持锁期间会心跳续期', async () => {
    vitest.useFakeTimers();
    const cache = new Caching(new CacheMemoryAdapter());
    const expire = vitest.spyOn(cache, 'expire');
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const pending = cache.singleFlight('hb', async () => {
      await gate;
      return 'ok';
    });

    await vitest.advanceTimersByTimeAsync(SINGLE_FLIGHT_LOCK_MS / 5);
    expect(expire).toHaveBeenCalledWith(
      'hb:singleFlight:$#_waiting_#$',
      SINGLE_FLIGHT_LOCK_MS,
    );

    release();
    await expect(pending).resolves.toBe('ok');
    expire.mockRestore();
    vitest.useRealTimers();
  });

  test('接受 CacheKey', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const key = new CacheKey().key('sf', 'a');
    await expect(cache.singleFlight(key, async () => 'x')).resolves.toBe('x');
  });

  test('不同 key 互不影响', async () => {
    const cache = new Caching(new CacheMemoryAdapter());
    const a = vitest.fn(async () => {
      await sleep(40);
      return 'A';
    });
    const b = vitest.fn(async () => {
      await sleep(40);
      return 'B';
    });

    const [ra, rb] = await Promise.all([
      cache.singleFlight('ka', a),
      cache.singleFlight('kb', b),
    ]);

    expect(ra).toBe('A');
    expect(rb).toBe('B');
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
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
