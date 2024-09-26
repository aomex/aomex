import { Commander } from '@aomex/console';
import { pathToFiles, getFileValues } from '@aomex/internal-file-import';
import { CronMiddleware } from '../middleware/cron.middleware';
import { Cron } from './cron';
import type { CronsOptions } from './type';

export const collectCrontab = async (opts: CronsOptions) => {
  const files = await pathToFiles(opts.commanders);
  const commanders = await getFileValues<Commander>(
    files,
    (item) => !!item && item instanceof Commander,
  );
  const crontab: Cron[] = [];
  for (const commander of commanders) {
    for (const builder of commander['builders']) {
      for (const middleware of builder['middlewareList']) {
        if (middleware instanceof CronMiddleware) {
          crontab.push(
            new Cron({
              ...opts,
              ...middleware['options'],
              command: builder.commands[0]!,
            }),
          );
        }
      }
    }
  }
  return crontab;
};
