import { sleep } from '@aomex/internal-tools';
import type { Cron } from './cron';
import { spawn } from 'node:child_process';

export class Task {
  readonly runningKey: string;
  readonly currentKey: string;
  protected readonly filePath: string;
  protected readonly execArgv: string[];

  constructor(
    readonly cron: Cron,
    currentTimestamp: number,
  ) {
    this.runningKey = `cron-task|arg:${cron.argv}|exp:${cron.time}|con:${cron.concurrent}`;
    this.currentKey = `${this.runningKey}|now:${currentTimestamp}`;
    this.filePath = process.argv[1]!;
    this.execArgv = [...process.execArgv];
    if (!this.execArgv.includes('--enable-source-maps')) {
      this.execArgv.unshift('--enable-source-maps');
    }
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
    const { argv } = this.cron;

    return new Promise<void>((resolve) => {
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
          },
          stdio: 'inherit',
        },
      );

      const pid = childProcess.pid!.toString();
      this.cron.insertPID(pid);

      const onDone = () => {
        this.cron.removePID(pid);
        resolve();
      };

      childProcess.on('close', onDone);
      childProcess.on('exit', onDone);
      childProcess.on('error', onDone);
    });
  }

  async win(): Promise<boolean> {
    const { cache, concurrent, overlap, waitingTimeout } = this.cron;

    {
      const count = await cache.increment(this.currentKey);
      await cache.expire(this.currentKey, 60_000);
      if (count > concurrent) {
        await cache.decrement(this.currentKey);
        return false;
      }
    }

    if (overlap === false) {
      const startTime = Date.now();
      while (true) {
        const prevKey = await cache.get<string>(this.runningKey);
        if (prevKey === null) {
          await cache.setNX(this.runningKey, this.currentKey, 60_000);
          return true;
        } else if (prevKey !== this.currentKey) {
          if (waitingTimeout > 0 && Date.now() - startTime < waitingTimeout) {
            await sleep(1_000);
            continue;
          } else {
            await cache.decrement(this.currentKey);
            return false;
          }
        } else {
          return true;
        }
      }
    }

    // overlap === true
    return true;
  }

  /**
   * 设置过期时间，防止进程崩溃或者被强制关闭导致无法重叠执行
   */
  ping() {
    const cache = this.cron.cache;
    const timer = setInterval(() => {
      cache.expire(this.runningKey, 10_000);
      cache.expire(this.currentKey, 10_000);
    }, 3_000);

    return async () => {
      clearInterval(timer);
      const count = await cache.decrement(this.currentKey);
      if (count === 0) {
        await cache.delete(this.runningKey);
      }
    };
  }
}
