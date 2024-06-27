import { mdchain } from '@aomex/core';
import type { ConsoleMiddlewareChain } from '@aomex/console';
import { start } from './start.middleware';
import { eject } from './eject.middleware';
import type { CronOptions } from '../lib/type';
import { stop } from './stop.middleware';
import { stats } from './stats.middleware';

export const cron = (options: string | CronOptions): ConsoleMiddlewareChain => {
  const opts: CronOptions = typeof options === 'string' ? { path: options } : options;
  return mdchain.console
    .mount(start(opts))
    .mount(eject(opts))
    .mount(stop(opts))
    .mount(stats(opts));
};
