import {
  mdchain,
  compose,
  middleware,
  flattenMiddlewareToken,
  type ComposeFn,
} from '@aomex/core';
import { toArray } from '@aomex/internal-tools';
import { Builder, type BuilderOptions } from './builder';
import {
  type ConsoleApp,
  type ConsoleMiddleware,
  type ConsoleMiddlewareChain,
  type ConsoleMiddlewareToken,
} from '@aomex/console';

export interface CommanderOptions<Props extends object = object> {
  prefix?: string;
  mount?: ConsoleMiddlewareChain<Props>;
}

export class Commander<Props extends object = object> {
  protected readonly middlewareChain: ConsoleMiddlewareChain;
  protected readonly prefix: string;
  protected readonly builders: Builder[] = [];

  constructor(protected readonly opts: CommanderOptions<Props> = {}) {
    this.prefix = opts.prefix || '';
    this.middlewareChain = opts.mount || mdchain.console;
  }

  public create<T extends ConsoleMiddlewareToken<object>[] | []>(
    commandName: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.Interface<Props, T> {
    const builder = new Builder(this.prefix, toArray(commandName), options);
    options.disable !== true && this.builders.push(builder);
    return undefined as any;
  }

  protected toMiddleware(app: ConsoleApp): ConsoleMiddleware {
    const builders = [...this.builders];
    const buildersLength = builders.length;
    const middlewareList = flattenMiddlewareToken(
      this.middlewareChain['split'](app['point']),
    );
    const commandFn: ComposeFn[] = builders.map((builder) => {
      return compose(middlewareList.concat(builder['middlewareList']));
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
        async onDocument(doc, { children, collectCommand }) {
          for (const builder of builders) {
            for (const commandName of builder.commands) {
              doc[commandName] = { ...builder.docs };
              collectCommand(
                commandName,
                middlewareList.concat(builder['middlewareList']),
              );
            }
          }

          const totalMiddlewareList = [...middlewareList];
          for (const builder of builders) {
            totalMiddlewareList.push(...builder['middlewareList']);
          }
          await children(totalMiddlewareList);
        },
        async postDocument(_, { children }) {
          const totalMiddlewareList = [...middlewareList];
          for (const builder of builders) {
            totalMiddlewareList.push(...builder['middlewareList']);
          }
          await children(totalMiddlewareList);
        },
      },
    });
  }
}
