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
import { Job, JobOptions } from './job';

const runCron = 'cron:start';

export const run = ({ paths, mode }: CronOptions) =>
  chain.console.mount(runToHelp(runCron)).mount(
    middleware.console(async (ctx, next) => {
      if (ctx.request.command !== runCron) return next();
      ctx.response.commandMatched = true;
      const configs = await getJobConfigs(paths);
      configs.forEach(async (config) => {
        const job = new Job(ctx.app, config, mode);
        await job.start();
      });
    }),
  );

export const getJobConfigs = async (
  paths: PathToFileOptions,
): Promise<JobOptions[]> => {
  const files = await pathToFiles(paths);
  const commanders = await fileToModules<Commander>(
    files,
    (item) => !!item && item instanceof Commander,
  );
  const tasks: JobOptions[] = [];

  for (const commander of commanders) {
    for (const builder of Commander.getBuilders(commander)) {
      for (const middleware of Chain.flatten(builder.chain)) {
        if (middleware instanceof ScheduleMiddleware) {
          tasks.push({
            time: middleware.time,
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
