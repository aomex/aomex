import { ConsoleMiddleware } from '@aomex/console';
import type { CronOptions } from '../lib/type';
import {
  ENV_CRON,
  ENV_CRON_EXECUTION_TIME,
  ENV_CRON_NEXT_SCHEDULE_TIME,
  ENV_CRON_SCHEDULE_TIME,
  TELL_CHILD_REJECT,
  TELL_CHILD_RESOLVE,
  TELL_CHILD_STOP,
  TELL_PARENT_INIT,
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
      if (process.env[ENV_CRON] === '1') {
        let alive = true;
        const { promise: init, resolve } = Promise.withResolvers();
        const onInitOrStop = (message: string) => {
          switch (message) {
            case TELL_CHILD_RESOLVE:
              alive = true;
              resolve(undefined);
              break;
            case TELL_CHILD_REJECT:
              alive = false;
              resolve(undefined);
              break;
            case TELL_CHILD_STOP:
              alive = false;
              break;
          }
        };
        process.on('message', onInitOrStop);
        process.send!(TELL_PARENT_INIT);

        ctx.cron = {
          executionTime: new Date(process.env[ENV_CRON_EXECUTION_TIME]!),
          scheduleTime: new Date(process.env[ENV_CRON_SCHEDULE_TIME]!),
          nextScheduleTime: new Date(process.env[ENV_CRON_NEXT_SCHEDULE_TIME]!),
          isAlive: () => alive,
        };

        try {
          await init;
          await next();
        } finally {
          process.removeListener('message', onInitOrStop);
        }
      } else {
        const now = new Date();
        ctx.cron = {
          executionTime: now,
          scheduleTime: now,
          nextScheduleTime: now,
          isAlive: () => true,
        };
        return next();
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
