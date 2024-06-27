const time = Date.now() * 1e3;
const start = process.hrtime.bigint();

export abstract class RateLimitStore {
  abstract getAndSet(data: {
    key: string;
    maxRequest: number;
    duration: number;
  }): Promise<RateLimitState>;

  protected getMicroTime() {
    return time + Number(process.hrtime.bigint() - start) * 1e-3;
  }
}

export interface RateLimitState {
  /**
   * 标识
   */
  key: string;
  /**
   * 重置的具体时间戳，单位：`us`
   */
  resetAt: number;
  /**
   * 剩余可用请求次数
   */
  remaining: number;
}
