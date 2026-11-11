import type { IsUnion, PromisifyFunction } from '@aomex/internal-tools';
import type { Service } from './service';

type ServiceCtor = abstract new (...args: any) => Service;

/** 生命周期钩子名：按名字剔除，与是否 protected 无关 */
type ServiceLifecycle = 'onInit' | 'onDestroy';

/**
 * 对外服务视图：仅方法，且全部 Promise 化；字段与生命周期钩子不可见。
 * `onInit` / `onDestroy` 即使被 override 成 public 也不会出现在类型上。
 */
export type PromisifiedService<T> = [T] extends [never]
  ? {}
  : {
      [
        K in keyof T as T[K] extends (...args: any) => any
          ? K extends ServiceLifecycle
            ? never
            : K
          : never
      ]: PromisifyFunction<T[K]>;
    };

type ServiceCtorKeys<M> = {
  [K in keyof M]: M[K] extends ServiceCtor ? K : never;
}[keyof M];

/** 模块导出中恰好一个 Service 构造器；否则 never */
export type UniqueServiceCtor<M> =
  ServiceCtorKeys<M> extends infer K
    ? [K] extends [never]
      ? never
      : IsUnion<K> extends true
        ? never
        : K extends keyof M
          ? M[K] extends ServiceCtor
            ? M[K]
            : never
          : never
    : never;

/** 对 import / then 解析后的值推断构造器 */
export type CtorFromResolved<R> = R extends ServiceCtor
  ? R
  : R extends { default: infer D }
    ? D extends ServiceCtor
      ? D
      : UniqueServiceCtor<R>
    : UniqueServiceCtor<R>;

/**
 * loader：必须是异步工厂（如 `() => import('./x.service.js')`），不允许直接传 Class。
 */
export type ServiceLoader = () => Promise<unknown>;

/** 用于 combineServices 的自反约束，避免上下文类型把 import/then 污染成 any */
export type EnsureServiceLoaders<T> = {
  [K in keyof T]: T[K] extends ServiceLoader ? T[K] : never;
};

export type InferLoaderCtor<L> = L extends () => Promise<infer R>
  ? CtorFromResolved<R>
  : never;

export type InferLoaderInstance<L> = [InferLoaderCtor<L>] extends [never]
  ? never
  : InferLoaderCtor<L> extends ServiceCtor
    ? InstanceType<InferLoaderCtor<L>>
    : never;

/** `combineServices` 返回的服务袋（精确推断用 `CombinedServicesOf`） */
export type CombinedServices = Record<string, unknown>;

export type CombinedServicesOf<T> = {
  readonly [K in keyof T]: PromisifiedService<InferLoaderInstance<T[K]>>;
};
