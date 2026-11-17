import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Address, Worker } from 'node:cluster';

type ExitHandler = (worker: Worker, code: number | null, signal: string | null) => void;
type ListeningHandler = (worker: Worker, address: Address) => void;

type MockWorker = {
  disconnect: ReturnType<typeof vi.fn>;
  process: { kill: ReturnType<typeof vi.fn> };
};

const fork = vi.fn();
const clusterOn = vi.fn();
const workers: Record<string, MockWorker | undefined> = {};

vi.mock('node:cluster', () => {
  const cluster = {
    isPrimary: true,
    isWorker: false,
    workers,
    fork,
    on: clusterOn,
  };
  return { default: cluster, ...cluster };
});

vi.mock('node:os', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:os')>();
  return {
    ...actual,
    availableParallelism: () => 4,
  };
});

const loadClusterListen = async () => {
  const mod = await import('../src/cluster-listen');
  return mod.clusterListen;
};

const getExitHandler = (): ExitHandler => {
  const call = clusterOn.mock.calls.find(([event]) => event === 'exit');
  expect(call).toBeTruthy();
  return call![1] as ExitHandler;
};

const getListeningHandler = (): ListeningHandler | undefined => {
  const call = clusterOn.mock.calls.find(([event]) => event === 'listening');
  return call?.[1] as ListeningHandler | undefined;
};

const makeWorker = (exitedAfterDisconnect = false): Worker =>
  ({
    id: 1,
    exitedAfterDisconnect,
  }) as Worker;

const setPrimaryMode = async () => {
  const cluster = await import('node:cluster');
  (cluster as any).isWorker = false;
  (cluster as any).default.isWorker = false;
  (cluster as any).isPrimary = true;
  (cluster as any).default.isPrimary = true;
  return cluster;
};

