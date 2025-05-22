import { AsyncLocalStorage } from 'node:async_hooks';

export interface AsyncTraceRecord {
  /**
   * 唯一编号，用于识别子链路
   */
  id: string;
  /**
   * 标签
   */
  label: string;
  /**
   * 开始时间，毫秒时间戳
   */
  start: number;
  /**
   * 结束时间，毫秒时间戳
   */
  end: number;
  /**
   * 时间周期，毫秒
   */
  duration: number;
  /**
   * 父链路
   */
  parent?: string;
  /**
   * 子链路
   */
  children: AsyncTraceRecord[];
  /**
   * 报错内容
   */
  error?: Error | null;
}

class AsyncTrace {
  public records: AsyncTraceRecord[] = [];

  protected readonly storage = new AsyncLocalStorage<string>();
  protected idSequence = 0;

  async run<T>(label: string, callback: (id: string) => Promise<T>): Promise<T> {
    const parent = this.storage.getStore();

    if (++this.idSequence >= Number.MAX_SAFE_INTEGER) {
      this.idSequence = 0;
    }

    const start = Date.now();
    const id = start + '.' + this.idSequence;

    return this.storage.run(id, async () => {
      const done = (err: Error | null) => {
        const end = Date.now();
        this.records.push({
          id,
          start,
          end,
          duration: end - start,
          label,
          parent,
          children: this.records.filter((item) => item.parent === id),
          error: err,
        });
        this.records = this.records.filter((item) => item.parent !== id);
      };

      try {
        const result = await callback(id);
        done(null);
        return result;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        done(err);
        throw err;
      }
    });
  }

  getRecord(id: string) {
    const index = this.records.findIndex((item) => item.id === id);
    const record = this.records[index];
    if (record && !record.parent) {
      this.records.splice(index, 1);
    }
    return record!;
  }

  /**
   * 转成调用栈字符串
   * ```
   * foo: 123ms
   * bar: 2000ms
   *     baz: 300ms
   * test: 501ms
   * ```
   */
  toStack(records: AsyncTraceRecord[], indent: number = 4, level: number = 0): string {
    return records
      .map((record) => {
        return `${' '.repeat(level * indent)}${record.label}: ${record.duration}ms
${this.toStack(record.children, indent, level + 1)}`;
      })
      .join('');
  }
}

export const asyncTrace = new AsyncTrace();
