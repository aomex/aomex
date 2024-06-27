import { MiddlewareChain, type MixinMiddlewareToken } from '@aomex/core';
import type { WebMiddleware } from './web-middleware';

declare module '@aomex/core' {
  export interface MiddlewareChainPlatform {
    readonly web: WebMiddlewareChain;
  }
}

export type WebMiddlewareToken<P extends object = object> =
  | WebMiddleware<P>
  | WebMiddlewareChain<P>
  | MixinMiddlewareToken<P>;

export class WebMiddlewareChain<
  Props extends object = object,
> extends MiddlewareChain<Props> {
  protected declare _web_chain_: 'web-chain';

  declare mount: {
    <P extends object>(
      middleware: WebMiddlewareToken<P> | null,
    ): WebMiddlewareChain<Props & P>;
  };
}

MiddlewareChain.register('web', WebMiddlewareChain);
