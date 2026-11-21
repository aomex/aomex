import { combineServices, type PromisifiedService } from '@aomex/common';
import { type TypeEqual, expectType } from 'ts-expect';
import { BaseCacheService, CacheAdapter, CacheKey, Caching } from '../src';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';

class DemoCacheService extends BaseCacheService {
  protected createAdapter() {
    return new CacheMemoryAdapter();
  }

  async load(id: number) {
    return this.cache.get<{ id: number }>(this.key('item', id));
  }

  async save(id: number) {
    return this.cache.set(this.key('item', id), { id }, '1 day');
  }

  keyOf(id: number) {
    return this.keyHash('item', id);
  }

  hashedOf(id: number) {
    return this.keyHash('item', id);
  }

  builder() {
    return this.key();
  }

  /** @deprecated API 仍可用 */
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
  expectType<TypeEqual<(id: number) => Promise<CacheKey>, typeof services.cache.keyOf>>(
    true,
  );
  expectType<
    TypeEqual<(id: number) => Promise<CacheKey>, typeof services.cache.hashedOf>
  >(true);
  expectType<TypeEqual<() => Promise<CacheKey>, typeof services.cache.builder>>(true);
  expectType<TypeEqual<() => Promise<86_400_000>, typeof services.cache.dayMs>>(true);

  expectType<TypeEqual<never, keyof typeof services.cache & 'cache'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'createAdapter'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'key'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'keyHash'>>(true);
  expectType<TypeEqual<never, keyof typeof services.cache & 'ttl'>>(true);
  // @ts-expect-error
  services.cache.cache;
  // @ts-expect-error
  services.cache.createAdapter;
  // @ts-expect-error
  services.cache.key;
  // @ts-expect-error
  services.cache.keyHash;
  // @ts-expect-error
  services.cache.ttl;
  // @ts-expect-error
  services.cache.onInit;
  // @ts-expect-error 已移除独立 hash
  services.cache.hash;
}

{
  class TypedAdapter extends CacheAdapter {
    override existsKey(): Promise<boolean> {
      return Promise.resolve(false);
    }
    override getValue(): Promise<string | null> {
      return Promise.resolve(null);
    }
    override getAndDeleteValue(): Promise<string | null> {
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
      return this.key('a', 1, 'b');
    }
    okBuilder() {
      return this.key().key('a', 1, 'b');
    }
    hashed() {
      return this.keyHash('a', 1);
    }
    hashedBuilder() {
      return this.key().keyHash('a', 1);
    }
    badBool() {
      // @ts-expect-error 不接受 boolean
      return this.key(true);
    }
    badHashKey() {
      // @ts-expect-error 不接受 boolean
      return this.keyHash(true);
    }
    badHashConcat() {
      // @ts-expect-error 不接受 boolean
      return this.key().keyHash(true);
    }
    removedHash() {
      // @ts-expect-error 已移除 hash
      return this.key().hash('x');
    }
    ttlShape() {
      return this.ttl;
    }
  }
  expectType<TypeEqual<CacheKey, ReturnType<Typed['ok']>>>(true);
  expectType<TypeEqual<CacheKey, ReturnType<Typed['okBuilder']>>>(true);
  expectType<TypeEqual<CacheKey, ReturnType<Typed['hashed']>>>(true);
  expectType<TypeEqual<CacheKey, ReturnType<Typed['hashedBuilder']>>>(true);
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
  expectType<TypeEqual<never, keyof Public & 'key'>>(true);
  expectType<TypeEqual<never, keyof Public & 'keyHash'>>(true);
}
