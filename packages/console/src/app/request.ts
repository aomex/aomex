import parse from 'yargs-parser';
import type { ConsoleApp } from './app';

export class ConsoleRequest {
  public readonly options: Record<string, unknown>;
  public readonly command: string;

  constructor(public readonly app: ConsoleApp, public readonly argv: string[]) {
    const { _: commands, ...query } = parse(argv);
    this.options = query;
    this.command = String(commands[0] || '');
  }
}
