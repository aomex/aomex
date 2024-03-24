import type { Next } from './compose';

export declare namespace Middleware {
  export type Infer<T> =
    T extends Middleware<infer R>
      ? R
      : T extends (...args: any[]) => Middleware<infer R>
        ? R
        : never;

  export type Fn<Ctx = any> = (ctx: Ctx, next: Next) => any;
}

export interface MiddlewarePlatform {}

/**
 * 中间件基类
 */
export abstract class Middleware<Props extends object = object> {
  protected declare _props_must_be_used_: Props;

  constructor(protected readonly fn: Middleware.Fn) {}

  /**
   * 注册中间件
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
