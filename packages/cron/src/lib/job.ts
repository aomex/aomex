import cronParser from 'cron-parser';
import type { ScheduleParser } from './schedule-parser';
import { spawn } from 'node:child_process';
import type { Caching } from '@aomex/cache';

export class Job {
  public runningLevel: number = 0;
  public readonly runningKey: string;
  public readonly cronExpression: cronParser.CronExpression;
  public readonly cache: Caching;
  public handle: { timer: NodeJS.Timeout; resolve: (data: void) => void } | null = null;
  public stopping = false;
  public readonly processData: {
    execArgv: string[];
    node: string;
    filePath: string;
    cwd: string;
    env: NodeJS.ProcessEnv;
  };
  protected childPIDs = new Set<string>();

  constructor(public readonly schedule: ScheduleParser) {
    this.runningKey = `cron-job|arg:${schedule.argv}|exp:${schedule.time}|con:${schedule.concurrent}`;
    this.cronExpression = cronParser.parseExpression(this.schedule.time);
    this.cache = schedule.cache;
    this.processData = {
      execArgv: [...process.execArgv],
      node: process.argv0,
      filePath: process.argv[1]!,
      cwd: process.cwd(),
      env: process.env,
    };
  }

  async start(): Promise<void> {
    if (!this.cronExpression.hasNext()) return;
    const nextTime = this.cronExpression.next().getTime();

    while (true) {
      /**
       * setTimeout的最大延时值是 `2^31-1`(约为24.85天) ，超过这个值会被立即执行。
       * 拆分延时值可让执行时机更精确。
       */
      const delta = Math.min(3600_000, nextTime - Date.now());
      await this.delay(delta);
      if (this.stopping) return;
      if (nextTime - Date.now() <= 0) {
        // 不要使用`await`语法，因为需要立即进入下一个循环
        this.consume(nextTime);
        break;
      }
    }

    return this.start();
  }

  delay(delta: number) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.handle = null;
        resolve(undefined);
      }, delta);
      this.handle = { timer, resolve };
    });
  }

  stop() {
    this.stopping = true;
    if (this.handle) {
      clearTimeout(this.handle.timer);
      this.handle.resolve();
    }
  }

  getPIDs() {
    return [...this.childPIDs];
  }

  async consume(time: number) {
    try {
      ++this.runningLevel;
      if (!(await this.win(time))) return;
      const pong = this.ping();
      try {
        await this.runChildProcess();
      } finally {
        await pong();
      }
    } finally {
      --this.runningLevel;
    }
  }

  async runChildProcess() {
    return new Promise((resolve) => {
      const childProcess = spawn(
        this.processData.node,
        [...this.processData.execArgv, this.processData.filePath, ...this.schedule.argv],
        {
          cwd: this.processData.cwd,
          env: this.processData.env,
          stdio: 'pipe',
        },
      );

      const pid = childProcess.pid?.toString();
      pid && this.childPIDs.add(pid);

      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);
      childProcess.on('close', () => {
        pid && this.childPIDs.delete(pid);
        resolve(undefined);
      });
    });
  }

  async win(time: number): Promise<boolean> {
    if (Infinity === this.schedule.concurrent) return true;

    // 同一时间点任务可能因为服务器各异导致触发时间不一致，造成重复执行，因此需要抹平时差。
    {
      const currentKey = `${this.runningKey}|now:${time}`;
      const count = await this.cache.increment(currentKey);
      await this.cache.expire(currentKey, 1800_000 /* 30分钟 */);
      if (count > this.schedule.concurrent) return false;
    }

    const count = await this.cache.increment(this.runningKey);
    if (count <= this.schedule.concurrent) {
      await this.cache.expire(this.runningKey, 8_000);
      return true;
    }

    await this.cache.decrement(this.runningKey);
    return false;
  }

  /**
   * 设置过期时间，防止进程崩溃或者被强制关闭后计数器数字累积
   */
  ping() {
    const timer = setInterval(() => {
      this.cache.expire(this.runningKey, 8_000);
    }, 3_000);

    return async () => {
      clearInterval(timer);
      await this.done();
    };
  }

  async done() {
    await this.cache.decrement(this.runningKey);
  }
}
