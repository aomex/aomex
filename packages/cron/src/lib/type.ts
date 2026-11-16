import type { CacheAdapter } from '@aomex/cache';
import type { GlobPathOptions } from '@aomex/internal-file-import';

export interface CronsOptions {
  commanders: GlobPathOptions;
  /**
   * 集群服务共享状态。默认使用内存存储，只能约束当前进程
   */
  store?: CacheAdapter;
  /**
   * 服务端口，用于查看任务状态和停止定时任务。有效范围：`1-65535`
   */
  port: number;
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
   * 类似 linux 下 cron 的时间格式，并支持秒级时间。必须是 **5 段**（分起）或 **6 段**（含秒）；
   * 更短的写法会被拒绝（cron-parser 会静默前补导致语义错乱）。
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
   * 允许同时执行的任务数量，如果允许不同时间点的任务重叠执行，可以设置 >1 的值。
   *
   * 默认值：`1`
   */
  concurrent?: number | 'infinity';
  /**
   * 当同时执行的任务数量达到设定的`concurrent`值，新产生的任务会被放进等待池，并不断尝试获得执行权，直到超时被丢弃。
   *
   * 默认值：`10_000`
   *
   * 对于持续性任务`while (duration < 60_000) {...}`，我们不希望任务出现重叠。
   * 但是因业务逻辑复杂程度不同，循环（while）没办法总是在指定的时间范围内结束。
   * 任务一旦在新任务开始后才退出循环（while），就会导致新任务因并发检测失败而跳过执行。
   */
  waitingTimeout?: number;
};

export type ServerWriteData =
  | {
      runningPIDs: string[];
    }
  | {
      runners: { pid: string; command: string; schedule: string }[];
    };
