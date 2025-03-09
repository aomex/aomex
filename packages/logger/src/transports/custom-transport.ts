import { LoggerTransport } from '../logger-transport';
import type { Logger } from '../logger';

export class CustomTransport extends LoggerTransport {
  protected readonly consumeHandle: (
    this: LoggerTransport,
    log: Logger.Log,
  ) => Promise<any>;

  constructor(opts: {
    consume: (this: LoggerTransport, log: Logger.Log) => Promise<any>;
  }) {
    super();
    this.consumeHandle = opts.consume.bind(this);
  }

  override async consume(log: Logger.Log): Promise<any> {
    return this.consumeHandle(log);
  }
}
