import type { Next } from './compose';
import type { _PureFn } from './pure-middleware';

export declare namespace Middleware {
  export type Infer<T> = T extends Middleware<infer R>
    ? R
    : T extends (...args: any[]) => Middleware<infer R>
    ? R
    : never;

  export type Fn<Ctx = any> = (ctx: Ctx, next: Next) => any;
}

export interface MiddlewarePlatform {
  /**
   * Pure middleware without context
   */
  readonly pure: _PureFn;
}

/**
 * Base middleware
 */
export abstract class Middleware<Props extends object = object> {
  protected declare _props_must_be_used_: Props;

  constructor(public readonly fn: Middleware.Fn) {}

  /**
   * Register middleware creator with specific context
   */
  static register(
    platform: keyof MiddlewarePlatform,
    SubMiddleware: new (...args: any[]) => Middleware,
  ) {
    Object.defineProperty(middleware, platform, {
      get() {
        return (fn: Middleware.Fn) => new SubMiddleware(fn);
      },
    });
  }
}

export const middleware: MiddlewarePlatform = {} as any;