describe('clusterListen', () => {
  let processOnceSpy: ReturnType<typeof vi.spyOn>;
  let processExitSpy: ReturnType<typeof vi.spyOn>;
  const signalHandlers: Partial<Record<NodeJS.Signals, () => void>> = {};

  beforeEach(() => {
    vi.resetModules();
    vi.useRealTimers();
    fork.mockReset();
    clusterOn.mockReset();
    for (const key of Object.keys(workers)) delete workers[key];

    fork.mockImplementation(() => {
      const id = String(fork.mock.calls.length);
      const worker: MockWorker = {
        disconnect: vi.fn(),
        process: { kill: vi.fn() },
      };
      workers[id] = worker;
      return worker;
    });

    clusterOn.mockImplementation(() => ({ on: clusterOn }));

    signalHandlers.SIGTERM = undefined;
    signalHandlers.SIGINT = undefined;
    processOnceSpy = vi.spyOn(process, 'once').mockImplementation(((
      event: string | symbol,
      listener: (...args: any[]) => void,
    ) => {
      if (event === 'SIGTERM' || event === 'SIGINT') {
        signalHandlers[event] = listener as () => void;
      }
      return process;
    }) as typeof process.once);
    processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);
  });

  afterEach(() => {
    processOnceSpy.mockRestore();
    processExitSpy.mockRestore();
    vi.useRealTimers();
  });

  test('worker 进程只执行 listen 工厂，不 fork', async () => {
    const cluster = await import('node:cluster');
    (cluster as any).isWorker = true;
    (cluster as any).default.isWorker = true;
    (cluster as any).isPrimary = false;
    (cluster as any).default.isPrimary = false;

    const listen = vi.fn(() => 'server');
    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 3, listen });

    expect(listen).toHaveBeenCalledTimes(1);
    expect(fork).not.toHaveBeenCalled();
    expect(clusterOn).not.toHaveBeenCalled();
  });

  test('primary 按 workers 数量 fork，且不执行 listen', async () => {
    await setPrimaryMode();

    const listen = vi.fn();
    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 3, listen });

    expect(listen).not.toHaveBeenCalled();
    expect(fork).toHaveBeenCalledTimes(3);
    expect(signalHandlers.SIGTERM).toBeTypeOf('function');
    expect(signalHandlers.SIGINT).toBeTypeOf('function');
  });

  test("workers: 'max' 使用 availableParallelism", async () => {
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 'max', listen: () => {} });

    expect(fork).toHaveBeenCalledTimes(4);
  });

  test.each([0, -2, Number.NaN, 1.8])(
    'workers=%s 非正整数时至少 fork 1 个（1.8 trunc 为 1）',
    async (workersCount) => {
      await setPrimaryMode();

      const clusterListen = await loadClusterListen();
      clusterListen({ workers: workersCount, listen: () => {} });
      expect(fork).toHaveBeenCalledTimes(1);
    },
  );

  test('意外退出时默认 delay 后 respawn', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const onExit = vi.fn();
    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {}, onExit });

    const exit = getExitHandler();
    fork.mockClear();
    const worker = makeWorker(false);
    exit(worker, 1, null);

    expect(onExit).toHaveBeenCalledWith(worker, 1, null);
    expect(fork).not.toHaveBeenCalled();

    vi.advanceTimersByTime(999);
    expect(fork).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fork).toHaveBeenCalledTimes(1);
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('respawnDelay 可配置', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {}, respawnDelay: 200 });

    const exit = getExitHandler();
    fork.mockClear();
    exit(makeWorker(false), 1, null);

    vi.advanceTimersByTime(199);
    expect(fork).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fork).toHaveBeenCalledTimes(1);
  });

  test('respawnDelay 负值按 0，下一 tick fork', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {}, respawnDelay: -50 });

    const exit = getExitHandler();
    fork.mockClear();
    exit(makeWorker(false), 1, null);
    expect(fork).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(fork).toHaveBeenCalledTimes(1);
  });

  test('exitedAfterDisconnect 不 respawn', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {} });

    const exit = getExitHandler();
    fork.mockClear();
    exit(makeWorker(true), 0, null);
    vi.advanceTimersByTime(1_000);
    expect(fork).not.toHaveBeenCalled();
  });

  test('respawn: false 不拉起', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {}, respawn: false });

    const exit = getExitHandler();
    fork.mockClear();
    exit(makeWorker(false), 1, 'SIGTERM');
    vi.advanceTimersByTime(1_000);
    expect(fork).not.toHaveBeenCalled();
  });

  test('达到 maxRespawns 后关机并以 exit(1)', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({
      workers: 1,
      listen: () => {},
      respawnDelay: 0,
      maxRespawns: 2,
    });

    const exit = getExitHandler();
    fork.mockClear();

    exit(makeWorker(false), 1, null);
    vi.advanceTimersByTime(0);
    expect(fork).toHaveBeenCalledTimes(1);
    expect(processExitSpy).not.toHaveBeenCalled();

    exit(makeWorker(false), 1, null);
    vi.advanceTimersByTime(0);
    expect(fork).toHaveBeenCalledTimes(2);
    expect(processExitSpy).not.toHaveBeenCalled();

    // 第 3 次意外退出：不再 fork，进入关机
    exit(makeWorker(false), 1, null);
    expect(fork).toHaveBeenCalledTimes(2);
    for (const worker of Object.values(workers)) {
      expect(worker!.disconnect).toHaveBeenCalled();
    }
    expect(processExitSpy).not.toHaveBeenCalled();

    for (const key of Object.keys(workers)) delete workers[key];
    exit(makeWorker(true), 0, null);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  test('maxRespawns: 0 首次意外退出即 exit(1)', async () => {
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({
      workers: 1,
      listen: () => {},
      maxRespawns: 0,
    });

    const exit = getExitHandler();
    fork.mockClear();
    exit(makeWorker(false), 1, null);
    expect(fork).not.toHaveBeenCalled();

    delete workers['1'];
    exit(makeWorker(true), 0, null);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  test('默认 maxRespawns 为 Infinity，不因次数停 fork', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({
      workers: 1,
      listen: () => {},
      respawnDelay: 0,
    });

    const exit = getExitHandler();
    fork.mockClear();
    for (let i = 0; i < 30; i++) {
      exit(makeWorker(false), 1, null);
      vi.advanceTimersByTime(0);
    }
    expect(fork).toHaveBeenCalledTimes(30);
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('关机取消尚未执行的延迟 respawn', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {}, respawnDelay: 1_000 });

    const exit = getExitHandler();
    fork.mockClear();
    exit(makeWorker(false), 1, null);
    expect(fork).not.toHaveBeenCalled();

    signalHandlers.SIGTERM!();
    delete workers['1'];
    exit(makeWorker(true), 0, null);
    expect(processExitSpy).toHaveBeenCalledWith(0);

    vi.advanceTimersByTime(1_000);
    expect(fork).not.toHaveBeenCalled();
  });

  test('关机后 disconnect、等齐 exit 再 process.exit(0)，且 onExit 仍触发', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const onExit = vi.fn();
    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 2, listen: () => {}, onExit });

    expect(Object.keys(workers)).toHaveLength(2);
    const workerSnapshots = Object.values(workers) as MockWorker[];
    signalHandlers.SIGTERM!();

    for (const worker of workerSnapshots) {
      expect(worker.disconnect).toHaveBeenCalledTimes(1);
    }
    expect(processExitSpy).not.toHaveBeenCalled();

    const exit = getExitHandler();
    fork.mockClear();

    delete workers['1'];
    const w1 = makeWorker(true);
    exit(w1, 0, null);
    expect(onExit).toHaveBeenCalledWith(w1, 0, null);
    expect(fork).not.toHaveBeenCalled();
    expect(processExitSpy).not.toHaveBeenCalled();

    delete workers['2'];
    const w2 = makeWorker(true);
    exit(w2, 0, 'SIGTERM');
    expect(onExit).toHaveBeenCalledWith(w2, 0, 'SIGTERM');
    expect(processExitSpy).toHaveBeenCalledWith(0);

    // 优雅退完后即使越过默认 shutdownTimeout，也不再 SIGKILL
    vi.advanceTimersByTime(5_000);
    for (const worker of workerSnapshots) {
      expect(worker.process.kill).not.toHaveBeenCalled();
    }

    // 额外 exit / 重复信号均幂等
    exit(makeWorker(true), 0, null);
    signalHandlers.SIGTERM!();
    expect(processExitSpy).toHaveBeenCalledTimes(1);
    expect(onExit).toHaveBeenCalledTimes(3);
  });

  test('关机超时对残留 worker SIGKILL 后 primary exit(0)', async () => {
    vi.useFakeTimers();
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 2, listen: () => {}, shutdownTimeout: 1_000 });

    signalHandlers.SIGTERM!();
    expect(processExitSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(999);
    expect(processExitSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    for (const worker of Object.values(workers)) {
      expect(worker!.process.kill).toHaveBeenCalledWith('SIGKILL');
    }
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  test.each([0, -100])(
    'shutdownTimeout=%s 时立即 SIGKILL 并 exit(0)',
    async (shutdownTimeout) => {
      vi.useFakeTimers();
      await setPrimaryMode();

      const clusterListen = await loadClusterListen();
      clusterListen({ workers: 1, listen: () => {}, shutdownTimeout });

      signalHandlers.SIGTERM!();
      expect(processExitSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(workers['1']!.process.kill).toHaveBeenCalledWith('SIGKILL');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    },
  );

  test('SIGINT 同样触发关机', async () => {
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {} });

    signalHandlers.SIGINT!();
    expect(workers['1']!.disconnect).toHaveBeenCalledTimes(1);
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('无存活 worker 时关机立即 exit(0)', async () => {
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {} });

    for (const key of Object.keys(workers)) delete workers[key];
    signalHandlers.SIGTERM!();
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  test('workers 字典缺省或含空项时关机仍安全', async () => {
    const cluster = await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {} });

    (cluster as any).workers = undefined;
    (cluster as any).default.workers = undefined;
    expect(() => signalHandlers.SIGTERM!()).not.toThrow();
    expect(processExitSpy).toHaveBeenCalledWith(0);

    // 再注册一轮，覆盖 Dict 中的空 slot
    vi.resetModules();
    fork.mockClear();
    clusterOn.mockClear();
    clusterOn.mockImplementation(() => ({ on: clusterOn }));
    processExitSpy.mockClear();
    signalHandlers.SIGTERM = undefined;
    processOnceSpy.mockRestore();
    processOnceSpy = vi.spyOn(process, 'once').mockImplementation(((
      event: string | symbol,
      listener: (...args: any[]) => void,
    ) => {
      if (event === 'SIGTERM' || event === 'SIGINT') {
        signalHandlers[event] = listener as () => void;
      }
      return process;
    }) as typeof process.once);

    const cluster2 = await setPrimaryMode();
    const clusterListen2 = await loadClusterListen();
    clusterListen2({ workers: 1, listen: () => {} });
    (cluster2 as any).workers = { '1': undefined };
    (cluster2 as any).default.workers = { '1': undefined };
    expect(() => signalHandlers.SIGTERM!()).not.toThrow();
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  test('onListening 仅在提供时注册', async () => {
    await setPrimaryMode();

    const clusterListen = await loadClusterListen();
    clusterListen({ workers: 1, listen: () => {} });
    expect(getListeningHandler()).toBeUndefined();

    vi.resetModules();
    fork.mockClear();
    clusterOn.mockClear();
    clusterOn.mockImplementation(() => ({ on: clusterOn }));
    await setPrimaryMode();

    const onListening = vi.fn();
    const clusterListen2 = await loadClusterListen();
    clusterListen2({ workers: 1, listen: () => {}, onListening });

    const handler = getListeningHandler();
    expect(handler).toBeTypeOf('function');
    const worker = makeWorker();
    const address = { address: '127.0.0.1', port: 3000, addressType: 4 } as Address;
    handler!(worker, address);
    expect(onListening).toHaveBeenCalledWith(worker, address);
  });
});
