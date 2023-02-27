import { ConsoleMiddleware, scriptName } from '@aomex/console';
import parser from 'cron-parser';

export interface ScheduleOptions {
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
  args?: (string | number)[];
}

export class ScheduleMiddleware extends ConsoleMiddleware<object> {
  constructor(protected readonly options: ScheduleOptions) {
    super(async (_, next) => next());
  }

  public get time(): string[] {
    const { options: opts } = this;
    return [
      opts.minute ?? '*',
      opts.hour ?? '*',
      opts.dayOfMonth ?? '*',
      opts.month ?? '*',
      opts.dayOfWeek ?? '*',
    ].map(String);
  }

  public get args() {
    return (this.options.args || []).map(String);
  }

  public get seconds(): number[] {
    if (!this.options.second) return [];
    const seconds: number[] = [];
    // second and minute are both 0-59
    const interval = parser.parseExpression(`${this.options.second} * * * *`);
    while (true) {
      const second = interval.next().getMinutes();
      if (seconds.includes(second)) break;
      seconds.push(second);
    }
    return seconds.sort((a, b) => a - b);
  }

  public toCrontab(command: string): string[] {
    const script = this.time;
    const crons: string[][] = [script];
    for (const second of this.seconds) {
      crons.push(script.concat(`sleep ${second};`));
    }
    return crons.map((item) => {
      const args = this.args.map((value) =>
        value.includes(' ') ? `"${value}"` : value,
      );
      return item.concat(['npx', scriptName, command, ...args]).join(' ');
    });
  }
}

export const schedule = (options: ScheduleOptions): ScheduleMiddleware =>
  new ScheduleMiddleware(options);
