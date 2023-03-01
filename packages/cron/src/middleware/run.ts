import { middleware, chain } from '@aomex/core';
import { runToHelp } from './run-to-help';
import type { CronOptions } from './cron';
import { Job } from '../lib/job';
import { getMiddlewareSchedule } from '../lib/get-middleware-schedule';

const runCron = 'cron:start';

export const run = ({ paths, mode }: CronOptions) =>
  chain.console.mount(runToHelp(runCron)).mount(
    middleware.console(async (ctx, next) => {
      if (ctx.request.command !== runCron) return next();
      ctx.response.commandMatched = true;

      const schedules = await getMiddlewareSchedule(paths);
      schedules.forEach(async (schedule) => {
        const job = new Job(ctx.app, schedule, mode);
        await job.start();
      });
    }),
  );
