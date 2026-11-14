import type { Writable } from 'node:stream';
import { Transport, type TransportFormat } from './transport';
import type { LogRecord } from '../types';

/**
 * 写入任意 Writable 流。
 *
 * ```typescript
 * import { PassThrough } from 'node:stream';
 *
 * new StreamTransport({
 *   stream: process.stdout,
 *   format: 'json',
 * });
 *
 * const sink = new PassThrough();
 * new StreamTransport({ stream: sink });
 * ```
 */
export class StreamTransport extends Transport {
  protected readonly stream: Writable;
  protected readonly format: TransportFormat;

  constructor(opts: {
    stream: Writable;
    /**
     * 输出格式。默认 `text`。
     */
    format?: TransportFormat;
  }) {
    super();
    this.stream = opts.stream;
    this.format = opts.format ?? 'text';
  }

  override async consume(log: LogRecord): Promise<void> {
    const line = `${this.formatLog(log, this.format)}\n`;
    await new Promise<void>((resolve, reject) => {
      this.stream.write(line, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
