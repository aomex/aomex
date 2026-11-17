import { afterEach, beforeEach, expect, test, vitest, type MockInstance } from 'vitest';
import sleep from 'sleep-promise';
import { BaseCacheService, Caching, createRemember } from '../src';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';
import { i18n } from '../src/i18n';
import { attachRememberScopes, detachRememberScopes } from '../src/remember';
import { MockStore } from './mock/caching.mock';

class DemoCacheService extends BaseCacheService {
  protected createAdapter() {
    return new MockStore();
  }
}

const remember = createRemember(DemoCacheService);

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
  cacheService = await createCacheService();
  caching = cacheService['_cache'];
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
  await cacheService['onDestroy']();
});

test('同 class 后初始化的实例接管 remember，销毁旧实例不影响', async () => {
  class SwapCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const swapRemember = createRemember(SwapCacheService);
  class Host {
    @swapRemember({ key: 'swap', duration: 1000 })
    async load() {
      return 'ok';
    }
  }

  const first = new SwapCacheService();
  const second = new SwapCacheService();
  await first['onInit']();
  await second['onInit']();
  await expect(new Host().load()).resolves.toBe('ok');
  await first['onDestroy']();
  // 旧实例不是当前挂载者，销毁不应把 remember 标成 destroyed
  await expect(new Host().load()).resolves.toBe('ok');
  await second['onDestroy']();
  await expect(new Host().load()).rejects.toThrow(i18n.t('cache_service_destroyed'));
});

