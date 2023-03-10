import { Chain, middleware } from '@aomex/core';
import {
  ConsoleChain,
  ConsoleContext,
  ConsoleMiddlewareToken,
} from '@aomex/console';
import type { Union2Intersection } from '@aomex/utility';

export interface CommandDocs {
  summary?: string;
  description?: string;
}

type CollectArrayType<T> = T extends ConsoleMiddlewareToken<infer R>
  ? R
  : object;

export interface BuilderOptions<
  Props extends object,
  T extends ConsoleMiddlewareToken[] | [],
> {
  showInHelp?: boolean;
  docs?: CommandDocs;
  mount?: T;
  action: (
    ctx: Props &
      Union2Intersection<CollectArrayType<T[number]>> &
      ConsoleContext,
  ) => any;
}

export class Builder<
  Props extends object = object,
  T extends ConsoleMiddlewareToken[] | [] = [],
> {
  public readonly chain: ConsoleChain;
  public readonly commands: string[];
  public readonly showInHelp: boolean;
  public readonly docs: CommandDocs;

  constructor(
    prefix: string,
    commands: string[],
    options: BuilderOptions<Props, T>,
  ) {
    const middlewareList = Chain.flatten(options.mount);
    middlewareList.push(
      middleware.console((ctx, _) => options.action(ctx as any)),
    );

    this.showInHelp = options.showInHelp ?? true;
    this.docs = options.docs || {};
    this.chain = new ConsoleChain(middlewareList);
    this.commands = commands.map((item) => prefix + item);
  }

  public match(command: string): boolean {
    return this.commands.includes(command);
  }
}
