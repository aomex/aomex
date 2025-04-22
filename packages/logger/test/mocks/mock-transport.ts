import { Logger, Transport } from '../../src';

export class MockTransport extends Transport {
  messages: Logger.Log[] = [];

  override async consume(message: Logger.Log): Promise<any> {
    this.messages.push(message);
  }
}
