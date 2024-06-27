import cronParser from 'cron-parser';
import type { ScheduleParser } from './schedule-parser';
import type { CronStore } from './type';
import { spawn } from 'node:child_process';

export class Job {
  public runningLevel: number = 0;
  public readonly cronExpression: cronParser.CronExpression;
  public readonly store: CronStore;
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
    this.cronExpression = cronParser.parseExpression(this.schedule.time);
    this.store = schedule.store;
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

  async consume(nextTime: number) {
    try {
      ++this.runningLevel;
      const jobKey = this.getUniqueKey(nextTime);
      const isWinner = await this.win(jobKey);
      if (isWinner) {
        const pong = this.ping(jobKey);
        try {
          await this.runChildProcess();
        } finally {
          pong();
          await this.done(jobKey);
        }
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

  async win(jobKey: string): Promise<boolean> {
    if (!this.schedule.overlap) {
      let runningJobKey = await this.store.get(this.runningKey);
      if (!runningJobKey) {
        await this.store.add(this.runningKey, jobKey, 10_000);
        runningJobKey = await this.store.get(this.runningKey);
      }
      if (runningJobKey !== jobKey) return false;
    }

    const index = await this.store.increment(jobKey);
    return index <= this.schedule.concurrent;
  }

  ping(jobKey: string) {
    const timer = setInterval(() => {
      this.store.set(this.runningKey, jobKey, 10_000);
    }, 3_000);
    return () => clearInterval(timer);
  }

  async done(jobKey: string) {
    const doneKey = jobKey + ':done';
    const count = await this.store.increment(doneKey);
    // 当前时间点任务已全部结束
    if (count === this.schedule.concurrent) {
      await Promise.all([
        this.store.expires(this.runningKey, -1),
        this.store.expires(jobKey, 7200_000),
        this.store.expires(doneKey, 7200_000),
      ]);
    }
  }

  getUniqueKey(timestamp: number) {
    return `cron-job|argv:${this.schedule.argv};expression:${this.schedule.time};now:${timestamp};`;
  }

  get runningKey() {
    return this.getUniqueKey(-1);
  }
}
