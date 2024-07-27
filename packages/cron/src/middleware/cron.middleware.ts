import { compose, middleware } from '@aomex/core';
import type { ConsoleMiddleware } from '@aomex/console';
import { start } from './start.middleware';
import { eject } from './eject.middleware';
import type { CronOptions } from '../lib/type';
import { stop } from './stop.middleware';
import { stats } from './stats.middleware';

export const cron = (options: string | CronOptions): ConsoleMiddleware => {
  const opts: CronOptions =
    typeof options === 'string' ? { commanders: options } : options;
  const middlewareList = [start(opts), eject(opts), stop(opts), stats(opts)];
  const fn = compose(middlewareList);

  return middleware.console({
    fn,
    help: {
      async onDocument(_, { children }) {
        await children(middlewareList);
      },
      async postDocument(_, { children }) {
        await children(middlewareList);
      },
    },
  });
};
