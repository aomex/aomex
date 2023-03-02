import { Cache, CacheOptions } from '@aomex/core';
import {
  RedisClientType,
  RedisClientOptions,
  createClient,
  RedisDefaultModules,
} from 'redis';

export interface RedisCacheOptions extends CacheOptions {
  redis:
    | RedisClientType<RedisDefaultModules, any, any>
    | RedisClientOptions<RedisDefaultModules, any, any>;
}

export class RedisCache extends Cache {
  private readonly redis: RedisClientType<RedisDefaultModules, any, any>;

  constructor(config: RedisCacheOptions) {
    super(config);

    this.redis =
      'get' in config.redis && 'set' in config.redis
        ? config.redis
        : createClient(config.redis);
  }

  protected getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  protected async setValue(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<boolean> {
    const result: string | null = await this.redis.set(key, value, {
      PX: duration,
    });
    return result !== null;
  }

  protected override async addValue(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<boolean> {
    const result: string | null = await this.redis.set(key, value, {
      PX: duration,
      NX: true,
    });
    return result !== null;
  }

  protected async existsKey(key: string): Promise<boolean> {
    const count: number = await this.redis.exists(key);
    return count === 1;
  }

  protected async deleteValue(key: string): Promise<boolean> {
    await this.redis.del(key);
    return true;
  }

  protected async deleteAllValues(): Promise<boolean> {
    const pattern = `${this.keyPrefix}*`;
    const keys = await this.redis.keys(pattern);
    await this.redis.del(keys);
    return true;
  }
}
