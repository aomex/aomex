import { RateLimitStore, type RateLimitState } from './store';

export class RateLimitMemoryStore extends RateLimitStore {
  private store = new Map<string, { expires: number; records: number[] }>();

  override async onDestroy(): Promise<void> {
    this.store.clear();
  }

  override async getAndSet(data: {
    key: string;
    limit: number;
    window: number;
  }): Promise<RateLimitState> {
    const { key, limit, window: windowMs } = data;
    const now = this.getMicroTime();
    const windowMicro = windowMs * 1_000;
    const startTime = now - windowMicro;

    let result = this.store.get(key);
    if (!result || result.expires < now) {
      this.store.set(key, (result = { expires: now + windowMicro, records: [] }));
    }

    result.records = result.records.filter((record) => record >= startTime);
    const usedCount = result.records.length;
    result.records.push(now);
    result.records = result.records.slice(-limit);
    result.expires = now + windowMicro;

    const remaining = Math.max(limit - usedCount, 0);
    const resetAt = Math.floor(result.records[0]! + windowMicro);

    return { key, remaining, resetAt };
  }
}
