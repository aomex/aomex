import { combineServices, internalDestroyServices } from '@aomex/common';
import { afterEach, expect, test, vitest } from 'vitest';
import { BaseCacheService, createRemember, type CacheAdapter } from '../src';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';

afterEach(() => {
  vitest.restoreAllMocks();
});

test('onInit 调用 createAdapter 并 connect', async () => {
  const connect = vitest.fn(async () => {});
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      const adapter = new CacheMemoryAdapter();
      adapter.connect = connect;
      return adapter;
    }
    async ping() {
      return 'pong';
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  expect(connect).not.toHaveBeenCalled();
  await expect(services.cache.ping()).resolves.toBe('pong');
  expect(connect).toHaveBeenCalledOnce();
});

test('onDestroy 调用 adapter.disconnect', async () => {
  const disconnect = vitest.fn(async () => {});
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      const adapter = new CacheMemoryAdapter();
      adapter.disconnect = disconnect;
      return adapter;
    }
    async ping() {
      return 1;
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  await services.cache.ping();
  await internalDestroyServices([services]);
  expect(disconnect).toHaveBeenCalledOnce();
});

test('业务方法可通过 this.cache 读写', async () => {
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
    async load(id: number) {
      const key = this.concat('item', id);
      const hit = await this.cache.get<{ id: number }>(key);
      if (hit) return hit;
      const value = { id };
      await this.cache.set(key, value, this.ttl.MINUTE);
      return value;
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  await expect(services.cache.load(1)).resolves.toEqual({ id: 1 });
  await expect(services.cache.load(1)).resolves.toEqual({ id: 1 });
});

test('concat 用冒号拼接片段', async () => {
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
    build(...parts: Array<string | number>) {
      return this.concat(...parts);
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  await expect(services.cache.build('item', 1)).resolves.toBe('item:1');
  await expect(services.cache.build('a', 'b', 'c')).resolves.toBe('a:b:c');
  await expect(services.cache.build('only')).resolves.toBe('only');
  await expect(services.cache.build()).resolves.toBe('');
});

test('hash 返回 md5 hex', async () => {
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
    md5(key: string | number) {
      return this.hash(key);
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  await expect(services.cache.md5('hello')).resolves.toBe(
    '5d41402abc4b2a76b9719d911017c592',
  );
  await expect(services.cache.md5(123)).resolves.toBe('202cb962ac59075b964b07152d234b70');
});

test('ttl 提供分钟到年的毫秒常量', async () => {
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
    readTtl() {
      return this.ttl;
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  await expect(services.cache.readTtl()).resolves.toEqual({
    SECOND: 1_000,
    MINUTE: 60_000,
    HOUR: 3_600_000,
    DAY: 86_400_000,
    WEEK: 604_800_000,
    MONTH: 2_592_000_000,
    YEAR: 31_536_000_000,
  });
});

test('未加载实例时 destroy 不报错', async () => {
  class DemoCacheService extends BaseCacheService {
    protected createAdapter(): CacheAdapter {
      return new CacheMemoryAdapter();
    }
  }

  const services = await combineServices({
    cache: async () => DemoCacheService,
  });
  await expect(internalDestroyServices([services])).resolves.toBeUndefined();
});

test('eager 预初始化后 remember 可立即使用', async () => {
  let builds = 0;

  class CacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
    async touch() {
      return true;
    }
  }

  const remember = createRemember(CacheService);

  class Report {
    @remember({ key: 'report', duration: 60_000 })
    async build() {
      builds += 1;
      return { ok: true as const };
    }
  }

  const services = await combineServices(
    { cache: async () => CacheService },
    { eager: ['cache'] },
  );
  await expect(new Report().build()).resolves.toEqual({ ok: true });
  await expect(new Report().build()).resolves.toEqual({ ok: true });
  expect(builds).toBe(1);
  await internalDestroyServices([services]);
  await expect(new Report().build()).rejects.toThrow();
});
