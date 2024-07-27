import { Commander } from '@aomex/console';
import { pathToFiles, getFileValues } from '@aomex/internal-file-import';
import { ScheduleMiddleware } from '../middleware/schedule.middleware';
import { ScheduleParser } from './schedule-parser';
import type { CronOptions } from './type';

export const collectSchedules = async (opts: CronOptions) => {
  const files = await pathToFiles(opts.commanders);
  const commanders = await getFileValues<Commander>(
    files,
    (item) => !!item && item instanceof Commander,
  );
  const schedules: ScheduleParser[] = [];
  for (const commander of commanders) {
    for (const builder of commander['builders']) {
      for (const middleware of builder['middlewareList']) {
        if (middleware instanceof ScheduleMiddleware) {
          schedules.push(
            new ScheduleParser({
              ...opts,
              ...middleware['options'],
              command: builder.commands[0]!,
            }),
          );
        }
      }
    }
  }
  return schedules;
};
