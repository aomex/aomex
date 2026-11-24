export type LifecycleHooks = {
  /** 登记时立即执行；失败则不会进入销毁队列 */
  onInit: () => void | Promise<void>;
  /** 在 `internalDestroyServices` 时与服务一并执行，执行后移除登记 */
  onDestroy: () => void | Promise<void>;
};

type LifecycleEntry = Pick<LifecycleHooks, 'onDestroy'>;

const entries = new Set<LifecycleEntry>();

let destroying: Promise<void> | null = null;

/**
 * 注册进程级生命周期钩子（不进入 `services` 袋）。
 *
 * - `onInit`：立即执行；返回的 Promise 在其完成后兑现
 * - `onDestroy`：由 `WebApp` / `ConsoleApp` 关停时经 `internalDestroyServices` 触发，并移除登记
 *
 * 库内自建资源（如 Redis store）应在构造时自动调用；业务侧 Prisma 等也可直接登记。
 *
 * @returns `onInit` 完成的 Promise；`onInit` 失败则拒绝且不登记 `onDestroy`
 *
 * @example
 * ```ts
 * await registerLifecycle({
 *   onInit: () => prisma.$connect(),
 *   onDestroy: () => prisma.$disconnect(),
 * });
 * ```
 */
export const registerLifecycle = (hooks: LifecycleHooks): Promise<void> => {
  return Promise.resolve(hooks.onInit()).then(() => {
    entries.add({ onDestroy: hooks.onDestroy });
  });
};

/**
 * 执行并清空已登记的生命周期 `onDestroy`。幂等并发；由 `internalDestroyServices` 调用。
 */
export const internalDestroyLifecycles = async (): Promise<void> => {
  if (destroying) return destroying;

  destroying = (async () => {
    const snapshot = [...entries];
    entries.clear();
    await Promise.all(snapshot.map((entry) => entry.onDestroy()));
  })().finally(() => {
    destroying = null;
  });

  return destroying;
};
