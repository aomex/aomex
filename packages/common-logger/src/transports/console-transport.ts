import { styleText } from 'node:util';
import type tty from 'node:tty';
import { LoggerTransport } from '../logger-transport';
import type { Logger } from '../logger';

export class ConsoleTransport extends LoggerTransport {
  protected readonly colors: Record<string, Parameters<typeof styleText>[0]>;
  protected readonly writer: tty.WriteStream;

  constructor(
    opts: {
      colors?: Record<string, Parameters<typeof styleText>[0]>;
      output?: tty.WriteStream;
    } = {},
  ) {
    super();
    this.colors = opts.colors || {};
    this.writer = opts.output || process.stdout;
    //  {
    //   debug: 'cyan',
    //   info: 'green',
    //   warn: 'yellow',
    //   warning: 'yellow',
    //   error: 'red',
    //   fatal: 'redBright',
    // };
  }

  override async consume(message: Logger.Message): Promise<any> {
    const color = this.colors[message.level];
    const time = this.dateToString(new Date(message.timestamp));
    const level = `[${message.level}]`;
    this.writer.write(
      `${color ? styleText(color, level) : level} ${color ? styleText(color, time) : time} ${message.text}\n`,
    );
  }
}
