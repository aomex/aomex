import type { Next } from './compose';
import { Middleware } from './middleware';

export interface _PureFn {
  <Props extends object = object>(
    fn: (ctx: Props, next: Next) => any,
  ): PureMiddleware<Props>;
}

export class PureMiddleware<
  Props extends object = object,
> extends Middleware<Props> {
  protected declare _pure_middleware_: 'pure-middleware';
}

Middleware.register('pure', PureMiddleware);
