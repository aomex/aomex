import { describe, expect, test, vitest } from 'vitest';
import { MockStore } from './mock/caching.mock';
import { Caching } from '../src';
import sleep from 'sleep-promise';

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

  spy.mockRestore();
});

test('获取值', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'getValue')
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => '"bar"');

  await expect(caching.get('foo')).resolves.toBeNull();
  await expect(caching.get('foo')).resolves.toBe('bar');

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

  spy.mockRestore();
});

test('判断存在', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'existsKey')
    .mockImplementationOnce(async () => true)
    .mockImplementationOnce(async () => false);

  await expect(caching.exists('foo1')).resolves.toBeTruthy();
  expect(spy).toHaveBeenLastCalledWith('foo1');
  await expect(caching.exists('foo2')).resolves.toBeFalsy();
  expect(spy).toHaveBeenLastCalledWith('foo2');

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
  expect(spy).toBeCalledWith('foo');

  spy.mockRestore();
});

test('删除', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'deleteValue')
    .mockImplementation(async () => true);

  await expect(caching.delete('foo')).resolves.toBeTruthy();
  expect(spy).toBeCalledWith('foo');

  spy.mockRestore();
});

test('删除全部', async () => {
  const spy = vitest
    .spyOn(MockStore.prototype, 'deleteAllValues')
    .mockImplementation(async () => true);

  await expect(caching.deleteAll()).resolves.toBeTruthy();
  expect(spy).toBeCalledWith();

  spy.mockRestore();
});

describe('复杂对象', () => {
  test('保存Map', async () => {
    const spy = vitest
      .spyOn(MockStore.prototype, 'setValue')
      // @ts-expect-error
      .mockImplementation(() => true);

    const map = new Map();
    map.set('foo', 'bar');

    await caching.set('foo', map);
    expect(spy).toHaveBeenLastCalledWith(
      'foo',
      '{"_$caching_type$_":"Map","_$caching_data$_":[["foo","bar"]]}',
      undefined,
    );
    expect(spy).toHaveReturnedWith(true);
    spy.mockRestore();
  });

  test('保存Set', async () => {
    const spy = vitest
      .spyOn(MockStore.prototype, 'setValue')
      // @ts-expect-error
      .mockImplementation(() => true);

    const set = new Set();
    set.add('a');
    set.add('bcc');

    await caching.set('foo', set);
    expect(spy).toHaveBeenLastCalledWith(
      'foo',
      '{"_$caching_type$_":"Set","_$caching_data$_":["a","bcc"]}',
      undefined,
    );
    expect(spy).toHaveReturnedWith(true);
    spy.mockRestore();
  });

  test('恢复Map', async () => {
    const spy = vitest
      .spyOn(MockStore.prototype, 'getValue')
      .mockImplementation(
        async () => '{"_$caching_type$_":"Map","_$caching_data$_":[["foo","bar"]]}',
      );

    const result = await caching.get<Map<any, any>>('foo');
    expect(result).toBeInstanceOf(Map);
    expect(Array.from(result!.entries())).toStrictEqual([['foo', 'bar']]);

    spy.mockRestore();
  });

  test('恢复Set', async () => {
    const spy = vitest
      .spyOn(MockStore.prototype, 'getValue')
      .mockImplementation(
        async () => '{"_$caching_type$_":"Set","_$caching_data$_":["a","bcc"]}',
      );

    const result = await caching.get<Set<any>>('foo');
    expect(result).toBeInstanceOf(Set);
    expect(Array.from(result!.values())).toStrictEqual(['a', 'bcc']);

    spy.mockRestore();
  });
});

describe('装饰器', () => {
  test('没有缓存时请求原始数据', async () => {
    const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
    const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);

    class MyClass {
      @caching.decorate({ key: 'key', duration: 1000 })
      async getData() {
        return 'foo-bar';
      }
    }
    const my = new MyClass();
    const result = await my.getData();
    expect(result).toBe('foo-bar');
    expect(getSpy).toBeCalledTimes(1);
    expect(getSpy).toBeCalledWith('key');
    expect(setSpy).toBeCalledTimes(1);
    expect(setSpy).toBeCalledWith('key', 'foo-bar', 1000);

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  test('有缓存时直接用缓存', async () => {
    const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => 'foo');
    const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);
    const spy = vitest.fn();

    class MyClass {
      @caching.decorate({ key: 'key', duration: 1000 })
      async getData() {
        spy();
        return 'foo-bar';
      }
    }
    const my = new MyClass();
    const result = await my.getData();
    expect(result).toBe('foo');
    expect(getSpy).toBeCalledTimes(1);
    expect(getSpy).toBeCalledWith('key');
    expect(setSpy).toBeCalledTimes(0);
    expect(spy).toBeCalledTimes(0);

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  test('多个调用时，只获取一次数据源', async () => {
    const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
    const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);
    const spy = vitest.fn();

    class MyClass {
      @caching.decorate({ key: 'key', duration: 1000 })
      async getData() {
        await sleep(1500);
        spy();
        return 'foo-bar';
      }
    }
    const my = new MyClass();
    const result = await Promise.all([my.getData(), my.getData(), my.getData()]);

    expect(spy).toBeCalledTimes(1);
    expect(setSpy).toBeCalledTimes(1);
    expect(getSpy).toBeCalledTimes(3);
    expect(result).toMatchObject(['foo-bar', 'foo-bar', 'foo-bar']);

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  test('动态键', async () => {
    const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
    const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);
    const spy = vitest.fn().mockImplementation(() => 'x');

    class MyClass {
      @caching.decorate({ key: spy, duration: 1000 })
      async getData(id: number | string) {
        await sleep(1500);
        return 'foo-bar-' + id;
      }
    }
    const my = new MyClass();
    await Promise.all([my.getData(1), my.getData(2), my.getData(3), my.getData('abc')]);

    expect(spy).toBeCalledTimes(4);
    expect(spy).toBeCalledWith(1);
    expect(spy).toBeCalledWith(2);
    expect(spy).toBeCalledWith(3);
    expect(spy).toBeCalledWith('abc');

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  test('默认值', async () => {
    const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
    const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);

    class MyClass {
      @caching.decorate({ key: 'key', defaultValue: 'foo', duration: 1000 })
      async getData() {
        return null;
      }
    }
    const my = new MyClass();
    const result = await my.getData();
    expect(result).toBe('foo');
    expect(getSpy).toBeCalledTimes(1);
    expect(setSpy).toBeCalledTimes(0);

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  test('默认的键', async () => {
    const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
    class MyClass {
      @caching.decorate({ duration: 1000 })
      async getData() {
        return null;
      }

      @caching.decorate({ duration: 1000 })
      async getData2(_a: string, _b: number, _c: object) {
        return null;
      }
    }
    const my = new MyClass();
    await my.getData();
    expect(getSpy).toHaveBeenLastCalledWith('MyClass-getData-[]');

    await my.getData2('abcd', 123, { hello: 'world', foo: 'bar' });
    expect(getSpy).toHaveBeenLastCalledWith(
      'MyClass-getData2-["abcd",123,{"hello":"world","foo":"bar"}]',
    );

    getSpy.mockRestore();
  });
});
