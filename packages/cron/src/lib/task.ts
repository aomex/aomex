import { sleep } from '@aomex/internal-tools';
import type { Cron } from './cron';
import { ChildProcess, spawn } from 'node:child_process';
import {
  ENV_CRON,
  ENV_CRON_EXECUTION_TIME,
  ENV_CRON_NEXT_SCHEDULE_TIME,
  ENV_CRON_SCHEDULE_TIME,
} from './constant';

export class Task {
  child: ChildProcess | null = null;
  readonly concurrentKey: string;
  readonly servesKey: string;
  protected readonly filePath: string;
  protected readonly execArgv: string[];

  constructor(
    readonly cron: Cron,
    readonly currentTimestamp: number,
    readonly nextTimestamp: number,
  ) {
    this.concurrentKey = `aomex-cron|v:${cron.argv}|t:${cron.time}|s:${cron.servesCount}|c:${cron.concurrent}`;
    this.servesKey = `${this.concurrentKey}|n:${currentTimestamp}`;
    this.filePath = process.argv[1]!;
    this.execArgv = [...process.execArgv];
    if (!this.execArgv.includes('--enable-source-maps')) {
      this.execArgv.unshift('--enable-source-maps');
    }
  }

  get pid(): string | undefined {
    return this.child?.pid?.toString();
  }

  async consume() {
    if (!(await this.win())) return;
    const pong = this.ping();
    try {
      await this.runChildProcess();
    } finally {
      await pong();
    }
  }

  async runChildProcess() {
    if (this.child) return;
    const { argv } = this.cron;
    const { promise, resolve } = Promise.withResolvers();
    const childProcess = spawn(
      process.argv0,
      [...this.execArgv, this.filePath, ...argv],
      {
        cwd: process.cwd(),
        env: {
          /**
           * 支持颜色输出。默认值是 `0` 代表不输出颜色。
           * @link https://nodejs.org/api/tty.html#writestreamgetcolordepthenv
           */
          FORCE_COLOR: '3',
          ...process.env,
          [ENV_CRON]: '1',
          [ENV_CRON_SCHEDULE_TIME]: new Date(this.currentTimestamp).toISOString(),
          [ENV_CRON_EXECUTION_TIME]: new Date().toISOString(),
          [ENV_CRON_NEXT_SCHEDULE_TIME]: new Date(this.nextTimestamp).toISOString(),
        },
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      },
    );
    this.child = childProcess;

    childProcess.on('close', resolve);
    childProcess.on('exit', resolve);
    childProcess.on('error', resolve);

    await promise.finally(() => {
      this.child = null;
    });
  }

  async win(): Promise<boolean> {
    const { cache, servesCount: maxServes } = this.cron;

    {
      const existServes = await cache.increment(this.servesKey);
      await cache.expire(this.servesKey, 60_000);
      if (existServes > maxServes) {
        await cache.decrement(this.servesKey);
        return false;
      }
    }

    const { concurrent: maxConcurrent } = this.cron;
    const waitingTimeout = this.cron.getWaitingTimeout(
      this.nextTimestamp - this.currentTimestamp,
    );
    const startTime = Date.now();
    while (true) {
      if (this.cron.stopping) return false;
      // 防止临近过期时写入导致数据丢失
      await cache.expire(this.concurrentKey, 60_000);
      const concurrent = await cache.increment(this.concurrentKey);
      await cache.expire(this.concurrentKey, 60_000);
      if (concurrent <= maxConcurrent) return true;
      await cache.decrement(this.concurrentKey);
      if (waitingTimeout <= 0) return false;
      if (startTime + waitingTimeout < Date.now()) return false;
      await sleep(1_000);
      continue;
    }
  }

  /**
   * 设置过期时间，防止进程崩溃或者被强制关闭导致无法重叠执行
   */
  ping() {
    const cache = this.cron.cache;
    const timer = setInterval(() => {
      cache.expire(this.concurrentKey, 60_000);
      cache.expire(this.servesKey, 60_000);
    }, 10_000);

    return async () => {
      clearInterval(timer);
      await cache.decrement(this.concurrentKey);
      await cache.decrement(this.servesKey);
    };
  }
}
