import { Logger, LoggerTransport } from '../../src';

export class MockTransport extends LoggerTransport {
  messages: Logger.Message[] = [];

  override async consume(message: Logger.Message): Promise<any> {
    this.messages.push(message);
  }
}
