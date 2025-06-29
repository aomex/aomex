import { scriptName } from '@aomex/console';
import { CacheMemoryAdapter, Caching } from '@aomex/cache';
import type { CronsOptions, CronOptions } from './type';
import * as cronParser from 'cron-parser';
import { Task } from './task';
import { i18n } from '../i18n';
import { TELL_CHILD_STOP } from './constant';

export class Cron {
  public readonly cronExpression: cronParser.CronExpression;
  public stopping = false;
  public handle: { timer: NodeJS.Timeout; resolve: (data: void) => void } | null = null;
  public runningLevel: number = 0;
  public readonly time: string;

  protected _time?: string;
  protected _seconds?: number[];
  protected _argv?: string[];
  protected _cache?: Caching;
  protected _tasks = new Set<Task>();

  constructor(
    protected readonly options: CronOptions & CronsOptions & { command: string },
  ) {
    const scheduleTime =
      'time' in options
        ? options.time
        : [
            options.second ?? '0',
            options.minute ?? '*',
            options.hour ?? '*',
            options.dayOfMonth ?? '*',
            options.month ?? '*',
            options.dayOfWeek ?? '*',
          ].join(' ');

    try {
      this.cronExpression = cronParser.CronExpressionParser.parse(scheduleTime);
    } catch {
      throw new Error(i18n.t('invalid_cron_time', { time: scheduleTime }));
    }
    this.time = this.cronExpression.stringify(true);
  }

  public get command(): string {
    return this.options.command;
  }

  public get concurrent(): number {
    let { concurrent = 1 } = this.options;
    if (concurrent === 'infinity') concurrent = Infinity;
    return Math.max(1, concurrent);
  }

  public getWaitingTimeout(timeDelta: number = Infinity): number {
    return Math.max(
      0,
      Math.min(this.options.waitingTimeout || 10_000, Math.abs(timeDelta)),
    );
  }

  public get cache(): Caching {
    return (this._cache ??= this.options.cache || new Caching(new CacheMemoryAdapter()));
  }

  public get argv(): string[] {
    return (this._argv ??= [this.options.command, ...(this.options.args || [])].map(
      String,
    ));
  }

  getPIDs(): string[] {
    return [...this._tasks].map((task) => task.pid).filter((pid) => pid !== undefined);
  }

  async start(): Promise<void> {
    if (!this.cronExpression.hasNext()) return;
    const currentTime = this.cronExpression.next().getTime();
    const nextTime = this.cronExpression.next().getTime();
    this.cronExpression.prev();

    while (true) {
      /**
       * setTimeout的最大延时值是 `2^31-1`(约为24.85天) ，超过这个值会被立即执行。
       * 拆分延时值可让执行时机更精确。
       */
      const delta = Math.min(900_000, currentTime - Date.now());
      await this.delay(delta);
      if (this.stopping) return;
      if (currentTime - Date.now() <= 0) {
        // 不要使用`await`语法，因为需要立即进入下一个循环
        ++this.runningLevel;
        const task = new Task(this, currentTime, nextTime);
        this._tasks.add(task);
        task.consume().finally(() => {
          this._tasks.delete(task);
          --this.runningLevel;
        });
        break;
      }
    }

    return this.start();
  }

  delay(delta: number) {
    const { promise, resolve } = Promise.withResolvers();
    const timer = setTimeout(() => {
      this.handle = null;
      resolve(undefined);
    }, delta);
    this.handle = { timer, resolve };
    return promise;
  }

  stop() {
    this.stopping = true;
    if (this.handle) {
      clearTimeout(this.handle.timer);
      this.handle.resolve();
    }
    // 延迟结束，这样cron:stop终端能看到半永久运行的任务。
    // 同时能大概率防止排队中的任务获得执行权。
    setTimeout(() => {
      this._tasks.forEach((task) => {
        task.child?.send(TELL_CHILD_STOP);
      });
    }, 1_000);
  }

  toString(): string {
    return [
      this.time,
      scriptName,
      ...this.argv.map((value) => (value.includes(' ') ? `"${value}"` : value)),
    ].join(' ');
  }

  toJSON() {
    return {
      command: this.command,
      time: this.time,
      argv: this.argv,
      concurrent: this.concurrent,
      waitingTimeout: this.getWaitingTimeout(),
    };
  }
}
