import parse from 'yargs-parser';
import type { ConsoleApp } from './app';

export class ConsoleInput {
  public readonly options: Record<string, unknown>;
  public readonly command: string;

  constructor(
    public readonly app: ConsoleApp,
    public readonly argv: string[],
  ) {
    const { _: commands, ...rawOptions } = parse(argv, {
      configuration: { 'parse-numbers': false },
    });
    this.options = rawOptions;
    this.command = String(commands[0] || '');
  }

  parseArgv(alias?: { [key: string]: string | string[] }): Record<string, unknown> {
    const { _: commands, ...rawOptions } = parse(this.argv, {
      alias,
      configuration: { 'parse-numbers': false },
    });
    return rawOptions;
  }
}
