import type { PureMiddleware } from './pure-middleware';
import { Chain } from './chain';

export type PureMiddlewareToken<P extends object = object> =
  | PureChain<P>
  | PureMiddleware<P>;

export class PureChain<Props extends object = object> extends Chain<Props> {
  protected declare _pure_chain_: 'pure-chain';

  declare mount: {
    <P extends object>(middleware: PureMiddlewareToken<P> | null): PureChain<
      Props & P
    >;
  };
}

Chain.register('pure', PureChain);
