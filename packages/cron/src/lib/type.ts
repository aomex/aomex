import type { Caching } from '@aomex/cache';
import type { GlobPathOptions } from '@aomex/internal-file-import';

export interface CronsOptions {
  commanders: GlobPathOptions;
  /**
   * 集群服务共享状态。默认使用内存缓存，只能约束当前进程
   */
  cache?: Caching;
  /**
   * 服务端口，用于查看任务状态和停止定时任务。默认值：`9786`
   */
  port?: number;
}

export interface CronTimeObject {
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

export interface CronTimeString {
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

export type CronOptions = (CronTimeObject | CronTimeString) & {
  /**
   * 执行时附带的参数，使用`options`接收
   *
   * 例子：`['--hello', 'world', '-it', '-o', 'file.txt']`
   */
  args?: (string | number)[];
  /**
   * （相同时间触发的）任务在集群并发执行的数量。默认值：`1`。如果希望集群全部执行，则建议设置为`Infinity`
   *
   * ----------
   *
   * 假设有10台机器，concurrent=5，设定每分钟触发一次：
   * - 10:20:00 第一次触发，有5台机器能抢到执行权，立即执行
   * - 10:21:00 第二次触发，有5台机器能抢到执行权，能否执行得看重叠场景：
   *
   * 1. 如果overlap=true，则21min的任务会立即开始执行（无视20min的任务）
   * 2. 如果overlap=false，5台机器已经全部执行完20min的任务，则21min的任务会立即开始执行
   * 3. 如果overlap=false，但凡有一台机器还在执行20min的任务，21min的任务就会被立即丢弃
   */
  concurrent?: number;
  /**
   * 当前时间点触发的任务能否和上一个时间点任务重叠。默认值：`false`
   *
   * ----------
   *
   * 假设有10台机器，concurrent=5，设定每分钟触发一次：
   * - 10:20:00 第一次触发，有5台机器能抢到执行权，立即执行
   * - 10:21:00 第二次触发，有5台机器能抢到执行权，能否执行得看重叠场景：
   *
   * 1. 如果overlap=true，则21min的任务会立即开始执行（无视20min的任务）
   * 2. 如果overlap=false，5台机器已经全部执行完20min的任务，则21min的任务会立即开始执行
   * 3. 如果overlap=false，但凡有一台机器还在执行20min的任务，21min的任务就会被立即丢弃
   */
  overlap?: boolean;
};

export type ServerWriteData =
  | {
      runningPIDs: string[];
    }
  | {
      runners: { pid: string; command: string; schedule: string }[];
    };
