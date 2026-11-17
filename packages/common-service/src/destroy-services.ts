import type { CombinedServices } from './types';
import { serviceRegistries } from './combine-services';
import { internalDestroyLifecycles } from './lifecycle';

const destroyed = new WeakSet<object>();
const destroying = new WeakMap<object, Promise<void>>();

/**
 * 销毁已加载服务实例，并执行 `registerLifecycle` 登记的 `onDestroy`（随后移除登记）。仅接受数组；幂等。
 *
 * 业务代码不要调用：把 `combineServices` 结果交给 `WebApp` / `ConsoleApp` 的 `services`，由框架在关停时调用。
 *
 * 触发时机：
 * - `WebApp`：`SIGINT` / `SIGTERM` → `server.close()`（超时则 `closeAllConnections`）后再销毁；手动 `server.close()` 时也会销毁
 * - `ConsoleApp`：进程 `beforeExit`，以及 `SIGINT` / `SIGTERM`
 */
export const internalDestroyServices = async (
  services: CombinedServices[],
): Promise<void> => {
  await Promise.all([
    ...services.map(async (item) => {
      if (destroyed.has(item)) return;

      const pending = destroying.get(item);
      if (pending) return pending;

      const task = (async () => {
        try {
          const registry = serviceRegistries.get(item);
          if (!registry) return;

          await Promise.all(
            [...registry.instances.values()].map((service) => service['onDestroy']()),
          );
          registry.instances.clear();
          registry.pending.clear();
        } finally {
          destroyed.add(item);
          destroying.delete(item);
        }
      })();

      destroying.set(item, task);
      return task;
    }),
    internalDestroyLifecycles(),
  ]);
};
