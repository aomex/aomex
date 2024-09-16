import { CacheAdapter } from '@aomex/cache';
import { Redis, type RedisOptions } from 'ioredis';

export class CacheRedisAdapter extends CacheAdapter {
  public readonly redis: Redis;
  protected version?: string;

  constructor(config: RedisOptions) {
    super();
    this.redis = new Redis({ ...config, lazyConnect: true });
  }

  getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async setValue(
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

  override async setNotExistValue(
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

  async existsKey(key: string): Promise<boolean> {
    const count = await this.redis.exists(key);
    return count === 1;
  }

  async deleteValue(key: string): Promise<boolean> {
    await this.redis.del(key);
    return true;
  }

  async deleteAllValues(): Promise<boolean> {
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

  override increaseValue(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  override decreaseValue(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  override async expireKey(key: string, duration: number): Promise<boolean> {
    const changeRow = await this.redis.pexpire(key, duration);
    return changeRow === 1;
  }

  override async ttlKey(key: string): Promise<number> {
    const result = await this.redis.pttl(key);
    return result;
  }

  override async leftPushValue(key: string, ...values: string[]): Promise<boolean> {
    const changeRow = await this.redis.lpush(key, ...values.reverse());
    return changeRow >= 1;
  }

  override async rightPopValue(key: string): Promise<string | null> {
    const result = await this.redis.rpop(key);
    return result;
  }
}

export const redisAdapter = (config: RedisOptions) => new CacheRedisAdapter(config);
