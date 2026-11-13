import { afterEach, beforeEach, expect, test, vitest, type MockInstance } from 'vitest';
import sleep from 'sleep-promise';
import { BaseCacheService, Caching, remember } from '../src';
import { MockStore } from './mock/caching.mock';

class DemoCacheService extends BaseCacheService {
  protected createAdapter() {
    return new MockStore();
  }
}

async function createCacheService() {
  const service = new DemoCacheService();
  await service['onInit']();
  return service;
}

let cacheService: DemoCacheService;
let caching: Caching;

let deleteSpy: MockInstance;
let existSpy: MockInstance;
let setNxSpy: MockInstance;

beforeEach(async () => {
  remember.deleteInstance();
  cacheService = await createCacheService();
  caching = cacheService['_cache'];
  remember.setInstance(cacheService);
  deleteSpy = vitest.spyOn(caching, 'delete').mockResolvedValue(true);
  existSpy = vitest.spyOn(caching, 'exists').mockResolvedValue(true);
  setNxSpy = vitest
    .spyOn(caching, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);

  sleep(2_000).then(() => {
    existSpy.mockReset().mockResolvedValue(false);
  });
});

afterEach(async () => {
  deleteSpy.mockRestore();
  existSpy.mockRestore();
  setNxSpy.mockRestore();
  remember.deleteInstance();
  await cacheService['onDestroy']();
});

test('只允许登记一个 BaseCacheService 实例', async () => {
  remember.setInstance(cacheService);
  const other = await createCacheService();
  expect(() => remember.setInstance(other)).toThrow('Only one cache service is allowed');
  await other['onDestroy']();
});

test('setInstance 同实例幂等', () => {
  expect(() => {
    remember.setInstance(cacheService);
    remember.setInstance(cacheService);
  }).not.toThrow();
});

test('fork 拥有独立作用域', async () => {
  const otherService = await createCacheService();
  const other = otherService['_cache'];
  const rememberB = remember.fork();
  rememberB.setInstance(otherService);

  const getA = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setA = vitest.spyOn(caching, 'set').mockResolvedValue(true);
  const setNxA = vitest.spyOn(caching, 'setNX').mockResolvedValue(true);
  const deleteA = vitest.spyOn(caching, 'delete').mockResolvedValue(true);
  const getB = vitest.spyOn(other, 'get').mockResolvedValue(null);
  const setB = vitest.spyOn(other, 'set').mockResolvedValue(true);
  const setNxB = vitest.spyOn(other, 'setNX').mockResolvedValue(true);
  const deleteB = vitest.spyOn(other, 'delete').mockResolvedValue(true);

  class WithA {
    @remember({ key: 'a', duration: 1000 })
    async load() {
      return 'from-a';
    }
  }
  class WithB {
    @rememberB({ key: 'b', duration: 1000 })
    async load() {
      return 'from-b';
    }
  }

  await expect(new WithA().load()).resolves.toBe('from-a');
  await expect(new WithB().load()).resolves.toBe('from-b');
  expect(setA).toHaveBeenCalledWith('a', 'from-a', 1000);
  expect(setB).toHaveBeenCalledWith('b', 'from-b', 1000);
  expect(getA).toHaveBeenCalled();
  expect(getB).toHaveBeenCalled();
  expect(setNxA).toHaveBeenCalled();
  expect(setNxB).toHaveBeenCalled();

  expect(() => remember.setInstance(otherService)).toThrow(
    'Only one cache service is allowed',
  );
  expect(() => rememberB.setInstance(cacheService)).toThrow(
    'Only one cache service is allowed',
  );

  rememberB.deleteInstance();
  getA.mockRestore();
  setA.mockRestore();
  setNxA.mockRestore();
  deleteA.mockRestore();
  getB.mockRestore();
  setB.mockRestore();
  setNxB.mockRestore();
  deleteB.mockRestore();
  await otherService['onDestroy']();
});

test('没有缓存时请求原始数据', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
  const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);
  const setNxSpy = vitest
    .spyOn(caching, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      return 'foo-bar';
    }
  }
  const my = new MyClass();
  const result = await my.getData();
  expect(result).toBe('foo-bar');
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(getSpy).toHaveBeenCalledWith('key');
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenCalledWith('key', 'foo-bar', 1000);

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpy.mockRestore();
});

