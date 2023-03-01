import type { ConsoleChain } from '@aomex/console';
import { chain } from '@aomex/core';
import type { PathToFileOptions } from '@aomex/file-parser';
import { output } from './output';
import { run } from './run';

export interface CronOptions {
  paths: PathToFileOptions;
  /**
   * The way to trigger schedule. Defaults `overlap`
   */
  mode?: 'overlap' | 'one-by-one';
}

export const cron = (options: CronOptions): ConsoleChain =>
  chain.console.mount(run(options)).mount(output(options.paths));
