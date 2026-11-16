import type { Next } from './compose';
import type { MixinMiddleware } from './mixin-middleware';

export declare namespace Middleware {
  export type Infer<T> =
    T extends Middleware<infer R>
      ? R
      : T extends (...args: any[]) => infer Return
        ? Awaited<Return> extends Middleware<infer R>
          ? R
          : never
        : never;

  /** 合并依赖；默认 `object` 不参与交叉 */
  export type MergeDeps<
    Current extends object,
    Next extends object,
  > = object extends Current
    ? object extends Next
      ? Current
      : Next
    : object extends Next
      ? Current
      : Flatten<Current & Next>;

  export type Flatten<T extends object> = { [K in keyof T]: T[K] } & {};

  /** 把 Deps 叠到平台上下文上 */
  export type WithDeps<Ctx extends object, Deps extends object> = object extends Deps
    ? Ctx
    : object extends Ctx
      ? Flatten<Deps>
      : Ctx & Flatten<Deps>;

  export type Fn<Ctx = any> = (ctx: Ctx, next: Next) => any;

  export type CollectArrayType<T> = T extends Middleware<infer R> ? R : unknown;
}

export interface MiddlewarePlatform<Deps extends object = object> {
  /**
   * 仅用于类型提示：假定上游已挂载对应中间件，不实际执行。
   * 可无限链式调用。
   */
  readonly dependsOn: <
    T extends
      Middleware<any> | ((...args: any[]) => Middleware<any> | Promise<Middleware<any>>),
  >(
    _middleware: T,
  ) => MiddlewarePlatform<Middleware.MergeDeps<Deps, Middleware.Infer<T>>>;
}

/**
 * 中间件基类
 */
export abstract class Middleware<Props extends object = object> {
  declare public _contextType: object;

  declare protected _props_must_be_used_: Props;

  constructor(protected readonly fn: Middleware.Fn) {}

  /**
   * 跳过执行中间件。
   *
   * 可传入布尔值（固定跳过/不跳过），或根据上下文动态判断的函数。
   * 返回的类型未使用Partial，因为skip的设计是在部分场景下才需要触发的。
   */
  public skip(
    when: boolean | ((ctx: this['_contextType']) => boolean | Promise<boolean>),
  ): MixinMiddleware<Props> {
    return middleware.mixin(async (ctx, next) => {
      const skipped = typeof when === 'boolean' ? when : await when(ctx);
      return skipped ? next() : this.fn(ctx, next);
    });
  }

  /**
   * 注册中间件
   */
  static register(
    platform: Exclude<keyof MiddlewarePlatform, 'dependsOn'>,
    SubMiddleware: new (...args: any[]) => Middleware,
  ) {
    Object.defineProperty(middleware, platform, {
      get() {
        return (...args: any[]) => new SubMiddleware(...args);
      },
    });
  }
}

export const middleware: MiddlewarePlatform = {
  dependsOn() {
    return middleware;
  },
} as any;
