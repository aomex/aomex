import {
  parseDuration,
  registerLifecycle,
  sleep,
  type DurationInput,
} from '@aomex/common';
import { CacheAdapter } from './cache-adapter';
import { CacheKey } from './cache-key';
import { i18n } from './i18n';

export namespace Caching {
  export type Types =
    | string
    | number
    | unknown[]
    | readonly unknown[]
    | { [K: string]: any }
    | boolean
    | Map<any, any>
    | Set<any>
    | bigint
    | Date;

  /** 缓存键：字符串或 `CacheKey` */
  export type Key = string | CacheKey;
}

/** singleFlight 临时结果：成功带值，失败带错误文案供等待方复现 */
type SingleFlightPayload<T> = { ok: true; v: T } | { ok: false; e: string };

/** 分布式单飞持锁过期（`singleFlight` / `remember` 共用） */
export const SINGLE_FLIGHT_LOCK_MS = 30_000;

const CACHING_TYPE = '_$caching_type$_';
const CACHING_DATA = '_$caching_data$_';

/**
 * 缓存门面：组合根创建一次，业务与各库包共用同一实例。
 *
 * 类名不用 `Cache`：TypeScript DOM / Web Cache API 已有全局 `Cache`（`cache.match` /
 * `cache.put`），同名会导致自动导入与类型跳转混淆。实例变量仍推荐叫 `cache`。
 *
 * ```typescript
 * export const cache = new Caching(new CacheMemoryAdapter());
 * await cache.set(cache.key('user', 1), { id: 1 }, '1 day');
 * ```
 */
export class Caching<T extends CacheAdapter = CacheAdapter> {
  protected ready: Promise<void> | undefined;

  constructor(readonly adapter: T) {}

  /**
   * 用 `:` 拼接片段，得到可读的缓存键（可继续链式调用）。
   * 委托 `CacheKey.key`。
   */
  key(...keys: Array<string | number>): CacheKey {
    return CacheKey.key(...keys);
  }

  /**
   * 将片段用 `:` 拼接后整体 MD5（无可读前缀）。
   * 委托 `CacheKey.keyHash`。
   */
  keyHash(...keys: Array<string | number>): CacheKey {
    return CacheKey.keyHash(...keys);
  }

  /**
   * 查看缓存是否存在
   */
  async exists(key: Caching.Key): Promise<boolean> {
    await this.ensureReady();
    return this.adapter.existsKey(this.resolveKey(key));
  }

  /**
   * 获取缓存。如果未找到缓存并且未提供默认值，则返回`null`
   * ```typescript
   * await cache.get('key'); // null
   * await cache.get('key', 'my-value'); // my-value
   * ```
   */
  async get<T>(key: Caching.Key, defaultValue: T): Promise<T>;
  async get<T extends Caching.Types>(
    key: Caching.Key,
    defaultValue: T | null | undefined,
  ): Promise<T | null>;
  async get<T extends Caching.Types>(key: Caching.Key): Promise<T | null>;
  async get(key: Caching.Key, defaultValue?: Caching.Types | null): Promise<any> {
    await this.ensureReady();
    const result = await this.adapter.getValue(this.resolveKey(key));
    return this.decodeValue(result, defaultValue);
  }

  /**
   * 原子地获取并删除缓存（对齐 Redis GETDEL）。
   * 并发调用时只有一方能拿到值，其余得到 `null`（或默认值）。
   *
   * ```typescript
   * await cache.getAndDelete('key'); // null
   * await cache.getAndDelete('key', 'my-value'); // my-value
   * ```
   */
  async getAndDelete<T>(key: Caching.Key, defaultValue: T): Promise<T>;
  async getAndDelete<T extends Caching.Types>(
    key: Caching.Key,
    defaultValue: T | null | undefined,
  ): Promise<T | null>;
  async getAndDelete<T extends Caching.Types>(key: Caching.Key): Promise<T | null>;
  async getAndDelete(
    key: Caching.Key,
    defaultValue?: Caching.Types | null,
  ): Promise<any> {
    await this.ensureReady();
    const result = await this.adapter.getAndDeleteValue(this.resolveKey(key));
    return this.decodeValue(result, defaultValue);
  }

