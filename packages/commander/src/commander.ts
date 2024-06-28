import { Middleware, compose, middleware, type ComposeFn } from '@aomex/core';
import { toArray, type Union2Intersection } from '@aomex/internal-tools';
import { Builder, type BuilderOptions } from './builder';
import {
  ConsoleApp,
  type ConsoleMiddleware,
  type ConsoleMiddlewareToken,
} from '@aomex/console';

export interface CommanderOptions<T extends ConsoleMiddlewareToken[] | []> {
  prefix?: string;
  mount?: T;
}

export class Commander<
  T extends ConsoleMiddlewareToken[] | [] = any[],
  Props extends object | unknown = ConsoleApp.Props &
    Union2Intersection<Middleware.CollectArrayType<T[number]>>,
> {
  protected readonly middlewareList: ConsoleMiddlewareToken[];
  protected readonly prefix: string;
  protected readonly builders: Builder[] = [];

  constructor(protected readonly opts: CommanderOptions<T> = {}) {
    this.prefix = opts.prefix || '';
    this.middlewareList = opts.mount || [];
  }

  public create<T extends ConsoleMiddlewareToken<object>[] | []>(
    commandName: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.Interface<Props, T> {
    const builder = new Builder(this.prefix, toArray(commandName), options);
    options.disable !== true && this.builders.push(builder);
    return undefined as any;
  }

  protected toMiddleware(): ConsoleMiddleware {
    const builders = [...this.builders];
    const buildersLength = builders.length;

    const commandFn: ComposeFn[] = builders.map((builder) => {
      return compose(this.middlewareList.concat(builder['middlewareList']));
    });

    return middleware.console({
      fn: (ctx, next) => {
        const { input } = ctx;
        const { command } = input;

        for (let i = 0; i < buildersLength; ++i) {
          if (builders[i]!.match(command)) {
            ctx.commandMatched = true;
            return commandFn[i]!(ctx, next);
          }
        }

        return next();
      },
      help: {
        onDocument: async (doc, { children, collectCommand }) => {
          for (const builder of builders) {
            for (const commandName of builder.commands) {
              doc[commandName] = { ...builder.docs };
              collectCommand(
                commandName,
                this.middlewareList.concat(builder['middlewareList']),
              );
            }
          }

          const totalMiddlewareList = [...this.middlewareList];
          for (const builder of builders) {
            totalMiddlewareList.push(...builder['middlewareList']);
          }
          await children(totalMiddlewareList);
        },
        postDocument: async (_, { children }) => {
          const totalMiddlewareList = [...this.middlewareList];
          for (const builder of builders) {
            totalMiddlewareList.push(...builder['middlewareList']);
          }
          await children(totalMiddlewareList);
        },
      },
    });
  }
}
