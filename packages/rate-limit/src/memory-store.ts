import { RateLimitStore, type RateLimitState } from './store';

export class RateLimitMemoryStore extends RateLimitStore {
  private store = new Map<string, { expires: number; records: number[] }>();

  override async getAndSet(data: {
    key: string;
    maxRequest: number;
    duration: number;
  }): Promise<RateLimitState> {
    const { key, maxRequest, duration } = data;
    const now = this.getMicroTime();
    const durationMicro = duration * 1_000;
    const startTime = now - durationMicro;

    let result = this.store.get(key);
    if (!result || result.expires < now) {
      this.store.set(key, (result = { expires: now + durationMicro, records: [] }));
    }

    result.records = result.records.filter((record) => record >= startTime);
    const usedCount = result.records.length;
    result.records.push(now);
    result.records = result.records.slice(-maxRequest);
    result.expires = now + durationMicro;

    const remaining = Math.max(maxRequest - usedCount, 0);
    const resetAt = Math.floor(result.records[0]! + durationMicro);

    return { key, remaining, resetAt };
  }
}
