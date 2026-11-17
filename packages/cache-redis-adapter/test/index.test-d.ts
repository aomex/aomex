import { CacheRedisAdapter, type RedisOptions } from '../src';

const opts: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
};
new CacheRedisAdapter(opts);

// @ts-expect-error 不允许省略配置
new CacheRedisAdapter();
