import { scriptName } from '@aomex/console';
import { CacheMemoryAdapter, Caching } from '@aomex/cache';
import type { CronsOptions, CronOptions } from './type';
import cronParser from 'cron-parser';
import { Task } from './task';

export class Cron {
  public readonly cronExpression: cronParser.CronExpression;
  public stopping = false;
  public handle: { timer: NodeJS.Timeout; resolve: (data: void) => void } | null = null;
  public runningLevel: number = 0;

  protected readonly _pidList = new Set<string>();
  protected _time?: string;
  protected _seconds?: number[];
  protected _argv?: string[];
  protected _cache?: Caching;

  constructor(
    protected readonly options: CronOptions & CronsOptions & { command: string },
  ) {
    this.cronExpression = cronParser.parseExpression(this.time);
  }

  public get command(): string {
    return this.options.command;
  }

  public get concurrent(): number {
    return Math.max(1, this.options.concurrent || 1);
  }

  public get overlap(): boolean {
    return this.options.overlap ?? false;
  }

  public get cache(): Caching {
    return (this._cache ??= this.options.cache || new Caching(new CacheMemoryAdapter()));
  }

  public get time(): string {
    return (this._time ??= (() => {
      const { options } = this;
      if ('time' in options) {
        const expression = options.time;
        try {
          const handle = cronParser.parseExpression(expression);
          const arr = expression.split(/\s+/);
          return arr.length < 5 ? handle.stringify(false) : arr.join(' ');
        } catch {
          throw new Error(`时间表达式不合法：${expression}`);
        }
      }

      const arr = [
        options.minute ?? '*',
        options.hour ?? '*',
        options.dayOfMonth ?? '*',
        options.month ?? '*',
        options.dayOfWeek ?? '*',
      ];
      options.second && arr.unshift(options.second);
      return arr.join(' ');
    })());
  }

  public get argv(): string[] {
    return (this._argv ??= [this.options.command, ...(this.options.args || [])].map(
      String,
    ));
  }

  getPIDs(): string[] {
    return [...this._pidList];
  }

  insertPID(pid: string | undefined) {
    pid && this._pidList.add(pid);
  }

  removePID(pid: string | undefined) {
    pid && this._pidList.delete(pid);
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
        ++this.runningLevel;
        new Task(this, nextTime).consume().finally(() => {
          --this.runningLevel;
        });
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
      overlap: this.overlap,
    };
  }
}
