import { createHash } from 'node:crypto';

/**
 * 缓存键。通常由 `BaseCacheService#key()` / `#keyHash()` 创建。
 *
 * ```typescript
 * this.key('user', 1);                 // user:1
 * this.key('user').key(1);             // user:1
 * this.keyHash('user', 1);             // md5('user:1')
 * this.key('user').keyHash(1);         // user:md5('1')
 * this.key('user', 1).toHash();        // md5('user:1')
 * await this.cache.get(this.key('user', 1));
 * ```
 */
export class CacheKey {
  protected readonly value: string;

  constructor(value: string = '') {
    this.value = value;
  }

  /** 用 `:` 拼接片段（保留已有前缀），如 `key('user').key(1)` → `'user:1'` */
  key(...keys: Array<string | number>): CacheKey {
    return new CacheKey((this.value === '' ? keys : [this.value, ...keys]).join(':'));
  }

  /** 仅对本次参数拼接后 MD5，再接到已有前缀后 */
  keyHash(...keys: Array<string | number>): CacheKey {
    return this.key(this.md5(keys.join(':')));
  }

  /** 对当前完整键做 MD5 */
  toHash(): CacheKey {
    return new CacheKey(this.md5(this.value));
  }

  protected toString(): string {
    return this.value;
  }

  protected md5(key: string | number): string {
    return createHash('md5').update(String(key)).digest('hex');
  }
}
