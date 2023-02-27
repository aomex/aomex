import type { ConsoleApp } from './app';
import type { ConsoleRequest } from './request';
import type { ConsoleResponse } from './response';

export class ConsoleContext {
  constructor(
    public readonly app: ConsoleApp,
    public readonly request: ConsoleRequest,
    public readonly response: ConsoleResponse,
  ) {}
}
