import type { MixinMiddleware } from './mixin-middleware';
import { MiddlewareChain } from './middleware-chain';

declare module './middleware-chain' {
  export interface MiddlewareChainPlatform {
    /**
     * 没有特定上下文的纯链条，支持所有应用
     */
    readonly mixin: MixinMiddlewareChain;
  }
}

export type MixinMiddlewareToken<P extends object = object> =
  | MixinMiddlewareChain<P>
  | MixinMiddleware<P>;

export class MixinMiddlewareChain<
  Props extends object = object,
> extends MiddlewareChain<Props> {
  protected declare _mixin_chain_: 'mixin-chain';

  declare mount: {
    <P extends object>(
      token: MixinMiddlewareToken<P> | null,
    ): MixinMiddlewareChain<Props & P>;
  };
}

MiddlewareChain.register('mixin', MixinMiddlewareChain);
