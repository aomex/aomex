import { combineServices, type PromisifiedService } from '@aomex/common';
import { type TypeEqual, expectType } from 'ts-expect';
import { BaseCacheService, CacheAdapter, Caching } from '../src';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';

class DemoCacheService extends BaseCacheService {
  protected createAdapter() {
    return new CacheMemoryAdapter();
  }

  async load(id: number) {
    return this.cache.get<{ id: number }>(this.concat('item', id));
  }

  async save(id: number) {
    return this.cache.set(this.concat('item', id), { id }, this.ttl.DAY);
  }

  keyOf(id: number) {
    return this.concat('item', this.hash(id));
  }

  dayMs() {
    return this.ttl.DAY;
  }
}

{
  const services = await combineServices({
    cache: async () => DemoCacheService,
  });

  expectType<
    TypeEqual<(id: number) => Promise<{ id: number } | null>, typeof services.cache.load>
  >(true);
  expectType<TypeEqual<(id: number) => Promise<boolean>, typeof services.cache.save>>(
    true,
  );
  expectType<TypeEqual<(id: number) => Promise<string>, typeof services.cache.keyOf>>(
    true,
  );
  expectType<TypeEqual<() => Promise<86_400_000>, typeof services.cache.dayMs>>(true);

  expectType<TypeEqual<never, keyof typeof services.cache & 'cache'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'createAdapter'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'concat'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'hash'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'ttl'>>(true);
  // @ts-expect-error
  services.cache.cache;
  // @ts-expect-error
  services.cache.createAdapter;
  // @ts-expect-error
  services.cache.concat;
  // @ts-expect-error
  services.cache.hash;
  // @ts-expect-error
  services.cache.ttl;
  // @ts-expect-error
  services.cache.onInit;
}

{
  class TypedAdapter extends CacheAdapter {
    override existsKey(): Promise<boolean> {
      return Promise.resolve(false);
    }
    override getValue(): Promise<string | null> {
      return Promise.resolve(null);
    }
    override setValue(): Promise<boolean> {
      return Promise.resolve(true);
    }
    override setNotExistValue(): Promise<boolean> {
      return Promise.resolve(true);
    }
    override deleteValue(): Promise<boolean> {
      return Promise.resolve(true);
    }
    override deleteAllValues(): Promise<boolean> {
      return Promise.resolve(true);
    }
    override expireKey(): Promise<boolean> {
      return Promise.resolve(true);
    }
    override ttlKey(): Promise<number> {
      return Promise.resolve(-1);
    }
    override leftPushValue(): Promise<boolean> {
      return Promise.resolve(true);
    }
    override rightPopValue(): Promise<string | null> {
      return Promise.resolve(null);
    }
    override increaseValue(): Promise<number> {
      return Promise.resolve(0);
    }
    override decreaseValue(): Promise<number> {
      return Promise.resolve(0);
    }
    custom() {
      return 'ok' as const;
    }
  }

  class Typed extends BaseCacheService<TypedAdapter> {
    protected createAdapter() {
      return new TypedAdapter();
    }
    adapterType() {
      expectType<TypeEqual<Caching<TypedAdapter>, typeof this.cache>>(true);
      expectType<TypeEqual<'ok', ReturnType<typeof this.cache.adapter.custom>>>(true);
      return this.cache;
    }
    ok() {
      return this.concat('a', 1, 'b');
    }
    badBool() {
      // @ts-expect-error 不接受 boolean
      return this.concat(true);
    }
    hashOk() {
      return this.hash('x');
    }
    hashBad() {
      // @ts-expect-error 不接受 object
      return this.hash({ a: 1 });
    }
    ttlShape() {
      return this.ttl;
    }
  }
  expectType<TypeEqual<string, ReturnType<Typed['ok']>>>(true);
  expectType<
    TypeEqual<
      {
        readonly SECOND: 1_000;
        readonly MINUTE: 60_000;
        readonly HOUR: 3_600_000;
        readonly DAY: 86_400_000;
        readonly WEEK: 604_800_000;
        readonly MONTH: 2_592_000_000;
        readonly YEAR: 31_536_000_000;
      },
      ReturnType<Typed['ttlShape']>
    >
  >(true);
  void Typed;
}

{
  // @ts-expect-error 必须实现 createAdapter
  class MissingAdapter extends BaseCacheService {}
  void MissingAdapter;
}

{
  type Public = PromisifiedService<DemoCacheService>;
  expectType<TypeEqual<never, keyof Public & 'cache'>>(true);
  expectType<TypeEqual<never, keyof Public & keyof CacheAdapter>>(true);
}
