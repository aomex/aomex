import { Logger, LoggerTransport } from '../../src';

export class MockTransport extends LoggerTransport {
  messages: Logger.Log[] = [];

  override async consume(message: Logger.Log): Promise<any> {
    this.messages.push(message);
  }
}
