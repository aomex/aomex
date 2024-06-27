import { Caching } from '@aomex/internal-cache';
import { Redis, type RedisOptions } from 'ioredis';

export interface RedisCacheOptions extends Caching.Options {
  redis: Redis | RedisOptions;
}

export class RedisCache extends Caching {
  public readonly redis: Redis;
  protected version?: string;

  constructor(config: RedisCacheOptions) {
    super(config);
    this.redis = config.redis instanceof Redis ? config.redis : new Redis(config.redis);
  }

  override getAndDelete<T>(key: string, defaultValue: T): Promise<T>;
  override getAndDelete<T extends string | number | boolean | object>(
    key: string,
  ): Promise<T | null>;
  override async getAndDelete(
    key: string,
    defaultValue?: string | number | boolean | object | undefined,
  ): Promise<any> {
    if (this.version === undefined) {
      const redisInfo = await this.redis.info();
      const matched = redisInfo.match(/^redis_version:\s*(\d+)\.(\d+)\./m);
      this.version = matched ? matched[1]! + matched[2]! : '0.0';
    }

    if (this.version < '6.2') {
      return super.getAndDelete(key, defaultValue);
    }

    const hashKey = this.buildKey(key);
    const result = await this.redis.getdel(hashKey);
    return this.parseValue(result, defaultValue);
  }

  protected getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  protected async setValue(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<boolean> {
    let result: 'OK';
    if (duration !== undefined) {
      result = await this.redis.set(key, value, 'PX', duration);
    } else {
      result = await this.redis.set(key, value);
    }
    return result === 'OK';
  }

  protected override async addValue(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<boolean> {
    let result: 'OK' | null;
    if (duration !== undefined) {
      result = await this.redis.set(key, value, 'PX', duration, 'NX');
    } else {
      result = await this.redis.set(key, value, 'NX');
    }
    return result === 'OK';
  }

  protected async existsKey(key: string): Promise<boolean> {
    const count = await this.redis.exists(key);
    return count === 1;
  }

  protected async deleteValue(key: string): Promise<boolean> {
    await this.redis.del(key);
    return true;
  }

  protected async deleteAllValues(): Promise<boolean> {
    const { redis } = this;
    const redisPrefix = redis.options.keyPrefix ?? '';

    if (redisPrefix) {
      await redis.eval(
        `
for _,k in ipairs(redis.call('keys', ARGV[1])) do 
  redis.call('del', k) 
end
`,
        0,
        `${redisPrefix}*`,
      );
    } else {
      await redis.flushdb();
    }
    return true;
  }

  protected override increaseValue(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  protected override decreaseValue(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  protected override async expireValue(key: string, duration: number): Promise<boolean> {
    const changeRow = await this.redis.pexpire(key, duration);
    return changeRow === 1;
  }
}
