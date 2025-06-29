import { sleep } from '@aomex/internal-tools';
import type { Cron } from './cron';
import { ChildProcess, spawn } from 'node:child_process';
import {
  ENV_CRON,
  ENV_CRON_EXECUTION_TIME,
  ENV_CRON_NEXT_SCHEDULE_TIME,
  ENV_CRON_SCHEDULE_TIME,
  TELL_CHILD_REJECT,
  TELL_CHILD_RESOLVE,
  TELL_PARENT_INIT,
} from './constant';

export class Task {
  child: ChildProcess | null = null;
  readonly concurrentKey: string;
  protected readonly filePath: string;
  protected readonly execArgv: string[];
  protected readonly expireDuration: number;

  constructor(
    readonly cron: Cron,
    readonly currentTimestamp: number,
    readonly nextTimestamp: number,
  ) {
    this.concurrentKey = `aomex-cron|v:${cron.argv}|t:${cron.time}|s:1|c:${cron.concurrent}`;
    // 并发过期时间，必须保证在下一次执行前失效，否则在非正常退出后并发数值一直无法被释放
    this.expireDuration = Math.min(
      300_000,
      Math.max(10_000, Math.round((nextTimestamp - currentTimestamp) * 0.6)),
    );
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

    childProcess.on('message', (message: string) => {
      if (message === TELL_PARENT_INIT) {
        childProcess.send(this.cron.stopping ? TELL_CHILD_REJECT : TELL_CHILD_RESOLVE);
      }
    });

    await promise.finally(() => {
      this.child = null;
    });
  }

  async win(): Promise<boolean> {
    const { cache, concurrent: maxConcurrent } = this.cron;
    const waitingTimeout = this.cron.getWaitingTimeout(
      this.nextTimestamp - this.currentTimestamp,
    );
    const startTime = Date.now();

    // 如果有任务在执行，则会触发setInterval不断更新过期时间，此处属于无用功。
    // 如果没有任务，则当前可能是第一次，则设置不成功。
    // 如果是非正常的退出，则过期时间是不确定的，需要提前设置以防止获得执行权后立马失效了，
    // 但是设置的过期时间不能超过下一次执行的时间，否则就会导致退出之前的并发数值一直无法释放。
    await cache.expire(this.concurrentKey, this.expireDuration);

    while (true) {
      if (this.cron.stopping) return false;
      const concurrent = await cache.increment(this.concurrentKey);
      if (concurrent <= maxConcurrent) return true;
      await cache.decrement(this.concurrentKey);
      if (waitingTimeout <= 0) return false;
      if (startTime + waitingTimeout <= Date.now()) return false;
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
      cache.expire(this.concurrentKey, this.expireDuration);
    }, this.expireDuration / 4);

    return async () => {
      clearInterval(timer);
      const count = await cache.decrement(this.concurrentKey);
      if (count < 0) {
        await cache.delete(this.concurrentKey);
      }
    };
  }
}
