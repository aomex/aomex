import { Redis, type RedisOptions } from 'ioredis';
import { RateLimitRedisStore } from '../src';

const opts = {} as RedisOptions;
new RateLimitRedisStore(opts);

new RateLimitRedisStore({
  host: '127.0.0.1',
  port: 6379,
});

// @ts-expect-error 不允许直接传入 Redis 实例
new RateLimitRedisStore(new Redis());

// @ts-expect-error 不允许省略配置
new RateLimitRedisStore();
