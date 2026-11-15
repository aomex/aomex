import { createHash } from 'node:crypto';
import { Service } from '@aomex/common';
import { CacheAdapter } from './cache-adapter';
import { Caching } from './caching';

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
 *
 * class CacheService extends BaseCacheService {
 *   protected createAdapter() {
 *     return new CacheMemoryAdapter();
 *   }
 * }
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
    await this._cache.adapter.connect();
  }

  protected override async onDestroy(): Promise<void> {
    await this._cache?.adapter.disconnect();
  }

  /** 常用过期时间（毫秒）：`this.ttl.DAY` */
  protected get ttl() {
    return CACHE_TTL;
  }

  /** 用 `:` 拼接缓存 key 片段，如 `concat('user', 1)` → `'user:1'` */
  protected concat(...keys: Array<string | number>): string {
    return keys.join(':');
  }

  /** 对 key 做 MD5，适合过长或不规则片段 */
  protected hash(key: string | number): string {
    return createHash('md5').update(String(key)).digest('hex');
  }
}
