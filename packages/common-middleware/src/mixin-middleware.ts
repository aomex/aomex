import type { NonReadonly } from '@aomex/internal-tools';
import type { Next } from './compose';
import { Middleware } from './middleware';

declare module './middleware' {
  export interface MiddlewarePlatform {
    /**
     * 没有特定上下文的纯中间件，支持所有应用
     */
    readonly mixin: {
      <Props extends object = object>(
        fn: (ctx: NonReadonly<Props>, next: Next) => any,
      ): MixinMiddleware<Props>;
    };
  }
}

export class MixinMiddleware<Props extends object = object> extends Middleware<Props> {
  protected declare _mixin_middleware_: 'mixin-middleware';
}

Middleware.register('mixin', MixinMiddleware);
