import { Middleware, type Next } from '@aomex/core';
import assert from 'node:assert';
import type { NonReadonly } from '@aomex/helper';
import type { Argv } from 'yargs';
import type { ConsoleContext } from '../app/context';
import { ShowHelp, ShowHelpProps } from '../middleware/showHelp';

export type YargsInstance = Argv;

declare module '@aomex/core' {
  export interface MiddlewarePlatform {
    readonly console: <Props extends object = object>(
      fn: (ctx: NonReadonly<Props> & ConsoleContext, next: Next) => any,
    ) => ConsoleMiddleware<Props>;
    readonly help: <Props extends object = object>(
      fn: (
        ctx: NonReadonly<Props> & ShowHelpProps & ConsoleContext,
        next: Next,
      ) => any,
    ) => HelpMiddleware<object>;
  }
}

export class ConsoleMiddleware<
  Props extends object = object,
> extends Middleware<Props> {
  protected declare _console_middleware_: 'console-middleware';

  constructor(
    fn: (ctx: NonReadonly<Props> & ConsoleContext, next: Next) => any,
  ) {
    super(fn);
  }

  public toHelp(yargs: YargsInstance): void {
    assert(yargs);
  }
}

export class HelpMiddleware<
  Props extends object = object,
> extends ConsoleMiddleware<Props> {
  constructor(
    fn: (
      ctx: NonReadonly<Props> & ShowHelpProps & ConsoleContext,
      next: Next,
    ) => any,
  ) {
    super((ctx, next) => {
      return (ctx as unknown as ShowHelpProps).cli instanceof ShowHelp
        ? fn(ctx as any, next)
        : next();
    });
  }
}

Middleware.register('console', ConsoleMiddleware);
Middleware.register('help', HelpMiddleware);
