import { scriptName } from '@aomex/console';
import { CacheMemoryStore, Caching } from '@aomex/cache';
import type { CronOptions, ScheduleOptions } from './type';
import cronParser from 'cron-parser';

export class ScheduleParser {
  protected _time?: string;
  protected _seconds?: number[];
  protected _argv?: string[];
  protected _cache?: Caching;

  constructor(
    protected readonly options: ScheduleOptions & CronOptions & { command: string },
  ) {}

  public get command(): string {
    return this.options.command;
  }

  public get overlap(): boolean {
    return this.options.overlap ?? false;
  }

  public get concurrent(): number {
    return Math.max(1, this.options.concurrent || 1);
  }

  public get cache(): Caching {
    return (this._cache ??= this.options.store || new Caching(CacheMemoryStore, {}));
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

  public toCrontab(): string {
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
