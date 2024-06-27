import { ConsoleMiddleware } from '@aomex/console';
import type { ScheduleOptions } from '../lib/type';

export class ScheduleMiddleware extends ConsoleMiddleware<object> {
  constructor(protected readonly options: ScheduleOptions) {
    super(async (_, next) => next());
  }
}

/**
 * 创建一个定时任务
 *
 * 如果传递字符串，则为cron时间表达式（支持秒）。如：`1-10,20 * * * *`
 */
export const schedule = (options: ScheduleOptions | string): ScheduleMiddleware => {
  return new ScheduleMiddleware(
    typeof options === 'string' ? { time: options } : options,
  );
};
