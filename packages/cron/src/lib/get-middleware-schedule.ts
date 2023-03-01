import { Commander } from '@aomex/console-router';
import { Chain } from '@aomex/core';
import {
  fileToModules,
  PathToFileOptions,
  pathToFiles,
} from '@aomex/file-parser';
import { ScheduleMiddleware } from '../middleware/schedule';
import type { Schedule } from './schedule';

export const getMiddlewareSchedule = async (paths: PathToFileOptions) => {
  const files = await pathToFiles(paths);
  const commanders = await fileToModules<Commander>(
    files,
    (item) => !!item && item instanceof Commander,
  );
  const schedules: Schedule[] = [];
  for (const commander of commanders) {
    for (const builder of Commander.getBuilders(commander)) {
      for (const middleware of Chain.flatten(builder.chain)) {
        if (middleware instanceof ScheduleMiddleware) {
          schedules.push(middleware.getSchedule(builder.commands[0]!));
        }
      }
    }
  }
  return schedules;
};
