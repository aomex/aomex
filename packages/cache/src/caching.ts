import { CacheAdapter } from './cache-adapter';

export namespace Caching {
  export type Types =
    | string
    | number
    | unknown[]
    | readonly unknown[]
    | { [K: string]: unknown }
    | boolean
    | Map<any, any>
    | Set<any>;
}

const CACHING_TYPE = '_$caching_type$_';
const CACHING_DATA = '_$caching_data$_';

export class Caching<T extends CacheAdapter = CacheAdapter> {
  constructor(readonly adapter: T) {}

  /**
   * 查看缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    await this.adapter.connect();
    return this.adapter.existsKey(key);
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
    await this.adapter.connect();
    const result = await this.adapter.getValue(key);
    return this.decodeValue(result, defaultValue);
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
    await this.adapter.connect();
    return this.adapter.setValue(key, this.encodeValue(value), durationMs);
  }

  /**
   * 设置缓存。如果缓存已经存在，则设置失败，返回`false`
   *
   * ```typescript
   * await cache.setNX('foo', 'bar'); // true
   * await cache.setNX('foo', 'baz'); // false
   * ```
   */
  async setNX(key: string, value: Caching.Types, durationMs?: number): Promise<boolean> {
    await this.adapter.connect();
    return this.adapter.setNotExistValue(key, this.encodeValue(value), durationMs);
  }

  /**
   * 将一个或多个值按顺序插入到列表头部。当 key 存在但不是列表类型时，返回一个错误。
   *
   * ```typescript
   * await cache.leftPush('foo', 'a'); // ['a']
   * await cache.leftPush('foo', 'b', 'c'); // ['b', 'c', 'a']
   * ```
   */
  async leftPush(key: string, ...values: Caching.Types[]): Promise<boolean> {
    if (!values.length) return false;
    await this.adapter.connect();
    return this.adapter.leftPushValue(
      key,
      ...values.map((value) => this.encodeValue(value)),
    );
  }

  /**
   * 移除列表的最后一个元素，返回值为被移除的元素
   */
  async rightPop<T extends Caching.Types>(key: string): Promise<T | null> {
    await this.adapter.connect();
    const result = await this.adapter.rightPopValue(key);
    return this.decodeValue(result);
  }

  /**
   * 将key中储存的数字值增一。如果key不存在，那么key的值会先被初始化为0，然后再执行操作。如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
   *
   * ```typescript
   * await cache.increment('foo'); // 1
   * await cache.increment('foo'); // 2
   * await cache.increment('foo'); // 3
   * ```
   */
  async increment(key: string): Promise<number> {
    await this.adapter.connect();
    return this.adapter.increaseValue(key);
  }

  /**
   * 重新设置缓存时间。如果key不存在，则返回`false`
   */
  async expire(key: string, durationMs: number): Promise<boolean> {
    await this.adapter.connect();
    return this.adapter.expireKey(key, durationMs);
  }

  /**
   * 检测缓存的剩余生存时间(Time to live)
   * - 不存在则返回`-2`
   * - 未设置过期时间则返回`-1`
   * - 已设置过期时间则返回剩余时间，单位**毫秒**
   *
   * ```typescript
   * await cache.ttl('foo');          // -2
   * await cache.set('foo', 'bar');
   * await cache.ttl('foo');          // -1
   * await cache.expire('foo', 60000);
   * await cache.ttl('foo');          // 59000
   * ```
   */
  async ttl(key: string): Promise<number> {
    await this.adapter.connect();
    return this.adapter.ttlKey(key);
  }

  /**
   * 将key中储存的数字值减一。如果key不存在，那么key的值会先被初始化为0，然后再执行操作。如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误
   */
  async decrement(key: string): Promise<number> {
    await this.adapter.connect();
    return this.adapter.decreaseValue(key);
  }

  /**
   * 删除指定缓存
   */
  async delete(key: string): Promise<boolean> {
    await this.adapter.connect();
    return this.adapter.deleteValue(key);
  }

  /**
   * 删除所有缓存
   */
  async deleteAll(): Promise<boolean> {
    await this.adapter.connect();
    return this.adapter.deleteAllValues();
  }

  /**
   * 方法装饰器，自动获取数据，如果不存在则请求原始数据并自动保存。在请求原始数据期间，任意相同请求都会被截流，并共享第一个请求
   * ```typescript
   * const cache = new Caching(memoryAdapter());
   *
   * class MyClass {
   *  \@cache.decorate({ key: (id) => `key_${id}`, duration: 60_000 })
   *   async getData(id: number) {
   *     const result = await queryDB({ id: id });
   *     return result;
   *   }
   * }
   * ```
   */
  decorate<
    T extends Caching.Types | null,
    P extends (...args: any[]) => Promise<T>,
    Q extends NonNullable<T>,
  >(opts: {
    key: string | ((...args: Parameters<P>) => string);
    duration?: number;
    /**
     * 当数据源返回null或者undefined时，则返回默认值
     */
    defaultValue?: Q;
  }) {
    const instance = this;
    const fetching: Record<string, Promise<T>> = {};
    const { key: getKey, duration, defaultValue = null } = opts;

    return (originalMethod: P, _context: ClassMethodDecoratorContext) => {
      return async function (this: object, ...args: Parameters<P>): Promise<any> {
        const key = typeof getKey === 'string' ? getKey : getKey.apply(this, args);
        let value = await instance.get<NonNullable<T>>(key);
        if (value === null) {
          if (fetching[key]) {
            value = await fetching[key];
          } else {
            fetching[key] = originalMethod.apply(this, args);
            value = await fetching[key];
            if (value !== null) {
              await instance.set(key, value, duration);
            }
            Reflect.deleteProperty(fetching, key);
          }
        }
        return value === null ? defaultValue : value;
      };
    };
  }

  protected encodeValue(value: Caching.Types) {
    if (value instanceof Map) {
      value = { [CACHING_TYPE]: 'Map', [CACHING_DATA]: Array.from(value.entries()) };
    } else if (value instanceof Set) {
      value = { [CACHING_TYPE]: 'Set', [CACHING_DATA]: Array.from(value.values()) };
    }
    return JSON.stringify(value);
  }

  protected decodeValue(value: string | null, defaultValue?: Caching.Types) {
    if (value === null) {
      return defaultValue === void 0 ? null : defaultValue;
    }

    try {
      const decoded = JSON.parse(value);
      if (decoded && typeof decoded === 'object') {
        const keys = Object.keys(decoded);
        if (
          keys.length === 2 &&
          keys.includes(CACHING_TYPE) &&
          keys.includes(CACHING_DATA)
        ) {
          switch (decoded[CACHING_TYPE]) {
            case 'Map':
              if (Array.isArray(decoded[CACHING_DATA])) {
                return new Map(decoded[CACHING_DATA]);
              }
              break;
            case 'Set':
              if (Array.isArray(decoded[CACHING_DATA])) {
                return new Set(decoded[CACHING_DATA]);
              }
          }
        }
      }
      return decoded;
    } catch {
      return null;
    }
  }
}
