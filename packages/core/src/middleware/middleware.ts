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
  public declare _contextType: object;

  protected declare _props_must_be_used_: Props;

  constructor(protected readonly fn: Middleware.Fn) {}

  /**
   * 跳过执行中间件。
   *
   * 返回的类型未使用Partial，因为skip的设计是在部分场景下才需要触发的。
   */
  public skip(
    when: (ctx: this['_contextType']) => boolean | Promise<boolean>,
  ): Middleware<Props> {
    return middleware.mixin(async (ctx, next) => {
      const skipped = await when(ctx);
      return skipped ? next() : this.fn(ctx, next);
    });
  }

  /**
   * 注册中间件
   */
  static register(
    platform: keyof MiddlewarePlatform,
    SubMiddleware: new (...args: any[]) => Middleware,
  ) {
    Object.defineProperty(middleware, platform, {
      get() {
        return (...args: any[]) => new SubMiddleware(...args);
      },
    });
  }
}

export const middleware: MiddlewarePlatform = {} as any;
