import { Chain, chain, compose, middleware, Middleware } from '@aomex/core';
import type {
  ConsoleApp,
  ConsoleChain,
  ConsoleMiddlewareToken,
} from '@aomex/console';
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
    const groupChain = new Map<ConsoleApp, Chain>();

    return middleware.console((ctx, next) => {
      const {
        app,
        request: { command },
      } = ctx;

      for (let i = 0; i < this.builders.length; ++i) {
        const builder = this.builders[i]!;
        if (builder.match(command)) {
          ctx.response.commandMatched = true;
          if (!groupChain.has(app)) {
            groupChain.set(app, Chain.split(this.chain, app.chainPoints));
          }
          return compose([groupChain.get(app)!, builder.chain])(ctx, next);
        }
      }

      return next();
    });
  }
}
