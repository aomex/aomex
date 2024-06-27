import { createHash } from 'node:crypto';

export namespace Caching {
  export interface Options {
    /**
     * 删除过期缓存防止占用空间，加快读取速度。概率取值范围：`1-100`。默认值：`10`
     */
    gcProbability?: number;
  }

  export type Types = string | number | object | boolean;
}

export abstract class Caching {
  protected readonly gcProbability: number;

  constructor(config: Caching.Options = {}) {
    this.gcProbability = (config.gcProbability ?? 10) / 100;
  }

  /**
   * 查看缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    return this.existsKey(this.buildKey(key));
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
    const hashKey = this.buildKey(key);
    const result = await this.getValue(hashKey);
    return this.parseValue(result, defaultValue);
  }

  /**
   * 获取缓存后立即将该值从引擎中删除。如果未找到缓存并且未提供默认值，则返回`null`
   *
   * ```typescript
   * await cache.set('key', 'value');
   * await cache.getAndDelete<string>('key'); // 'value'
   * await cache.get('key'); // null
   * ```
   */
  async getAndDelete<T>(key: string, defaultValue: T): Promise<T>;
  async getAndDelete<T extends Caching.Types>(key: string): Promise<T | null>;
  async getAndDelete(key: string, defaultValue?: Caching.Types): Promise<any> {
    const result = await this.get(key, defaultValue);
    if (result !== null) {
      await this.delete(key);
    }
    return result;
  }

  /**
   * 获取缓存。如果没有值，则设置该缓存
   *
   * ```typescript
   * await cache.get('key'); // null
   * await cache.getOrSet('key', () => 'value'); // 'value'
   * await cache.get('key'); // 'value'
   * ```
   */
  async getOrSet<T extends Caching.Types>(
    key: string,
    orSet: () => T,
    durationMs?: number,
  ): Promise<T>;
  async getOrSet<T extends Caching.Types>(
    key: string,
    orSet: () => Promise<T>,
    durationMs?: number,
  ): Promise<T>;
  async getOrSet<T extends Caching.Types>(
    key: string,
    orSet: () => T | Promise<T>,
    durationMs?: number,
  ): Promise<T> {
    let value: T | null = await this.get(key);
    if (value !== null) return value;
    await this.set(key, await orSet(), durationMs);
    return (await this.get<T>(key))!;
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
    await this.applyGC();
    const hashKey = this.buildKey(key);
    return this.setValue(hashKey, JSON.stringify(value), durationMs);
  }

  /**
   * 设置缓存。如果缓存已经存在，则设置失败，返回`false`
   *
   * ```typescript
   * await cache.exists('key'); // false
   * await cache.add('key', 'value'); // true
   *
   * await cache.exists('key'); // true
   * await cache.add('key', 'value'); // false
   * ```
   */
  async add(key: string, value: any, durationMs?: number): Promise<boolean> {
    await this.applyGC();
    const hashKey = this.buildKey(key);
    return this.addValue(hashKey, JSON.stringify(value), durationMs);
  }

  /**
   * 将key中储存的数字值增一。
   *
   * 如果key不存在，那么key的值会先被初始化为0，然后再执行操作。
   *
   * 如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
   */
  async increment(key: string): Promise<number> {
    const hashKey = this.buildKey(key);
    return this.increaseValue(hashKey);
  }

  /**
   * 重新设置缓存时间。如果key不存在，则返回`false`
   */
  async expires(key: string, durationMs: number): Promise<boolean> {
    const hashKey = this.buildKey(key);
    return this.expireValue(hashKey, durationMs);
  }

  /**
   * 将key中储存的数字值减一。
   *
   * 如果key不存在，那么key的值会先被初始化为0，然后再执行操作。
   *
   * 如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
   */
  async decrement(key: string): Promise<number> {
    const hashKey = this.buildKey(key);
    return this.decreaseValue(hashKey);
  }

  /**
   * 删除指定缓存
   */
  async delete(key: string): Promise<boolean> {
    const hashKey = this.buildKey(key);
    return this.deleteValue(hashKey);
  }

  /**
   * 删除所有缓存。若指定了keyPrefix，则只删除有该前缀的缓存
   */
  async deleteAll(): Promise<boolean> {
    return this.deleteAllValues();
  }

  protected buildKey(key: string): string {
    return key.length < 32 ? key : createHash('md5').update(key).digest('hex');
  }

  protected abstract existsKey(key: string): Promise<boolean>;
  protected abstract getValue(key: string): Promise<string | null>;
  protected abstract setValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean>;
  protected abstract addValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean>;
  protected abstract deleteValue(key: string): Promise<boolean>;
  protected abstract deleteAllValues(): Promise<boolean>;
  protected abstract increaseValue(key: string): Promise<number>;
  protected abstract decreaseValue(key: string): Promise<number>;
  protected abstract expireValue(key: string, duration: number): Promise<boolean>;

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
    await this.gc();
  }

  protected async gc() {}
}
