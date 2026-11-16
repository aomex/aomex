import type { NonReadonly } from '@aomex/internal-tools';
import type { Next } from './compose';
import { Middleware } from './middleware';

declare module './middleware' {
  export interface MiddlewarePlatform<Deps extends object = object> {
    /**
     * 没有特定上下文的纯中间件，支持所有应用
     */
    readonly mixin: {
      <Props extends object = object>(
        fn: (ctx: NonReadonly<Middleware.MergeDeps<Props, Deps>>, next: Next) => any,
      ): object extends Deps
        ? MixinMiddleware<Props>
        : MixinMiddleware<Props> & {
            _contextType: Middleware.WithDeps<object, Deps>;
          };
    };
  }
}

export class MixinMiddleware<Props extends object = object> extends Middleware<Props> {
  declare protected _mixin_middleware_: 'mixin-middleware';
}

Middleware.register('mixin', MixinMiddleware);
