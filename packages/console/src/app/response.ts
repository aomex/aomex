import type { ConsoleApp } from './app';

export class ConsoleResponse {
  public commandMatched: boolean = false;

  constructor(public readonly app: ConsoleApp) {}
}
