import { Caching } from '@aomex/internal-cache';

export class MemoryCache extends Caching {
  private data = new Map<string, { value: string; expires?: number }>();

  protected override async existsKey(key: string): Promise<boolean> {
    return this.getValueSync(key) !== null;
  }

  protected override async getValue(key: string): Promise<string | null> {
    return this.getValueSync(key);
  }

  protected override async setValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean> {
    return this.setValueSync(key, value, duration);
  }

  protected override async addValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean> {
    if (this.getValueSync(key) !== null) return false;
    return this.setValueSync(key, value, duration);
  }

  protected override async increaseValue(key: string): Promise<number> {
    const result = this.getValueSync(key);
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

  protected override async decreaseValue(key: string): Promise<number> {
    const result = this.getValueSync(key);
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

    this.setValueSync(key, String(--value));
    return value;
  }

  protected override async deleteValue(key: string): Promise<boolean> {
    this.data.delete(key);
    return true;
  }

  protected override async deleteAllValues(): Promise<boolean> {
    this.data.clear();
    return true;
  }

  protected override async expireValue(key: string, duration: number): Promise<boolean> {
    const result = this.data.get(key);
    if (!result) return false;
    if (result.expires && result.expires < Date.now()) return false;
    result.expires = Date.now() + duration;
    return true;
  }

  protected getValueSync(key: string): string | null {
    const result = this.data.get(key);
    if (!result) return null;
    if (result.expires && result.expires < Date.now()) return null;
    return result.value;
  }

  protected setValueSync(key: string, value: string, duration?: number): boolean {
    this.data.set(key, { value, expires: duration ? Date.now() + duration : undefined });
    return true;
  }

  protected override async gc() {
    const now = Date.now();
    this.data = new Map(
      Array.from(this.data.entries()).filter(
        ([_, item]) => !item.expires || item.expires > now,
      ),
    );
  }
}
