import { Chain, chain, compose, middleware, Middleware } from '@aomex/core';
import type { ConsoleChain, ConsoleMiddlewareToken } from '@aomex/console';
import { Builder, type BuilderOptions } from './builder';
import { toArray } from '@aomex/utility';

export interface CommanderOptions<Props extends object = object> {
  prefix?: string;
  mount?: ConsoleChain<Props>;
}

export class Commander<Props extends object = object> {
  public static getBuilders(router: Commander): Builder[] {
    return router.builders;
  }

  public static getChain(router: Commander): ConsoleChain {
    return router.chain;
  }

  public static toMiddleware(router: Commander) {
    return router.toMiddleware();
  }

  protected readonly chain: ConsoleChain;
  protected readonly prefix: string;
  protected readonly builders: Builder[] = [];

  constructor(protected readonly options: CommanderOptions<Props> = {}) {
    this.prefix = options.prefix || '';
    this.chain = options.mount || chain.console;
  }

  public create<T extends ConsoleMiddlewareToken<object>[] | []>(
    command: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    this.builders.push(
      new Builder<Props, T>(this.prefix, toArray(command), options),
    );
  }

  protected toMiddleware(): Middleware {
    const builders = this.builders;
    let groupChain: Chain | null = null;

    return middleware.console((ctx, next) => {
      const {
        request: { command },
      } = ctx;

      for (let i = 0; i < builders.length; ++i) {
        const builder = builders[i]!;
        if (builder.match(command)) {
          ctx.response.commandMatched = true;
          groupChain ||= Chain.split(this.chain, ctx.app.chainPoints);
          return compose([groupChain, builder.chain])(ctx, next);
        }
      }

      return next();
    });
  }
}
