import { Commander } from '@aomex/console-router';
import { middleware, Chain, chain } from '@aomex/core';
import {
  pathToFiles,
  fileToModules,
  PathToFileOptions,
} from '@aomex/file-parser';
import { ScheduleMiddleware } from './schedule';
import { runToHelp } from './run-to-help';
import type { CronOptions } from './cron';
import { CronJob, CronJobOptions } from './cron-job';

const runSchedule = 'schedule:run';

export const run = ({ paths, mode }: CronOptions) =>
  chain.console.mount(runToHelp(runSchedule)).mount(
    middleware.console(async (ctx, next) => {
      if (ctx.request.command !== runSchedule) return next();
      ctx.response.commandMatched = true;
      const schedules = await getSchedules(paths);
      schedules.forEach(async (schedule) => {
        const job = new CronJob(ctx.app, schedule, mode);
        await job.start();
      });
    }),
  );

export const getSchedules = async (
  paths: PathToFileOptions,
): Promise<CronJobOptions[]> => {
  const files = await pathToFiles(paths);
  const commanders = await fileToModules<Commander>(
    files,
    (item) => !!item && item instanceof Commander,
  );
  const tasks: CronJobOptions[] = [];

  for (const commander of commanders) {
    for (const builder of Commander.getBuilders(commander)) {
      for (const middleware of Chain.flatten(builder.chain)) {
        if (middleware instanceof ScheduleMiddleware) {
          tasks.push({
            time: middleware.time.join(' '),
            seconds: middleware.seconds,
            command: builder.commands[0]!,
            args: middleware.args,
          });
        }
      }
    }
  }

  return tasks;
};
