import type { Cron } from './cron';
import { spawn } from 'node:child_process';

export class Task {
  readonly runningKey: string;
  readonly currentKey: string;
  protected readonly filePath: string;
  protected readonly execArgv: string[];

  constructor(
    readonly cron: Cron,
    givenTime: number,
  ) {
    this.runningKey = `cron-task|arg:${cron.argv}|exp:${cron.time}|con:${cron.concurrent}`;
    this.currentKey = `${this.runningKey}|now:${givenTime}`;
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

    return new Promise((resolve) => {
      const childProcess = spawn(
        process.argv0,
        [...this.execArgv, this.filePath, ...argv],
        {
          cwd: process.cwd(),
          env: process.env,
          stdio: 'pipe',
        },
      );

      const pid = childProcess.pid?.toString();
      this.cron.insertPID(pid);

      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);
      childProcess.on('close', () => {
        this.cron.removePID(pid);
        resolve(undefined);
      });
    });
  }

  async win(): Promise<boolean> {
    const { cache, concurrent, overlap } = this.cron;

    {
      const count = await cache.increment(this.currentKey);
      await cache.expire(this.currentKey, 60_000);
      if (count > concurrent) {
        await cache.decrement(this.currentKey);
        return false;
      }
    }

    if (overlap === false) {
      const prevKey = await cache.get<string>(this.runningKey);
      if (prevKey === null) {
        await cache.setNX(this.runningKey, this.currentKey, 60_000);
      } else if (prevKey !== this.currentKey) {
        await cache.decrement(this.currentKey);
        return false;
      }
    }

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
