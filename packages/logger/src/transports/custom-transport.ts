import { Transport } from './transport';
import type { Logger } from '../logger';

export class CustomTransport extends Transport {
  protected readonly consumeHandle: (this: Transport, log: Logger.Log) => Promise<any>;

  constructor(opts: { consume: (this: Transport, log: Logger.Log) => Promise<any> }) {
    super();
    this.consumeHandle = opts.consume.bind(this);
  }

  override async consume(log: Logger.Log): Promise<any> {
    return this.consumeHandle(log);
  }
}
