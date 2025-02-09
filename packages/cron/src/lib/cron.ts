import { scriptName } from '@aomex/console';
import { CacheMemoryAdapter, Caching } from '@aomex/cache';
import type { CronsOptions, CronOptions } from './type';
import cronParser from 'cron-parser';
import { Task } from './task';
import { i18n } from '../i18n';

export class Cron {
  public readonly cronExpression: cronParser.CronExpression;
  public stopping = false;
  public handle: { timer: NodeJS.Timeout; resolve: (data: void) => void } | null = null;
  public runningLevel: number = 0;

  protected readonly timeDelta: number;
  protected readonly _pidList = new Set<string>();
  protected _time?: string;
  protected _seconds?: number[];
  protected _argv?: string[];
  protected _cache?: Caching;

  constructor(
    protected readonly options: CronOptions & CronsOptions & { command: string },
  ) {
    const parser = (this.cronExpression = cronParser.parseExpression(this.time));
    this.timeDelta = Math.abs(parser.next().getTime() - parser.next().getTime());
    parser.reset();
  }

  public get command(): string {
    return this.options.command;
  }

  public get servesCount(): number {
    let { serves = 1 } = this.options;
    if (serves === 'infinity') serves = Infinity;
    return Math.max(1, serves);
  }

  public get concurrent(): number {
    let { concurrent = this.servesCount } = this.options;
    if (concurrent === 'infinity') concurrent = Infinity;
    return Math.max(1, concurrent);
  }

  public get waitingTimeout(): number {
    return Math.max(
      0,
      Math.min(this.options.waitingTimeout || 10_000, this.timeDelta - 2_000),
    );
  }

  public get cache(): Caching {
    return (this._cache ??= this.options.cache || new Caching(new CacheMemoryAdapter()));
  }

  public get time(): string {
    return (this._time ??= (() => {
      const { options } = this;
      const expression =
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
        return cronParser.parseExpression(expression).stringify(true);
      } catch {
        throw new Error(i18n.t('invalid_cron_time', { time: expression }));
      }
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
        new Task(this, currentTime, nextTime).consume().finally(() => {
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
      serves: this.servesCount,
      waitingTimeout: this.waitingTimeout,
    };
  }
}
