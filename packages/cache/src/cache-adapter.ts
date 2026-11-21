export abstract class CacheAdapter {
  async connect() {}

  async disconnect() {}

  abstract existsKey(key: string): Promise<boolean>;
  abstract getValue(key: string): Promise<string | null>;
  /**
   * 原子地获取并删除（对齐 Redis GETDEL）。
   * 并发调用时只有一方能拿到值，其余得到 `null`。
   */
  abstract getAndDeleteValue(key: string): Promise<string | null>;
  abstract setValue(key: string, value: string, durationMS?: number): Promise<boolean>;
  abstract setNotExistValue(
    key: string,
    value: string,
    durationMS?: number,
  ): Promise<boolean>;
  abstract deleteValue(key: string): Promise<boolean>;
  abstract deleteAllValues(): Promise<boolean>;
  abstract increaseValue(key: string): Promise<number>;
  abstract decreaseValue(key: string): Promise<number>;
  abstract expireKey(key: string, durationMS: number): Promise<boolean>;
  abstract ttlKey(key: string): Promise<number>;
  abstract leftPushValue(key: string, ...values: string[]): Promise<boolean>;
  abstract rightPopValue(key: string): Promise<string | null>;
}
