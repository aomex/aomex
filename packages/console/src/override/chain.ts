import { Chain, PureMiddlewareToken } from '@aomex/core';
import type { ConsoleMiddleware } from './middleware';

declare module '@aomex/core' {
  export interface ChainPlatform {
    readonly console: ConsoleChain;
  }
}

export type ConsoleMiddlewareToken<P extends object = object> =
  | ConsoleChain<P>
  | ConsoleMiddleware<P>
  | PureMiddlewareToken<P>;

export class ConsoleChain<Props extends object = object> extends Chain<Props> {
  protected declare _console_chain_: 'console-chain';

  declare mount: {
    <P extends object>(
      middleware: ConsoleMiddlewareToken<P> | null,
    ): ConsoleChain<Props & P>;
  };
}

Chain.register('console', ConsoleChain);
