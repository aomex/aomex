import { middleware } from '@aomex/core';
import type { ConsoleMiddleware } from '@aomex/console';
import { collectSchedules } from '../lib/collect-schedule';
import type { CronOptions } from '../lib/type';
import { i18n } from '../i18n';

const commandName = 'cron:eject';

export const eject = (opts: CronOptions): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();

      ctx.commandMatched = true;
      const schedules = await collectSchedules(opts);
      const taskList = schedules.map((schedule) => schedule.toCrontab()).flat();
      console.log(taskList.join('\n'));
    },
    help: {
      onDocument(doc) {
        doc[commandName] = {
          summary: i18n.t('eject'),
        };
      },
    },
  });
};
