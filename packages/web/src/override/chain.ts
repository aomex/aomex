import { Chain, type PureChain, type PureMiddlewareToken } from '@aomex/core';
import type { WebMiddleware } from './middleware';

declare module '@aomex/core' {
  export interface ChainPlatform {
    readonly web: WebChain;
  }
}

export type WebMiddlewareToken<P extends object = object> =
  | WebMiddleware<P>
  | WebChain<P>
  | PureMiddlewareToken<P>;

export class WebChain<Props extends object = object> extends Chain<Props> {
  protected declare _web_chain_: 'web-chain';

  declare mount: {
    <P extends object>(
      middleware: WebChain | PureChain | WebMiddlewareToken<P> | null,
    ): WebChain<Props & P>;
  };
}

Chain.register('web', WebChain);
