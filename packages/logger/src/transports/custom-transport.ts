import { Transport } from './transport';
import type { LogRecord } from '../types';

/**
 * 自定义消费逻辑；`this` 绑定为 Transport，可复用 `formatLog` / `dateToString`。
 *
 * ```typescript
 * new CustomTransport({
 *   consume(log) {
 *     // 例如推到自建队列、写数据库等
 *     console.log(this.formatLog(log, 'json'));
 *   },
 * });
 * ```
 */
export class CustomTransport extends Transport {
  protected readonly consumeHandle: (
    this: Transport,
    log: LogRecord,
  ) => void | Promise<void>;

  constructor(opts: {
    consume: (this: Transport, log: LogRecord) => void | Promise<void>;
  }) {
    super();
    this.consumeHandle = opts.consume;
  }

  override async consume(log: LogRecord): Promise<void> {
    await this.consumeHandle.call(this, log);
  }
}
