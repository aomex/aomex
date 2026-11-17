import { type TypeEqual, expectType } from 'ts-expect';
import { BaseCacheService } from '../src/base-cache-service';
import { createRemember, type Remember } from '../src/remember';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';

{
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }

  const remember = createRemember(DemoCacheService);
  expectType<Remember>(remember);

  // @ts-expect-error 不能传入 BaseCacheService 本身
  createRemember(BaseCacheService);

  // @ts-expect-error 需要 BaseCacheService 子类构造函数
  createRemember(class {});

  // @ts-expect-error 不能传入实例
  createRemember(new DemoCacheService());
}

{
  class DemoCacheService extends BaseCacheService {
    protected createAdapter() {
      return new CacheMemoryAdapter();
    }
  }
  const remember = createRemember(DemoCacheService);

  class MyClass {
    @remember(1)
    async getDataByMs(id: number) {
      return id;
    }

    @remember({ duration: 1 })
    async getData0() {
      return 'ok';
    }

    @remember({ key: 'key', duration: 1 })
    async getData1() {
      return 'ok';
    }

    // @ts-expect-error 不能传字符串 duration
    @remember('1')
    async getDataBadMs() {
      return 'ok';
    }

    // @ts-expect-error
    @remember({ key: 'key' })
    async getData1_1() {
      return 'ok';
    }

    @remember({
      key: (id, time) => {
        expectType<number>(id);
        expectType<string>(time);
        return `key_${id}_${time}`;
      },
      duration: 1,
    })
    async getData2(id: number, time: string) {
      return 'ok' + id + time;
    }

    @remember({ key: 'key', duration: 60_000 })
    async getData3() {
      return 'ok';
    }

    @remember({ key: 'key', duration: 1 })
    getData4() {
      return Promise.resolve('ok');
    }

    @remember({ key: 'key', duration: 1 })
    getData5() {
      return Promise.resolve('ok');
    }

    @remember({ key: 'key', duration: 1 })
    getData6() {
      return Promise.resolve('ok');
    }

    @remember({ key: 'key', duration: 1 })
    async getDate7() {
      return null;
    }

    @remember({ key: 'key', defaultValue: 'okay', duration: 1 })
    async getDate8() {
      if (Math.random() > 0.5) return 'ok';
      return null;
    }

    @remember({ key: 'key', defaultValue: 123, duration: 1 })
    async getDate9() {
      if (Math.random() > 0.5) return 'ok';
      return null;
    }
  }

  const host = new MyClass();
  expectType<TypeEqual<(id: number) => Promise<number>, typeof host.getDataByMs>>(true);
  expectType<
    TypeEqual<(id: number, time: string) => Promise<string>, typeof host.getData2>
  >(true);

  const data = await host.getData2(2, 'x');
  expectType<string>(data);

  // defaultValue 目前不收窄装饰后的返回类型（仍为原方法 P）
  const withDefault = await host.getDate8();
  expectType<string | null>(withDefault);

  const withoutDefault = await host.getDate7();
  expectType<string | null>(withoutDefault);

  // @ts-expect-error 不再暴露 setInstance
  remember.setInstance;
  // @ts-expect-error 不再暴露 deleteInstance
  remember.deleteInstance;
  // @ts-expect-error 不再暴露 fork
  remember.fork;
}
