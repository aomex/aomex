import type { ConsoleChain } from '@aomex/console';
import { chain } from '@aomex/core';
import type { PathToFileOptions } from '@aomex/file-parser';
import { output } from './output';
import { run } from './run';

export interface CronOptions {
  paths: PathToFileOptions;
  /**
   * 同一个任务的触发模式：
   * - overlap  重叠模式。时间满足就执行，有可能与上一次任务重叠（默认）
   * - sequence 顺序模式。当前任务需等待上一次执行结束
   */
  mode?: 'overlap' | 'sequence';
}

export const cron = (options: CronOptions): ConsoleChain =>
  chain.console.mount(run(options)).mount(output(options.paths));
