import { ConsoleMiddleware } from '@aomex/console';
import type { CronOptions } from '../lib/type';
import {
  ENV_CRON,
  ENV_CRON_EXECUTION_TIME,
  ENV_CRON_NEXT_SCHEDULE_TIME,
  ENV_CRON_SCHEDULE_TIME,
  TELL_CHILD_STOP,
} from '../lib/constant';

export interface CropProps {
  readonly cron: {
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
     * 是否可以持续执行任务，一般用于while循环。手动执行`aomex cron:stop`之后，返回值为`false`
     *
     * ```
     * commander.create('schedule', {
     *   mount: [cron({
     *     minute: '*',
     *   })],
     *   action: async (ctx) => {
     *     while (ctx.cron.isAlive()) {
     *       // 逻辑...
     *     }
     *   }
     * });
     * ```
     */
    isAlive: () => boolean;
  };
}

export class CronMiddleware extends ConsoleMiddleware<CropProps> {
  constructor(protected readonly options: CronOptions) {
    super(async (ctx, next) => {
      let alive = true;
      const onStop = (message: string) => {
        if (message === TELL_CHILD_STOP) {
          alive = false;
        }
      };
      process.once('message', onStop);

      if (process.env[ENV_CRON] === '1') {
        const nextTime = new Date(process.env[ENV_CRON_NEXT_SCHEDULE_TIME]!);
        ctx.cron = {
          executionTime: new Date(process.env[ENV_CRON_EXECUTION_TIME]!),
          scheduleTime: new Date(process.env[ENV_CRON_SCHEDULE_TIME]!),
          nextScheduleTime: nextTime,
          isAlive: () => alive,
        };
      } else {
        const now = new Date();
        ctx.cron = {
          executionTime: now,
          scheduleTime: now,
          nextScheduleTime: now,
          isAlive: () => alive,
        };
      }
      try {
        await next();
      } finally {
        process.removeListener('message', onStop);
      }
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
