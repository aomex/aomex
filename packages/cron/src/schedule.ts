import { ConsoleMiddleware, scriptName } from '@aomex/console';
import parser from 'cron-parser';

interface TimeObject {
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
   */
  dayOfWeek?: string | number;
}

interface TimeString {
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

export type ScheduleOptions =
  | (TimeObject | TimeString) & {
      args?: (string | number)[];
    };

export class ScheduleMiddleware extends ConsoleMiddleware<object> {
  constructor(protected readonly options: ScheduleOptions) {
    super(async (_, next) => next());
  }

  public get time(): string {
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
  }

  public get args() {
    return (this.options.args || []).map(String);
  }

  public get seconds(): number[] {
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
  }

  public toCrontab(command: string): string[] {
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
      return time.concat(['npx', scriptName, command, ...args]).join(' ');
    });
  }
}

export const schedule = (
  options: ScheduleOptions | string,
): ScheduleMiddleware => {
  return new ScheduleMiddleware(
    typeof options === 'string' ? { time: options } : options,
  );
};
