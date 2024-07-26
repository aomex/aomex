import { i18n } from '@aomex/core';
import { Store } from './store';

export class CacheMemoryStore extends Store {
  private data = new Map<string, { value: string | string[]; expires?: number }>();

  override async existsKey(key: string): Promise<boolean> {
    return this.getValueSync(key, 'any') !== null;
  }

  override async getValue(key: string): Promise<string | null> {
    const value = this.getValueSync(key, 'string');
    return value;
  }

  override async setValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean> {
    return this.setValueSync(key, value, duration);
  }

  override async setNotExistValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean> {
    const currentValue = this.getValueSync(key, 'string');
    if (currentValue !== null) return false;
    return this.setValueSync(key, value, duration);
  }

  override async leftPushValue(key: string, ...values: string[]): Promise<boolean> {
    let result = this.getValueSync(key, 'array');
    if (result === null) result = [];
    result.push(...values);
    this.setValueSync(key, result);
    return true;
  }

  override async rightPopValue(key: string): Promise<string | null> {
    let result = this.getValueSync(key, 'array');
    if (result === null || !result.length) return null;
    const popValue = result.pop()!;
    if (result.length) {
      this.setValueSync(key, result);
    } else {
      this.data.delete(key);
    }
    return popValue;
  }

  override async increaseValue(key: string): Promise<number> {
    const result = this.getValueSync(key, 'string');
    let value: number;
    if (result === null) {
      this.data.set(key, { value: '0' });
      value = 0;
    } else {
      value = Number(result);
    }

    if (Number.isNaN(value) || !Number.isInteger(value)) {
      throw new Error('缓存值不是整数类型');
    }

    this.setValueSync(key, String(++value));
    return value;
  }

  override async decreaseValue(key: string): Promise<number> {
    const result = this.getValueSync(key, 'string');
    let value: number;
    if (result === null) {
      this.data.set(key, { value: '0' });
      value = 0;
    } else {
      value = Number(result);
    }

    if (Number.isNaN(value) || !Number.isInteger(value)) {
      throw new Error(i18n.t('cache.not_integer'));
    }

    this.setValueSync(key, String(--value));
    return value;
  }

  override async deleteValue(key: string): Promise<boolean> {
    this.data.delete(key);
    return true;
  }

  override async deleteAllValues(): Promise<boolean> {
    this.data.clear();
    return true;
  }

  override async expireKey(key: string, duration: number): Promise<boolean> {
    const result = this.data.get(key);
    if (!result) return false;
    if (result.expires && result.expires < Date.now()) return false;
    result.expires = Date.now() + duration;
    return true;
  }

  override async ttlKey(key: string): Promise<number> {
    const result = this.data.get(key);
    if (!result) return -2;
    if (!result.expires) return -1;
    if (result.expires < Date.now()) return -2;
    return result.expires - Date.now();
  }

  protected getValueSync<T extends 'string' | 'array' | 'any'>(
    key: string,
    assertType: T,
  ):
    | (T extends 'any' ? string | string[] : T extends 'string' ? string : Array<string>)
    | null {
    const result = this.data.get(key);
    if (!result) return null;
    if (result.expires && result.expires < Date.now()) return null;
    const value = result.value;

    let isValid = false;
    switch (assertType) {
      case 'string':
        isValid = typeof value === 'string';
        break;
      case 'array':
        isValid = Array.isArray(value);
        break;
      case 'any':
        isValid = true;
        break;
    }

    if (!isValid) {
      throw new Error(i18n.t('cache.wrong_type'));
    }

    return value as any;
  }

  protected setValueSync(
    key: string,
    value: string | string[],
    duration?: number,
  ): boolean {
    this.data.set(key, { value, expires: duration ? Date.now() + duration : undefined });
    return true;
  }

  override async gc() {
    const now = Date.now();
    this.data = new Map(
      Array.from(this.data.entries()).filter(
        ([_, item]) => !item.expires || item.expires > now,
      ),
    );
  }
}
