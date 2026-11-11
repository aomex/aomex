import { Service } from './service';

export type ServiceCtor = new () => Service;

export const isServiceCtor = (value: unknown): value is ServiceCtor => {
  return (
    typeof value === 'function' &&
    'prototype' in value &&
    value.prototype instanceof Service
  );
};

/**
 * 解析工厂返回值：整体是 Class → default → 导出中唯一的 Service 子类。
 * （动态 import 的结果类型挡不住空模块/多导出，需运行时判定。）
 */
export const resolveCtor = (resolved: unknown, key: string): ServiceCtor => {
  if (isServiceCtor(resolved)) {
    return resolved;
  }

  if (resolved !== null && typeof resolved === 'object') {
    const mod = resolved as Record<string, unknown>;

    if (isServiceCtor(mod['default'])) {
      return mod['default'];
    }

    // 与 UniqueServiceCtor 一致：恰好一个才选用，0 个或多个都不选
    const ctors = Object.values(mod).filter(isServiceCtor);
    if (ctors.length === 1) {
      return ctors[0]!;
    }
  }

  throw new TypeError(
    `combineServices["${key}"]: expected a Service class, default export, or a module with exactly one Service class`,
  );
};

export const loadCtor = async (
  loader: () => Promise<unknown>,
  key: string,
): Promise<ServiceCtor> => {
  return resolveCtor(await loader(), key);
};
