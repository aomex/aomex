import { AsyncLocalStorage } from 'node:async_hooks';

export interface AsyncTraceRecord {
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
  delta: number;
  /**
   * 父链路
   */
  parent?: string;
  /**
   * 子链路
   */
  children: AsyncTraceRecord[];
}

class AsyncTrace {
  public records: AsyncTraceRecord[] = [];

  protected readonly storage = new AsyncLocalStorage<string>();
  protected idSequence = 0;

  run<T>(label: string, callback: (id: string) => Promise<T>): Promise<T> {
    const parent = this.storage.getStore();

    if (++this.idSequence >= Number.MAX_SAFE_INTEGER) {
      this.idSequence = 0;
    }

    return new Promise<T>((resolve, reject) => {
      const start = Date.now();
      const id = start + '.' + this.idSequence;

      this.storage.run(id, async () => {
        const done = () => {
          const end = Date.now();
          this.records.push({
            id,
            start,
            end,
            delta: end - start,
            label,
            parent,
            children: this.records.filter((item) => item.parent === id),
          });
          this.records = this.records.filter((item) => item.parent !== id);
        };

        try {
          const result = await callback(id);
          done();
          resolve(result);
        } catch (e) {
          done();
          reject(e);
        }
      });
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
}

export const asyncTrace = new AsyncTrace();
