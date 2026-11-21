import { Service } from '@aomex/common';
import { CacheAdapter } from './cache-adapter';
import { CacheKey } from './cache-key';
import { Caching } from './caching';
import { attachRememberScopes, detachRememberScopes } from './remember';

const CACHE_TTL = {
  SECOND: 1_000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
  WEEK: 604_800_000,
  /** 按 30 天计 */
  MONTH: 2_592_000_000,
  /** 按 365 天计 */
  YEAR: 31_536_000_000,
} as const;

/**
 * 缓存领域服务基类：子类实现 `createAdapter`，在业务方法里通过 `this.cache` 访问。
 *
 * ```typescript
 * import { CacheMemoryAdapter } from '@aomex/cache/memory';
 * import { createRemember } from '@aomex/cache';
 *
 * class CacheService extends BaseCacheService {
 *   protected createAdapter() {
 *     return new CacheMemoryAdapter();
 *   }
 * }
 *
 * export const remember = createRemember(CacheService);
 * ```
 */
export abstract class BaseCacheService<
  T extends CacheAdapter = CacheAdapter,
> extends Service {
  private _cache!: Caching<T>;

  protected get cache(): Caching<T> {
    return this._cache;
  }

  protected abstract createAdapter(): T;

  protected override async onInit(): Promise<void> {
    this._cache = new Caching(this.createAdapter());
    try {
      await this._cache.adapter.connect();
      attachRememberScopes(this);
    } catch (e) {
      detachRememberScopes(this);
      throw e;
    }
  }

  protected override async onDestroy(): Promise<void> {
    detachRememberScopes(this);
    await this._cache?.adapter.disconnect();
  }

  /**
   * @deprecated 请使用 DurationInput（如 `'1 day'`）代替
   */
  protected get ttl() {
    return CACHE_TTL;
  }

  /**
   * 用 `:` 拼接片段，得到可读的缓存键（可继续链式调用）。
   *
   * ```typescript
   * this.key('user', 1);              // user:1
   * this.key('user').key(1);          // 同上
   * this.key('user').keyHash(1);      // user:<md5('1')>  前缀保留，只哈希新片段
   * this.key('user', 1).toHash();     // <md5('user:1')>  整键再哈希
   * await this.cache.get(this.key('user', 1));
   * ```
   */
  protected key(...keys: Array<string | number>): CacheKey {
    return keys.length === 0 ? new CacheKey() : new CacheKey().key(...keys);
  }

  /**
   * 将片段用 `:` 拼接后整体 MD5（无可读前缀）。
   * 等价于 `this.key(...keys).toHash()`。
   *
   * ```typescript
   * this.keyHash('user', 1);          // <md5('user:1')>
   * this.key('user').keyHash(1);      // 不是这个：那是「前缀 + 哈希段」
   * ```
   */
  protected keyHash(...keys: Array<string | number>): CacheKey {
    return new CacheKey().keyHash(...keys);
  }
}
