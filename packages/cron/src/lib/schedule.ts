import { scriptName } from '@aomex/console';
import parser from 'cron-parser';

interface ScheduleTimeObject {
  /**
   * 0-59
   */
  second?: string | number;
  /**
   * 0-59
   */
  minute?: string | number;
  /**
   * 0-23
   */
  hour?: string | number;
  /**
   * 1-31
   */
  dayOfMonth?: string | number;
  /**
   * 0-11
   */
  month?: string | number;
  /**
   * 0-6
   * - weekend: 0
   * - monday: 1
   */
  dayOfWeek?: string | number;
}

interface ScheduleTimeString {
  /**
   Cron-like time, support seconds.
    ```
      ┌────────────── second (optional)
      │ ┌──────────── minute 
      │ │ ┌────────── hour
      │ │ │ ┌──────── day of month
      │ │ │ │ ┌────── month
      │ │ │ │ │ ┌──── day of week
      │ │ │ │ │ │
     `* * * * * *`
    ```
  */
  time: string;
}

interface ScheduleBaseOptions {
  args?: (string | number)[];
}

export type ScheduleOptions = (ScheduleTimeObject | ScheduleTimeString) &
  ScheduleBaseOptions;

export class Schedule {
  protected _time?: string;
  protected _args?: string[];
  protected _seconds?: number[];

  public readonly command: string;

  constructor(
    protected readonly options: ScheduleOptions & { command: string },
  ) {
    this.command = options.command;
  }

  public get time(): string {
    return (this._time ??= (() => {
      const { options } = this;
      if ('time' in options) {
        const timeList = options.time.split(/\s+/);
        switch (timeList.length) {
          case 6:
            timeList.shift();
            return timeList.join(' ');
          case 5:
            return timeList.join(' ');
          default:
            throw new Error(`Invalid cron time: "${options.time}"`);
        }
      }

      return [
        options.minute ?? '*',
        options.hour ?? '*',
        options.dayOfMonth ?? '*',
        options.month ?? '*',
        options.dayOfWeek ?? '*',
      ].join(' ');
    })());
  }

  public get args(): string[] {
    return (this._args ??= (this.options.args || []).map(String));
  }

  public get seconds(): number[] {
    return (this._seconds ??= (() => {
      const { options } = this;
      let second: string | undefined;

      if ('time' in options) {
        const timeList = options.time.split(/\s+/);
        if (timeList.length === 6) {
          second = timeList[0]!;
        }
      } else {
        second = options.second?.toString();
      }

      if (!second) return [];
      const seconds: number[] = [];
      // second and minute are both 0-59
      const interval = parser.parseExpression(`${second} * * * *`);
      while (true) {
        const nextSecond = interval.next().getMinutes();
        if (seconds.includes(nextSecond)) break;
        seconds.push(nextSecond);
      }
      return seconds.sort((a, b) => a - b);
    })());
  }

  public toCrontab(): string[] {
    const script = [this.time];
    const crons: string[][] = [];

    for (const second of this.seconds) {
      crons.push(script.concat(`sleep ${second};`));
    }

    if (crons.length === 0) {
      crons.push(script);
    }

    return crons.map((time) => {
      const args = this.args.map((value) =>
        value.includes(' ') ? `"${value}"` : value,
      );
      return time.concat(['npx', scriptName, this.command, ...args]).join(' ');
    });
  }

  toJSON() {
    return {
      time: this.time,
      args: this.args,
      seconds: this.seconds,
      command: this.command,
    };
  }
}
