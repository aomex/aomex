import type { ConsoleApp } from './app';
import type { ConsoleInput } from './input';
import type { ConsoleTerminal } from './terminal';

export class ConsoleContext {
  public commandMatched: boolean = false;

  constructor(
    public readonly app: ConsoleApp,
    public readonly input: ConsoleInput,
    public readonly terminal: ConsoleTerminal,
  ) {}
}