  /**
   * 设置缓存。可指定过期时间（毫秒数或可读时长，如 `'1 day'`、`'30m'`）
   *
   * ```typescript
   * await cache.set('key', 'value');
   * await cache.set('key', 'value', 60_000);
   * await cache.set('key', 'value', '1 minute');
   * ```
   */
  async set(
    key: Caching.Key,
    value: Caching.Types,
    duration?: DurationInput,
  ): Promise<boolean> {
    await this.ensureReady();
    return this.adapter.setValue(
      this.resolveKey(key),
      this.encodeValue(value),
      parseDuration(duration),
    );
  }

  /**
   * 设置缓存。如果缓存已经存在，则设置失败，返回`false`
   *
   * ```typescript
   * await cache.setNX('foo', 'bar'); // true
   * await cache.setNX('foo', 'baz'); // false
   * await cache.setNX('foo', 'bar', '20 seconds');
   * ```
   */
  async setNX(
    key: Caching.Key,
    value: Caching.Types,
    duration?: DurationInput,
  ): Promise<boolean> {
    await this.ensureReady();
    return this.adapter.setNotExistValue(
      this.resolveKey(key),
      this.encodeValue(value),
      parseDuration(duration),
    );
  }

  /**
   * 将一个或多个值按顺序插入到列表头部。当 key 存在但不是列表类型时，返回一个错误。
   *
   * ```typescript
   * await cache.leftPush('foo', 'a'); // ['a']
   * await cache.leftPush('foo', 'b', 'c'); // ['b', 'c', 'a']
   * ```
   */
  async leftPush(key: Caching.Key, ...values: Caching.Types[]): Promise<boolean> {
    if (!values.length) return false;
    await this.ensureReady();
    return this.adapter.leftPushValue(
      this.resolveKey(key),
      ...values.map((value) => this.encodeValue(value)),
    );
  }

