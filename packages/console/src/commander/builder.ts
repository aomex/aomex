import type { ConsoleContext } from '../cli';
import type { ConsoleMiddlewareToken, ConsoleDocument } from '../override';
import { Middleware, middleware } from '@aomex/common';
import type { Union2Intersection } from '@aomex/internal-tools';

export declare namespace Builder {
  export type Interface<
    Props extends object | unknown,
    T extends ConsoleMiddlewareToken[] | [],
  > = Props & Union2Intersection<Middleware.CollectArrayType<T[number]>>;

  export type Context<
    Props extends object | unknown,
    T extends ConsoleMiddlewareToken[] | [],
  > = Props & Union2Intersection<Middleware.CollectArrayType<T[number]>> & ConsoleContext;

  export type Docs = Omit<ConsoleDocument.CommandItem, 'parameters'>;
}

export interface BuilderOptions<
  Props extends object | unknown,
  T extends ConsoleMiddlewareToken[] | [],
> {
  /**
   * 禁用当前路由。默认 `false`
   */
  disable?: boolean;
  docs?: Builder.Docs;
  mount?: T;
  action: (ctx: Builder.Context<Props, T>) => any;
}

export class Builder<
  Props extends object | unknown = object,
  T extends ConsoleMiddlewareToken[] | [] = [],
> {
  public readonly docs: Builder.Docs;
  public readonly commands: string[];
  protected readonly middlewareList: ConsoleMiddlewareToken[];

  constructor(prefix: string, commands: string[], options: BuilderOptions<Props, T>) {
    this.docs = options.docs || {};
    this.docs.showInHelp ??= true;
    this.commands = commands.map((item) => prefix + item);
    this.middlewareList = [
      ...(options.mount || []),
      middleware.console((ctx, _) => options.action(ctx as any)),
    ];
  }

  public match(command: string): boolean {
    return this.commands.includes(command);
  }
}
