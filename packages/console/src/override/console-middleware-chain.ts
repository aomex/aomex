import { MiddlewareChain, type MixinMiddlewareToken } from '@aomex/core';
import type { ConsoleMiddleware } from './console-middleware';

declare module '@aomex/core' {
  export interface MiddlewareChainPlatform {
    readonly console: ConsoleMiddlewareChain;
  }
}

export type ConsoleMiddlewareToken<P extends object = object> =
  | ConsoleMiddleware<P>
  | ConsoleMiddlewareChain<P>
  | MixinMiddlewareToken<P>;

export class ConsoleMiddlewareChain<
  Props extends object = object,
> extends MiddlewareChain<Props> {
  protected declare _console_chain_: 'console-chain';

  declare mount: {
    <P extends object>(
      middleware: ConsoleMiddlewareToken<P> | null,
    ): ConsoleMiddlewareChain<Props & P>;
  };
}

MiddlewareChain.register('console', ConsoleMiddlewareChain);