test('不同 CacheService 子类的 remember 互不影响', async () => {
  class CacheServiceA extends BaseCacheService {
    protected createAdapter() {
      return new MockStore();
    }
  }
  class CacheServiceB extends BaseCacheService {
    protected createAdapter() {
      return new MockStore();
    }
  }
  const rememberA = createRemember(CacheServiceA);
  const rememberB = createRemember(CacheServiceB);
  const svcA = new CacheServiceA();
  const svcB = new CacheServiceB();
  await svcA['onInit']();
  await svcB['onInit']();
  const cachingA = svcA['_cache'];
  const cachingB = svcB['_cache'];

  const getA = vitest.spyOn(cachingA, 'get').mockResolvedValue(null);
  const setA = vitest.spyOn(cachingA, 'set').mockResolvedValue(true);
  const setNxA = vitest.spyOn(cachingA, 'setNX').mockResolvedValue(true);
  const deleteA = vitest.spyOn(cachingA, 'delete').mockResolvedValue(true);
  const getB = vitest.spyOn(cachingB, 'get').mockResolvedValue(null);
  const setB = vitest.spyOn(cachingB, 'set').mockResolvedValue(true);
  const setNxB = vitest.spyOn(cachingB, 'setNX').mockResolvedValue(true);
  const deleteB = vitest.spyOn(cachingB, 'delete').mockResolvedValue(true);

  class WithA {
    @rememberA({ key: 'a', duration: 1000 })
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

  getA.mockRestore();
  setA.mockRestore();
  setNxA.mockRestore();
  deleteA.mockRestore();
  getB.mockRestore();
  setB.mockRestore();
  setNxB.mockRestore();
  deleteB.mockRestore();
  await svcA['onDestroy']();
  await svcB['onDestroy']();
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

test('onInit 的 connect 失败时，等待中的调用会收到 destroyed', async () => {
  class FailConnectCacheService extends BaseCacheService {
    protected createAdapter() {
      const adapter = new CacheMemoryAdapter();
      vitest.spyOn(adapter, 'connect').mockRejectedValue(new Error('connect failed'));
      return adapter;
    }
  }
  const failRemember = createRemember(FailConnectCacheService);
  class Host {
    @failRemember({ key: 'fail-connect', duration: 1000 })
    async load() {
      return 'ok';
    }
  }

  const pending = new Host().load();
  await sleep(50);
  const service = new FailConnectCacheService();
  await expect(service['onInit']()).rejects.toThrow('connect failed');
  await expect(pending).rejects.toThrow(i18n.t('cache_service_destroyed'));
});

test('await ready 恢复后若已销毁则抛错', async () => {
  class RaceCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const raceRemember = createRemember(RaceCacheService);
  class Host {
    @raceRemember({ key: 'race-ready', duration: 1000 })
    async load() {
      return 'ok';
    }
  }

  const pending = new Host().load();
  await sleep(50);

  const service = new RaceCacheService();
  service['_cache'] = new Caching(new CacheMemoryAdapter());
  await service['_cache'].adapter.connect();
  // 同一同步回合：先唤醒 waiter，再立刻 detach，迫使 ensureCache 复查
  attachRememberScopes(service);
  detachRememberScopes(service);

  await expect(pending).rejects.toThrow(i18n.t('cache_service_destroyed'));
});

test('初始化完成前调用会等待而不是抛错', async () => {
  class LateCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const lateRemember = createRemember(LateCacheService);

  class MyClass {
    @lateRemember({ key: 'late', duration: 1000 })
    async getData() {
      return 'ready';
    }
  }

  const pending = new MyClass().getData();
  let settled = false;
  void pending.then(() => {
    settled = true;
  });
  await sleep(50);
  expect(settled).toBe(false);

  const service = new LateCacheService();
  await service['onInit']();
  await expect(pending).resolves.toBe('ready');
  expect(settled).toBe(true);
  await service['onDestroy']();
});

test('初始化完成前多个调用都会等待并在就绪后一起成功', async () => {
  class MultiWaitCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const multiRemember = createRemember(MultiWaitCacheService);
  class Host {
    @multiRemember({ key: (id) => `multi-wait:${id}`, duration: 1000 })
    async load(id: number) {
      return id;
    }
  }

  const host = new Host();
  const pending = Promise.all([host.load(1), host.load(2), host.load(3)]);
  await sleep(50);
  const service = new MultiWaitCacheService();
  await service['onInit']();
  await expect(pending).resolves.toEqual([1, 2, 3]);
  await service['onDestroy']();
});

test('销毁后调用会抛错，再次初始化后可继续使用', async () => {
  class RestartCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const restartRemember = createRemember(RestartCacheService);
  class MyClass {
    @restartRemember({ key: 'restart', duration: 1000 })
    async getData() {
      return 'v1';
    }
  }

  const first = new RestartCacheService();
  await first['onInit']();
  await expect(new MyClass().getData()).resolves.toBe('v1');
  await first['onDestroy']();
  await expect(new MyClass().getData()).rejects.toThrow(
    i18n.t('cache_service_destroyed'),
  );
  await expect(new MyClass().getData()).rejects.toThrow(
    i18n.t('cache_service_destroyed'),
  );

  const second = new RestartCacheService();
  await second['onInit']();
  await expect(new MyClass().getData()).resolves.toBe('v1');
  await second['onDestroy']();
});

test('同 class 多次 createRemember 共用同一生命周期', async () => {
  class SharedLifeCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const rememberA = createRemember(SharedLifeCacheService);
  const rememberB = createRemember(SharedLifeCacheService);

  class HostA {
    @rememberA({ key: 'life-a', duration: 1000 })
    async load() {
      return 'a';
    }
  }
  class HostB {
    @rememberB({ key: 'life-b', duration: 1000 })
    async load() {
      return 'b';
    }
  }

  const service = new SharedLifeCacheService();
  await service['onInit']();
  await expect(new HostA().load()).resolves.toBe('a');
  await expect(new HostB().load()).resolves.toBe('b');
  await service['onDestroy']();
  await expect(new HostA().load()).rejects.toThrow(i18n.t('cache_service_destroyed'));
  await expect(new HostB().load()).rejects.toThrow(i18n.t('cache_service_destroyed'));
});

test('未 onInit 时 onDestroy 是空操作，之后仍可正常初始化', async () => {
  class IdleCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const idleRemember = createRemember(IdleCacheService);
  class Host {
    @idleRemember({ key: 'idle', duration: 1000 })
    async load() {
      return 'ok';
    }
  }

  const ghost = new IdleCacheService();
  await expect(ghost['onDestroy']()).resolves.toBeUndefined();

  const pending = new Host().load();
  const service = new IdleCacheService();
  await service['onInit']();
  await expect(pending).resolves.toBe('ok');
  await service['onDestroy']();
});

test('服务已初始化后再 createRemember 也能立即使用', async () => {
  class HotCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const service = new HotCacheService();
  await service['onInit']();
  const hotRemember = createRemember(HotCacheService);

  class MyClass {
    @hotRemember({ key: 'hot', duration: 1000 })
    async getData() {
      return 'hot';
    }
  }
  await expect(new MyClass().getData()).resolves.toBe('hot');
  await service['onDestroy']();
  await expect(new MyClass().getData()).rejects.toThrow(
    i18n.t('cache_service_destroyed'),
  );
});

test('销毁后再 createRemember 调用仍会抛错', async () => {
  class LateCreateCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const service = new LateCreateCacheService();
  await service['onInit']();
  await service['onDestroy']();

  const lateRemember = createRemember(LateCreateCacheService);
  class Host {
    @lateRemember({ key: 'late-create', duration: 1000 })
    async load() {
      return 'x';
    }
  }
  await expect(new Host().load()).rejects.toThrow(i18n.t('cache_service_destroyed'));
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
