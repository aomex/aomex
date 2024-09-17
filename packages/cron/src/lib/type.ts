import type { Caching } from '@aomex/cache';
import type { GlobPathOptions } from '@aomex/internal-file-import';

export interface CronOptions {
  commanders: GlobPathOptions;
  /**
   * 集群服务共享状态。默认使用内存缓存，只能约束当前进程
   */
  cache?: Caching;
  /**
   * 服务端口。默认值：`9786`
   */
  port?: number;
}

export interface ScheduleTimeObject {
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
   * - 周末: 0
   * - 周一: 1
   */
  dayOfWeek?: string | number;
}

export interface ScheduleTimeString {
  /**
   * 如果想验证时间表达式，可访问 https://crontab.guru
   * 
   类似linux下cron的时间格式，并支持秒级时间
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

export type ScheduleTime = ScheduleTimeObject | ScheduleTimeString;

export type ScheduleOptions = (ScheduleTimeObject | ScheduleTimeString) & {
  /**
   * 执行时附带的参数，使用`options`接收
   *
   * 例子：`['--hello', 'world', '-it', '-o', 'file.txt']`
   */
  args?: (string | number)[];
  /**
   * 任务（不限触发时间）能被集群并发执行的数量。默认值：`1`
   *
   * 如果不希望有任何限制，则设置为`Infinity`
   */
  concurrent?: number;
};

export type ServerWriteData =
  | {
      runningPIDs: string[];
    }
  | {
      runners: { pid: string; command: string; schedule: string }[];
    };
