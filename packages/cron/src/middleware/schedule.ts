import { ConsoleMiddleware } from '@aomex/console';
import { Schedule, ScheduleOptions } from '../lib/schedule';

export class ScheduleMiddleware extends ConsoleMiddleware<object> {
  constructor(protected readonly options: ScheduleOptions) {
    super(async (_, next) => next());
  }

  getSchedule(command: string): Schedule {
    return new Schedule({ ...this.options, command });
  }
}

export const schedule = (
  options: ScheduleOptions | string,
): ScheduleMiddleware => {
  return new ScheduleMiddleware(
    typeof options === 'string' ? { time: options } : options,
  );
};
