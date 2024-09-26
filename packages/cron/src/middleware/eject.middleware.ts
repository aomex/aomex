import { middleware } from '@aomex/core';
import type { ConsoleMiddleware } from '@aomex/console';
import { collectCrontab } from '../lib/collect-crontab';
import type { CronsOptions } from '../lib/type';
import { i18n } from '../i18n';

const commandName = 'cron:eject';

export const eject = (opts: CronsOptions): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();

      ctx.commandMatched = true;
      const crontab = await collectCrontab(opts);
      console.log(crontab.map((cron) => cron.toString()).join('\n'));
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
