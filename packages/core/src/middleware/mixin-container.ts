import type { MixinMiddleware } from './mixin-middleware';
import { Container } from './container';

declare module './container' {
  export interface ContainerPlatform {
    /**
     * 没有特定上下文的纯链条，支持所有应用
     */
    readonly mixin: MixinContainer;
  }
}

export type MixinMiddlewareToken<P extends object = object> =
  | MixinContainer<P>
  | MixinMiddleware<P>;

export class MixinContainer<
  Props extends object = object,
> extends Container<Props> {
  protected declare _mixin_container_: 'mixin-container';

  declare mount: {
    <P extends object>(
      token: MixinMiddlewareToken<P> | null,
    ): MixinContainer<Props & P>;
  };
}

Container.register('mixin', MixinContainer);
