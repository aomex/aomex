import { createHash } from 'node:crypto';

export interface CacheOptions {
  keyPrefix?: string;
}

export abstract class Cache {
  protected readonly keyPrefix: string;

  constructor(config: CacheOptions) {
    this.keyPrefix = config.keyPrefix ?? '';
  }

  /**
   * Make sure key is not expired.
   */
  async exists(key: string): Promise<boolean> {
    return this.existsKey(this.buildKey(key));
  }

  /**
   * Get value from specific key and return `null` if defaultValue is not provided.
   * ```typescript
   * await cache.get('non-exist'); // null
   * await cache.get('non-exist', 'my-value'); // my-value
   * ```
   */
  async get<T>(key: string, defaultValue: T): Promise<T>;
  async get<T extends string | number | object | boolean>(
    key: string,
  ): Promise<T | null>;
  async get(
    key: string,
    defaultValue?: string | number | object | boolean,
  ): Promise<any> {
    const hashKey = this.buildKey(key);
    const result = await this.getValue(hashKey);

    if (result === null) {
      return defaultValue === void 0 ? null : defaultValue;
    }

    try {
      return JSON.parse(result);
    } catch {
      return null;
    }
  }

  /**
   * Get value from key, a set callback will be triggered when the value is `null`.
   *
   * ```typescript
   * await cache.get('key'); // null
   * await cache.getOrSet('key', () => 'value'); // 'value'
   * await cache.get('key'); // 'value'
   * ```
   */
  async getOrSet<T extends string | number | object | boolean>(
    key: string,
    orSet: () => T,
    duration?: number,
  ): Promise<T>;
  async getOrSet<T extends string | number | object | boolean>(
    key: string,
    orSet: () => Promise<T>,
    duration?: number,
  ): Promise<T>;
  async getOrSet<T extends string | number | object | boolean>(
    key: string,
    orSet: () => T | Promise<T>,
    duration?: number,
  ): Promise<T> {
    let value: T | null = await this.get(key);
    if (value !== null) return value;
    await this.set(key, await orSet(), duration);
    return (await this.get<T>(key))!;
  }

  /**
   * Set value
   *
   * ```typescript
   * await cache.set('key', 'value');
   * await cache.set('key', 'value', 3600);
   * ```
   */
  async set(
    key: string,
    value: string | number | object | boolean,
    duration?: number,
  ): Promise<boolean> {
    const hashKey = this.buildKey(key);
    return this.setValue(hashKey, JSON.stringify(value), duration);
  }

  /**
   * Set value if a key doesn't exists
   *
   * ```typescript
   * await cache.exists('key'); // false
   * await cache.add('key', 'value'); // true
   *
   * await cache.exists('key'); // true
   * await cache.add('key', 'value'); // false
   * ```
   */
  async add(key: string, value: any, duration?: number): Promise<boolean> {
    const hashKey = this.buildKey(key);
    return this.addValue(hashKey, JSON.stringify(value), duration);
  }

  /**
   * Delete a key
   */
  async delete(key: string): Promise<boolean> {
    const hashKey = this.buildKey(key);
    return this.deleteValue(hashKey);
  }

  /**
   * Delete all keys
   */
  async deleteAll(): Promise<boolean> {
    return this.deleteAllValues();
  }

  protected buildKey(key: string): string {
    const hashKey =
      key.length <= 32 ? key : createHash('md5').update(key).digest('hex');
    return this.keyPrefix + hashKey;
  }

  protected async addValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean> {
    return (await this.existsKey(key))
      ? false
      : this.setValue(key, value, duration);
  }

  protected abstract existsKey(key: string): Promise<boolean>;
  protected abstract getValue(key: string): Promise<string | null>;
  protected abstract setValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean>;
  protected abstract deleteValue(key: string): Promise<boolean>;
  protected abstract deleteAllValues(): Promise<boolean>;
}