test('有缓存时直接用缓存', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => 'foo');
  const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);
  const spy = vitest.fn();

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      spy();
      return 'foo-bar';
    }
  }
  const my = new MyClass();
  const result = await my.getData();
  expect(result).toBe('foo');
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(getSpy).toHaveBeenCalledWith('key');
  expect(setSpy).toHaveBeenCalledTimes(0);
  expect(spy).toHaveBeenCalledTimes(0);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('并发调用时，只获取一次数据源', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(caching, 'set').mockResolvedValue(true);
  const spy = vitest.fn();

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      await sleep(1500);
      spy();
      return 'foo-bar';
    }
  }
  const my = new MyClass();

  sleep(1500).then(() => {
    getSpy.mockReset().mockResolvedValue('a-foo');
  });

  const result = await Promise.all([my.getData(), my.getData(), my.getData()]);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(result).toMatchObject(['foo-bar', 'a-foo', 'a-foo']);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('不同客户端并发调用时，只获取一次数据源', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(caching, 'set').mockResolvedValue(true);
  const spy1 = vitest.fn();
  const spy2 = vitest.fn();

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      await sleep(1500);
      spy1();
      return 'foo-bar';
    }

    @remember({ key: 'key', duration: 1200 })
    async getData1() {
      await sleep(1500);
      spy2();
      return 'bar';
    }
  }
  const my = new MyClass();

  sleep(1500).then(() => {
    getSpy.mockReset().mockResolvedValue('a-foo');
  });

  const result = await Promise.all([
    my.getData(),
    my.getData1(),
    my.getData(),
    my.getData1(),
  ]);

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(0);
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(result).toMatchObject(['foo-bar', 'a-foo', 'a-foo', 'a-foo']);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('动态键', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(caching, 'set').mockResolvedValue(true);
  const spy = vitest.fn().mockImplementation(() => 'x');

  class MyClass {
    @remember({ key: spy, duration: 1000 })
    async getData(id: number | string) {
      await sleep(1500);
      return 'foo-bar-' + id;
    }
  }
  const my = new MyClass();
  await Promise.all([my.getData(1), my.getData(2), my.getData(3), my.getData('abc')]);

  expect(spy).toHaveBeenCalledTimes(4);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(2);
  expect(spy).toHaveBeenCalledWith(3);
  expect(spy).toHaveBeenCalledWith('abc');

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('默认值', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(caching, 'set').mockResolvedValue(true);

  class MyClass {
    @remember({ key: 'key', defaultValue: 'foo', duration: 1000 })
    async getData() {
      return null;
    }
  }
  const my = new MyClass();
  const result = await my.getData();
  expect(result).toBe('foo');
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenCalledTimes(0);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('默认的键', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  class MyClass {
    @remember({ duration: 1000 })
    async getData() {
      return null;
    }

    @remember({ duration: 1000 })
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
    null,
  );

  getSpy.mockRestore();
});

test('只传数字等同于 duration', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockImplementation(async () => null);
  const setSpy = vitest.spyOn(caching, 'set').mockImplementation(async () => true);
  const setNxSpy = vitest
    .spyOn(caching, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);

  class MyClass {
    @remember(1000)
    async getData() {
      return 'foo-bar';
    }
  }
  const my = new MyClass();
  await expect(my.getData()).resolves.toBe('foo-bar');
  expect(setSpy).toHaveBeenCalledWith('MyClass-getData-[]', 'foo-bar', 1000);

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpy.mockRestore();
});

test('未登记 BaseCacheService 时抛错', async () => {
  remember.deleteInstance();
  class MyClass {
    @remember(1000)
    async getData() {
      return 'x';
    }
  }
  await expect(new MyClass().getData()).rejects.toThrow(
    'Cache service is not registered; call remember.setInstance(service) first',
  );
});

test('默认键优先使用 displayName', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  class MyClass {
    displayName = 'Alias';
    @remember({ duration: 1000 })
    async getData() {
      return null;
    }
  }
  await new MyClass().getData();
  expect(getSpy).toHaveBeenLastCalledWith('Alias-getData-[]');
  getSpy.mockRestore();
});

test('返回 null 且无 defaultValue 时不写入缓存', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(caching, 'set').mockResolvedValue(true);
  const setNxSpy = vitest.spyOn(caching, 'setNX').mockResolvedValue(true);

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      return null;
    }
  }
  await expect(new MyClass().getData()).resolves.toBeNull();
  expect(setSpy).not.toHaveBeenCalled();

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpy.mockRestore();
});

test('原方法抛错时仍清理 waiting key', async () => {
  const getSpy = vitest.spyOn(caching, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(caching, 'set').mockResolvedValue(true);
  const setNxSpy = vitest.spyOn(caching, 'setNX').mockResolvedValue(true);
  const deleteSpyLocal = vitest.spyOn(caching, 'delete').mockResolvedValue(true);

  class MyClass {
    @remember({ key: 'boom', duration: 1000 })
    async getData(): Promise<string> {
      throw new Error('boom');
    }
  }
  await expect(new MyClass().getData()).rejects.toThrow('boom');
  expect(setSpy).not.toHaveBeenCalled();
  expect(deleteSpyLocal).toHaveBeenCalledWith('boom:$#_waiting_#$');

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpy.mockRestore();
  deleteSpyLocal.mockRestore();
});

test('fork 再 fork 仍是独立作用域', async () => {
  const a = remember.fork();
  const b = a.fork();
  const svcA = await createCacheService();
  const svcB = await createCacheService();
  a.setInstance(svcA);
  b.setInstance(svcB);
  expect(() => a.setInstance(svcB)).toThrow('Only one cache service is allowed');
  expect(() => b.setInstance(svcA)).toThrow('Only one cache service is allowed');
  a.deleteInstance();
  b.deleteInstance();
  await svcA['onDestroy']();
  await svcB['onDestroy']();
});
