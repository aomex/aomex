import { ConsoleMiddleware } from '@aomex/console';
import type { CronOptions } from '../lib/type';

export class CronMiddleware extends ConsoleMiddleware<object> {
  constructor(protected readonly options: CronOptions) {
    super(async (_, next) => next());
  }
}

/**
 * 收集定时任务
 *
 * 如果传递字符串，则为cron时间表达式（支持秒）。如：`1-10,20 * * * *`
 */
export const cron = (options: CronOptions | string): CronMiddleware => {
  return new CronMiddleware(typeof options === 'string' ? { time: options } : options);
};
