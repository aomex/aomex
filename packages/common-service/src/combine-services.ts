import { loadCtor } from './resolve-ctor';
import type { Service } from './service';
import type {
  CombinedServices,
  CombinedServicesOf,
  EnsureServiceLoaders,
  ServiceLoader,
} from './types';

export type {
  CombinedServices,
  CombinedServicesOf,
  EnsureServiceLoaders,
  PromisifiedService,
  ServiceLoader,
} from './types';

export interface ServiceRegistry {
  loaders: Record<string, ServiceLoader>;
  instances: Map<string, Service>;
  pending: Map<string, Promise<Service>>;
}

/** WebApp / ConsoleApp 关停时由 internalDestroyServices 使用 */
export const serviceRegistries = new WeakMap<CombinedServices, ServiceRegistry>();

const ensureInstance = async (
  key: string,
  registry: ServiceRegistry,
): Promise<Service> => {
  const existing = registry.instances.get(key);
  if (existing) return existing;

  const pending = registry.pending.get(key);
  if (pending) return pending;

  const task = (async () => {
    const Ctor = await loadCtor(registry.loaders[key]!, key);
    const instance = new Ctor();
    // 先登记再 onInit，避免钩子内互调同 key 死锁
    registry.instances.set(key, instance);
    try {
      await instance['onInit']();
    } catch (e) {
      registry.instances.delete(key);
      throw e;
    }
    return instance;
  })();

  registry.pending.set(key, task);
  try {
    return await task;
  } finally {
    registry.pending.delete(key);
  }
};

const createServiceProxy = (key: string, registry: ServiceRegistry): object => {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        // Symbol 键（如 iterator / toStringTag）不当作服务方法，避免被包成 async 函数
        if (typeof prop === 'symbol') {
          return undefined;
        }
        // 避免被当成 Thenable
        if (prop === 'then') {
          return undefined;
        }

        return async (...args: unknown[]) => {
          const instance = await ensureInstance(key, registry);
          // 非方法：类型已剔除字段；运行时由 Reflect.apply 自然抛错即可
          return Reflect.apply(Reflect.get(instance, prop, instance), instance, args);
        };
      },
      set() {
        return false;
      },
      deleteProperty() {
        return false;
      },
      defineProperty() {
        return false;
      },
    },
  );
};

/**
 * 组合服务并返回懒加载代理。
 *
 * - loader 一律为异步工厂：`() => import('./xxx.service.js')`（不允许直接传 Class）
 * - 工厂返回值解析：整体是 Class → `default` → 恰好一个 Service 导出
 * - 对外仅方法，且一律返回 Promise；类内部 `this.xxx()` 仍为真实同步/异步语义
 * - 生命周期销毁：把返回值交给 `WebApp` / `ConsoleApp` 的 `services`，勿手调销毁 API
 *
 * @example
 * ```ts
 * export const services = await combineServices({
 *   article: () => import('./article.service.js'),
 *   user: () => import('./user.service.js'),
 * });
 * ```
 */
export const combineServices = async <T extends EnsureServiceLoaders<T>>(
  loaders: T,
): Promise<CombinedServicesOf<T>> => {
  const services: CombinedServices = {};
  const registry: ServiceRegistry = {
    loaders: { ...loaders },
    instances: new Map(),
    pending: new Map(),
  };

  for (const key of Object.keys(loaders)) {
    services[key] = createServiceProxy(key, registry);
  }

  Object.freeze(services);
  serviceRegistries.set(services, registry);

  return services as CombinedServicesOf<T>;
};
