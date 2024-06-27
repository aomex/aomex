import { RateLimitStore, type RateLimitState } from '@aomex/rate-limit';
import { Redis, type RedisOptions } from 'ioredis';

export class RateLimitRedisStore extends RateLimitStore {
  protected readonly redis: Redis;

  constructor(opts: Redis | RedisOptions) {
    super();
    this.redis = opts instanceof Redis ? opts : new Redis(opts);
  }

  override async getAndSet(data: {
    key: string;
    maxRequest: number;
    duration: number;
  }): Promise<RateLimitState> {
    const { key, maxRequest, duration } = data;
    const now = this.getMicroTime();
    const durationMicro = duration * 1_000;
    const startTime = now - durationMicro;

    const result = (await this.redis
      .multi()
      .zremrangebyscore(key, 0, startTime)
      .zcard(key)
      .zadd(key, now, now)
      .zrange(key, 0, 0)
      .zrange(key, -maxRequest, -maxRequest)
      .zremrangebyrank(key, 0, -(maxRequest + 1))
      .pexpire(key, duration)
      .exec()) as [
      never,
      [null, usedCount: Awaited<ReturnType<Redis['zcard']>>],
      never,
      [null, oldest: Awaited<ReturnType<Redis['zrange']>>],
      [null, oldestInRange: Awaited<ReturnType<Redis['zrange']>>],
      never,
      never,
    ];

    const usedCount = Number(result[1][1]);
    const remaining = Math.max(maxRequest - usedCount, 0);
    const resetAt = Number(result[remaining ? 3 : 4][1][0]) + durationMicro;

    return { key, remaining, resetAt };
  }
}
