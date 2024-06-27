import type {
  ConsoleContext,
  ConsoleDocument,
  ConsoleMiddlewareToken,
} from '@aomex/console';
import { middleware, flattenMiddlewareToken, Middleware } from '@aomex/core';
import type { Union2Intersection } from '@aomex/internal-tools';

export declare namespace Builder {
  export type Interface<
    Props extends object,
    T extends ConsoleMiddlewareToken[] | [],
  > = Props & Union2Intersection<CollectArrayType<T[number]>>;

  export type Context<
    Props extends object,
    T extends ConsoleMiddlewareToken[] | [],
  > = Props & Union2Intersection<CollectArrayType<T[number]>> & ConsoleContext;

  export type Docs = Omit<ConsoleDocument.CommandItem, 'parameters'>;
}

type CollectArrayType<T> = T extends ConsoleMiddlewareToken<infer R> ? R : object;

export interface BuilderOptions<
  Props extends object,
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
  Props extends object = object,
  T extends ConsoleMiddlewareToken[] | [] = [],
> {
  public readonly docs: Builder.Docs;
  public readonly commands: string[];
  protected readonly middlewareList: Middleware[];

  constructor(prefix: string, commands: string[], options: BuilderOptions<Props, T>) {
    this.docs = options.docs || {};
    this.docs.show ??= true;
    this.commands = commands.map((item) => prefix + item);
    this.middlewareList = flattenMiddlewareToken(options.mount).concat(
      middleware.console((ctx, _) => options.action(ctx as any)),
    );
  }

  public match(command: string): boolean {
    return this.commands.includes(command);
  }
}
