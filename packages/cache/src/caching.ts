import { createHash } from 'node:crypto';
import { Store } from './store';

export namespace Caching {
  export interface Options {
    /**
     * 删除过期缓存防止占用空间，加快读取速度。概率取值范围：`1-100`。默认值：`10`
     */
    gcProbability?: number;
  }

  export type Types = string | number | object | boolean;
}

export class Caching<S extends Store = Store, T extends object = object> {
  protected readonly gcProbability: number;
  readonly store: S;

  constructor(StoreClass: new (config: T) => S, config: T & Caching.Options) {
    this.gcProbability = (config.gcProbability ?? 10) / 100;
    this.store = new StoreClass(config);
    this.store.connect();
  }

  /**
   * 查看缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    await this.store.connect();
    return this.store.existsKey(this.buildKey(key));
  }

  /**
   *
   * 获取缓存。如果未找到缓存并且未提供默认值，则返回`null`
   * ```typescript
   * await cache.get('key'); // null
   * await cache.get('key', 'my-value'); // my-value
   * ```
   */
  async get<T>(key: string, defaultValue: T): Promise<T>;
  async get<T extends Caching.Types>(key: string): Promise<T | null>;
  async get(key: string, defaultValue?: Caching.Types): Promise<any> {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    const result = await this.store.getValue(hashKey);
    return this.parseValue(result, defaultValue);
  }

  /**
   * 设置缓存。可以指定过期时间（毫秒）
   *
   * ```typescript
   * await cache.set('key', 'value');
   * await cache.set('key', 'value', 3600);
   * ```
   */
  async set(key: string, value: Caching.Types, durationMs?: number): Promise<boolean> {
    await this.store.connect();
    await this.applyGC();
    const hashKey = this.buildKey(key);
    return this.store.setValue(hashKey, JSON.stringify(value), durationMs);
  }

  /**
   * 设置缓存。如果缓存已经存在，则设置失败，返回`false`
   *
   * ```typescript
   * await cache.exists('key'); // false
   * await cache.setNX('key', 'value'); // true
   *
   * await cache.exists('key'); // true
   * await cache.setNX('key', 'value'); // false
   * ```
   */
  async setNX(key: string, value: Caching.Types, durationMs?: number): Promise<boolean> {
    await this.store.connect();
    await this.applyGC();
    const hashKey = this.buildKey(key);
    return this.store.setNotExistValue(hashKey, JSON.stringify(value), durationMs);
  }

  /**
   * 将一个或多个值按顺序插入到列表头部。当 key 存在但不是列表类型时，返回一个错误。
   *
   * 假设当前一个列表 foo=[s]，执行 `leftPush('foo', a, b, c)` 后列表 foo=[a, b, c, s]
   */
  async leftPush(key: string, ...values: Caching.Types[]): Promise<boolean> {
    if (!values.length) return false;
    await this.store.connect();
    const hashKey = this.buildKey(key);
    return this.store.leftPushValue(
      hashKey,
      ...values.map((value) => JSON.stringify(value)),
    );
  }

  /**
   * 移除列表的最后一个元素，返回值为被移除的元素
   */
  async rightPop<T extends Caching.Types>(key: string): Promise<T | null> {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    const result = await this.store.rightPopValue(hashKey);
    return this.parseValue(result);
  }

  /**
   * 将key中储存的数字值增一。
   *
   * 如果key不存在，那么key的值会先被初始化为0，然后再执行操作。
   *
   * 如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
   */
  async increment(key: string): Promise<number> {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    return this.store.increaseValue(hashKey);
  }

  /**
   * 重新设置缓存时间。如果key不存在，则返回`false`
   */
  async expire(key: string, durationMs: number): Promise<boolean> {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    return this.store.expireKey(hashKey, durationMs);
  }

  /**
   * 检测缓存的剩余生存时间(Time to live)
   * - 不存在则返回`-2`
   * - 未设置过期时间则返回`-1`
   * - 已设置过期时间则返回剩余时间，单位**毫秒**
   */
  async ttl(key: string) {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    return this.store.ttlKey(hashKey);
  }

  /**
   * 将key中储存的数字值减一。
   *
   * 如果key不存在，那么key的值会先被初始化为0，然后再执行操作。
   *
   * 如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
   */
  async decrement(key: string): Promise<number> {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    return this.store.decreaseValue(hashKey);
  }

  /**
   * 删除指定缓存
   */
  async delete(key: string): Promise<boolean> {
    await this.store.connect();
    const hashKey = this.buildKey(key);
    return this.store.deleteValue(hashKey);
  }

  /**
   * 删除所有缓存。若指定了keyPrefix，则只删除有该前缀的缓存
   */
  async deleteAll(): Promise<boolean> {
    await this.store.connect();
    return this.store.deleteAllValues();
  }

  protected buildKey(key: string): string {
    return key.length < 32 ? key : createHash('md5').update(key).digest('hex');
  }

  protected parseValue(value: string | null, defaultValue?: Caching.Types) {
    if (value === null) {
      return defaultValue === void 0 ? null : defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  protected async applyGC() {
    if (Math.random() > this.gcProbability) return;
    await this.store.gc();
  }
}
