import { Transport, type LogRecord } from '../../src';

export class MockTransport extends Transport {
  messages: LogRecord[] = [];

  override async consume(message: LogRecord): Promise<any> {
    this.messages.push(message);
  }
}
