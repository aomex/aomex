import cluster, { type Worker, type Address } from 'node:cluster';
import { availableParallelism } from 'node:os';

export interface ClusterListenOptions {
  /**
   * Worker 数量。`'max'` 使用 `os.availableParallelism()`。
   *
   * 非正数或非有限值时按 `1` 处理（类型已约束为 `number`，此处仅兜底）。
   */
  workers: number | 'max';
  /**
   * 仅在 worker 进程中调用，避免 primary 白加载业务代码。
   * ```typescript
   * clusterListen({
   *   listen: () => {
   *     app.listen(port);
   *   },
   * })
   * ```
   */
  listen: () => unknown;
  /**
   * Worker 非预期退出后是否重新 `fork`。
   *
   * `disconnect`、主动关机导致的退出不会拉起。
   * 默认值：`true`
   */
  respawn?: boolean;
  /**
   * 意外退出后重新 `fork` 前的等待时间（毫秒）。
   * 非有限值回退默认；负值按 `0`。
   * 默认值：`1_000`
   */
  respawnDelay?: number;
  /**
   * 允许的最大意外 respawn 次数（累计，不含启动时的首次 `fork`）。
   * 超限后 primary 进入关机流程并以 `process.exit(1)` 退出。
   * 默认不限制；风暴节奏靠 `respawnDelay` 压住，需要硬上限时再显式设置。
   * 非有限值（除 `Infinity`）或负数回退默认。
   * 默认值：`Infinity`
   */
  maxRespawns?: number;
  /**
   * Primary 关机时等待各 worker 退出的最长时间（毫秒）。
   * 超时对残留 worker `SIGKILL`，随后 primary `process.exit`。
   * 与 `WebApp` 的 `shutdown.timeout` 默认一致。
   * 默认值：`5_000`
   */
  shutdownTimeout?: number;
  /** primary：某个 worker 开始监听端口时 */
  onListening?: (worker: Worker, address: Address) => void;
  /** primary：某个 worker 退出时（无论是否会 respawn） */
  onExit?: (worker: Worker, code: number | null, signal: string | null) => void;
}

/**
 * 基于 `node:cluster` 的多进程监听薄封装。
 *
 * - **不要**与 PM2 `-i`、容器多副本叠用（会叠乘进程）
 * - 容器 / K8s 场景优先单进程 + 副本扩缩；本 API 面向单机 / VM
 * - 不改变 `WebApp.listen`；worker 侧仍走现有 `bindServerLifecycle`
 * - Primary 收到 `SIGINT`/`SIGTERM`：`disconnect` → 等齐 `exit`（超时强杀）→ `process.exit(0)`
 * - 意外退出：等待 `respawnDelay` 后 `fork`；若设置了有限的 `maxRespawns` 且超限，则关机并以码 `1` 退出
 *
 * @example
 * ```ts
 * import { availableParallelism } from 'node:os';
 * import { clusterListen, WebApp } from '@aomex/web';
 *
 * const createApp = () =>
 *   new WebApp({
 *     mount: [routers('./src/routers')],
 *   });
 *
 * clusterListen({
 *   workers: Math.min(3, availableParallelism()),
 *   listen: () =>
 *     createApp().http({ keepAliveTimeout: 61_000 }).listen(process.env.PORT || 3000),
 * });
 * ```
 */
export const clusterListen = (options: ClusterListenOptions): void => {
  const {
    listen,
    respawn = true,
    onListening,
    onExit,
    shutdownTimeout = 5_000,
  } = options;
  const respawnDelay = resolveRespawnDelay(options.respawnDelay);
  const maxRespawns = resolveMaxRespawns(options.maxRespawns);

  if (cluster.isWorker) {
    listen();
    return;
  }

  let shuttingDown = false;
  let primaryExited = false;
  let exitCode = 0;
  let respawned = 0;
  let forceTimer: NodeJS.Timeout | undefined;
  const pendingRespawns = new Set<NodeJS.Timeout>();

  const aliveWorkers = (): Worker[] =>
    Object.values(cluster.workers ?? {}).filter((w): w is Worker => w != null);

  const clearPendingRespawns = () => {
    for (const timer of pendingRespawns) {
      clearTimeout(timer);
    }
    pendingRespawns.clear();
  };

  const exitPrimary = () => {
    if (primaryExited) return;
    primaryExited = true;
    if (forceTimer !== undefined) {
      clearTimeout(forceTimer);
      forceTimer = undefined;
    }
    clearPendingRespawns();
    process.exit(exitCode);
  };

  const maybeFinishShutdown = () => {
    if (!shuttingDown || aliveWorkers().length > 0) return;
    exitPrimary();
  };

  const shutdown = (code = 0) => {
    if (shuttingDown) {
      if (code !== 0) exitCode = code;
      return;
    }
    shuttingDown = true;
    exitCode = code;
    clearPendingRespawns();

    const list = aliveWorkers();
    if (list.length === 0) {
      exitPrimary();
      return;
    }

    for (const worker of list) {
      worker.disconnect();
    }

    forceTimer = setTimeout(
      () => {
        for (const worker of aliveWorkers()) {
          worker.process.kill('SIGKILL');
        }
        exitPrimary();
      },
      Math.max(0, shutdownTimeout),
    );
  };

  process.once('SIGTERM', () => shutdown(0));
  process.once('SIGINT', () => shutdown(0));

  if (onListening) {
    cluster.on('listening', onListening);
  }

  cluster.on('exit', (worker, code, signal) => {
    onExit?.(worker, code, signal);
    if (shuttingDown) {
      maybeFinishShutdown();
      return;
    }
    if (worker.exitedAfterDisconnect || !respawn) return;

    if (Number.isFinite(maxRespawns) && respawned >= maxRespawns) {
      shutdown(1);
      return;
    }

    respawned += 1;
    const timer = setTimeout(() => {
      pendingRespawns.delete(timer);
      if (shuttingDown) return;
      cluster.fork();
    }, respawnDelay);
    pendingRespawns.add(timer);
  });

  const count = resolveWorkerCount(options.workers);
  for (let i = 0; i < count; i++) {
    cluster.fork();
  }
};

const resolveWorkerCount = (workers: number | 'max'): number => {
  if (workers === 'max') return availableParallelism();
  const n = Math.trunc(workers);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

const resolveRespawnDelay = (value = 1_000): number => {
  return Number.isFinite(value) ? Math.max(0, value) : 1_000;
};

const resolveMaxRespawns = (value = Number.POSITIVE_INFINITY): number => {
  if (value === Number.POSITIVE_INFINITY) return Number.POSITIVE_INFINITY;
  const n = Math.trunc(value);
  return Number.isFinite(n) && n >= 0 ? n : Number.POSITIVE_INFINITY;
};
