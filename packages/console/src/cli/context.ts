import type { ConsoleApp } from './app';
import type { ConsoleInput } from './input';

export class ConsoleContext {
  public commandMatched: boolean = false;

  constructor(
    public readonly app: ConsoleApp,
    public readonly input: ConsoleInput,
  ) {}

  /** 与构造时传入的 `logger` 相同，取自 app */
  get logger(): ConsoleApp.Logger {
    return this.app['logger'];
  }
}