  /**
   * 移除列表的最后一个元素，返回值为被移除的元素
   */
  async rightPop<T extends Caching.Types>(key: Caching.Key): Promise<T | null> {
    await this.ensureReady();
    const result = await this.adapter.rightPopValue(this.resolveKey(key));
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
  async increment(key: Caching.Key): Promise<number> {
    await this.ensureReady();
    return this.adapter.increaseValue(this.resolveKey(key));
  }

  /**
   * 重新设置缓存时间。如果 key 不存在，则返回 `false`
   *
   * ```typescript
   * await cache.expire('foo', 60_000);
   * await cache.expire('foo', '1 minute');
   * ```
   */
  async expire(key: Caching.Key, duration: DurationInput): Promise<boolean> {
    await this.ensureReady();
    return this.adapter.expireKey(this.resolveKey(key), parseDuration(duration));
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
   * await cache.expire('foo', '1 minute');
   * await cache.ttl('foo');          // 59000
   * ```
   */
  async ttl(key: Caching.Key): Promise<number> {
    await this.ensureReady();
    return this.adapter.ttlKey(this.resolveKey(key));
  }

  /**
   * 将key中储存的数字值减一。如果key不存在，那么key的值会先被初始化为0，然后再执行操作。如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误
   */
  async decrement(key: Caching.Key): Promise<number> {
    await this.ensureReady();
    return this.adapter.decreaseValue(this.resolveKey(key));
  }

  /**
   * 删除指定缓存
   */
  async delete(key: Caching.Key): Promise<boolean> {
    await this.ensureReady();
    return this.adapter.deleteValue(this.resolveKey(key));
  }

  /**
   * 删除所有缓存
   */
  async deleteAll(): Promise<boolean> {
    await this.ensureReady();
    return this.adapter.deleteAllValues();
  }

  /**
   * 分布式单飞：同一 `key` 上并发调用时只执行一次 `factory`，结果共享给等待方。
   * 与 `remember` 不同，**不会**把结果写入长期缓存；仅在飞行期间用短 TTL 中转结果。
   *
   * ```typescript
   * const data = await cache.singleFlight('jwks', () => fetchJwks());
   * ```
   */
  async singleFlight<T extends Caching.Types | null>(
    key: Caching.Key,
    factory: () => Promise<T>,
  ): Promise<T> {
    const baseKey = this.resolveKey(key);
    const waitingKey = baseKey + ':singleFlight:$#_waiting_#$';
    const resultKey = baseKey + ':singleFlight:$#_result_#$';

    // 读不到结果时最多重新竞争 5 次，避免热自旋死循环
    for (let round = 0; round < 5; round++) {
      const win = await this.setNX(waitingKey, 1, SINGLE_FLIGHT_LOCK_MS);
      if (win) {
        // 清掉上一轮残留结果，避免本轮崩溃未写入时等待方读到旧 payload
        // 允许上一轮读取新一轮的数据
        await this.delete(resultKey);
        const timer = setInterval(() => {
          void this.expire(waitingKey, SINGLE_FLIGHT_LOCK_MS);
        }, SINGLE_FLIGHT_LOCK_MS / 5);
        try {
          try {
            const result = await factory();
            await this.set(
              resultKey,
              { ok: true, v: result } satisfies SingleFlightPayload<T>,
              SINGLE_FLIGHT_LOCK_MS,
            );
            return result;
          } catch (err) {
            const message = Error.isError(err) ? err.message : String(err);
            await this.set(
              resultKey,
              { ok: false, e: message } satisfies SingleFlightPayload<T>,
              SINGLE_FLIGHT_LOCK_MS,
            );
            throw err;
          }
        } finally {
          clearInterval(timer);
          await this.delete(waitingKey);
        }
      }

      while (await this.exists(waitingKey)) {
        await sleep(100);
      }

      const payload = await this.get<SingleFlightPayload<T>>(resultKey);
      // 执行方崩溃且未写入结果时重新竞争（有轮次上限）
      if (payload === null) {
        await sleep(100);
        continue;
      }
      if (!payload.ok) {
        throw new Error(payload.e);
      }
      return payload.v;
    }

    throw new Error(i18n.t('single_flight_no_result'));
  }

  /**
   * 懒连接：首次读写时 `connect` 并登记关停时 `disconnect`。
   * `onInit` 失败会清空 `ready`，下次可重试。
   */
  protected ensureReady(): Promise<void> {
    this.ready ??= registerLifecycle({
      onInit: () => this.adapter.connect(),
      onDestroy: () => this.adapter.disconnect(),
    }).catch((err) => {
      this.ready = undefined;
      throw err;
    });
    return this.ready;
  }

  protected resolveKey(key: Caching.Key): string {
    return typeof key === 'string' ? key : key['toString']();
  }

  protected encodeValue(value: Caching.Types) {
    if (value instanceof Date) {
      value = this.convertDate(value);
    }
    return JSON.stringify(value, (_, v) => this.stringifyReplacer(v));
  }

  protected stringifyReplacer(value: Caching.Types) {
    if (value instanceof Map) {
      value = { [CACHING_TYPE]: 'Map', [CACHING_DATA]: Array.from(value.entries()) };
    } else if (value instanceof Set) {
      value = { [CACHING_TYPE]: 'Set', [CACHING_DATA]: Array.from(value.values()) };
    } else if (typeof value === 'bigint') {
      value = { [CACHING_TYPE]: 'BigInt', [CACHING_DATA]: value.toString() };
    } else if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        value = value.map((v) => this.convertDate(v));
      } else {
        value = Object.fromEntries(
          Object.entries(value).map(([k, v]) => {
            return [k, this.convertDate(v)];
          }),
        );
      }
    }

    return value;
  }

  protected convertDate(value: any) {
    if (value instanceof Date) {
      return { [CACHING_TYPE]: 'Date', [CACHING_DATA]: value.toISOString() };
    }
    return value;
  }

  protected decodeValue(value: string | null, defaultValue?: Caching.Types | null) {
    if (value === null) {
      return defaultValue === void 0 ? null : defaultValue;
    }

    try {
      return JSON.parse(value, (_, v) => this.jsonParseReviver(v));
    } catch {
      return null;
    }
  }

  protected jsonParseReviver(value: any) {
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (
        keys.length === 2 &&
        keys.includes(CACHING_TYPE) &&
        keys.includes(CACHING_DATA)
      ) {
        switch (value[CACHING_TYPE]) {
          case 'Map':
            if (Array.isArray(value[CACHING_DATA])) {
              return new Map(value[CACHING_DATA]);
            }
            break;
          case 'Set':
            if (Array.isArray(value[CACHING_DATA])) {
              return new Set(value[CACHING_DATA]);
            }
            break;
          case 'Date':
            if (typeof value[CACHING_DATA] === 'string') {
              return new Date(value[CACHING_DATA]);
            }
            break;
          case 'BigInt':
            if (typeof value[CACHING_DATA] === 'string') {
              return BigInt(value[CACHING_DATA]);
            }
            break;
        }
      }
    }
    return value;
  }
}
