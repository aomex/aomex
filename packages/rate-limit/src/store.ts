const time = Date.now() * 1e3;
const start = process.hrtime.bigint();

export abstract class RateLimitStore {
  abstract getAndSet(data: {
    key: string;
    limit: number;
    window: number;
  }): Promise<RateLimitState>;

  /**
   * 初始化存储（如建立连接）。首次处理请求/消息时经 `registerLifecycle` 调用。
   */
  async onInit(): Promise<void> {}

  /**
   * 销毁存储（如断开连接）。由 `registerLifecycle` 在应用关停时调用。
   */
  async onDestroy(): Promise<void> {}

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
