export abstract class CacheAdapter {
  async connect() {}

  abstract existsKey(key: string): Promise<boolean>;
  abstract getValue(key: string): Promise<string | null>;
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
