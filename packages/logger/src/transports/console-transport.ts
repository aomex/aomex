import { styleText } from 'node:util';
import type tty from 'node:tty';
import { Transport } from './transport';
import type { Logger } from '../logger';

export class ConsoleTransport extends Transport {
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
  }

  override async consume(log: Logger.Log): Promise<any> {
    const color = this.colors[log.level];
    const time = this.dateToString(log.timestamp);
    const level = `[${log.level}]`;
    this.writer.write(
      `${color ? styleText(color, level) : level} ${color ? styleText(color, time) : time} ${log.content}\n`,
    );
  }
}
