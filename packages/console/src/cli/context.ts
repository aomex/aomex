import type { ConsoleApp } from './app';
import type { ConsoleInput } from './input';

export class ConsoleContext {
  public commandMatched: boolean = false;

  constructor(
    public readonly app: ConsoleApp,
    public readonly input: ConsoleInput,
  ) {}
}
