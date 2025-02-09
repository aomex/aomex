import { ConsoleMiddleware } from '@aomex/console';
import type { CronOptions } from '../lib/type';
import {
  ENV_CRON,
  ENV_CRON_EXECUTION_TIME,
  ENV_CRON_NEXT_SCHEDULE_TIME,
  ENV_CRON_SCHEDULE_TIME,
} from '../lib/constant';

export interface CropProps {
  readonly cron?: {
    /**
     * 计划执行的时间
     */
    scheduleTime: Date;
    /**
     * 最终执行的时间
     */
    executionTime: Date;
    /**
     * 下一个时间点计划执行的时间
     */
    nextScheduleTime: Date;
    /**
     * 距离下一次任务开始还剩多少时间
     */
    remainTimeMS: number;
  };
}

export class CronMiddleware extends ConsoleMiddleware<CropProps> {
  constructor(protected readonly options: CronOptions) {
    super(async (ctx, next) => {
      if (process.env[ENV_CRON] === '1') {
        const nextTime = new Date(process.env[ENV_CRON_NEXT_SCHEDULE_TIME]!);
        ctx.cron = {
          executionTime: new Date(process.env[ENV_CRON_EXECUTION_TIME]!),
          scheduleTime: new Date(process.env[ENV_CRON_SCHEDULE_TIME]!),
          nextScheduleTime: nextTime,
          remainTimeMS: Math.max(0, nextTime.getTime() - Date.now()),
        };
      }
      return next();
    });
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
