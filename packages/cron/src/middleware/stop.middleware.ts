import { type ConsoleMiddleware } from '@aomex/console';
import { i18n, middleware } from '@aomex/core';
import type { CronOptions, ServerWriteData } from '../lib/type';
import net from 'node:net';
import Spinnies from 'spinnies';
import { CONNECT_REFUSED, DEFAULT_PORT } from '../lib/constant';
import { styleText } from 'node:util';

const commandName = 'cron:stop';

export const stop = (opts: CronOptions): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;

      const PORT = opts.port || DEFAULT_PORT;
      const client = net.createConnection({ port: PORT }, () => {
        client.write(commandName);
      });

      const spinner = new Spinnies();

      await new Promise((resolve, reject): void => {
        // 多次resolve不会报错
        client.on('close', resolve);
        client.on('error', (err) => {
          // @ts-expect-error
          if (err.code === CONNECT_REFUSED) {
            console.warn(styleText('yellow', i18n.t('cron.not_started', { port: PORT })));
            resolve(undefined);
          } else {
            reject(err);
          }
        });
        client.on('data', (data) => {
          // 数据可能会堆积下发，直接用JSON.parse容易出错
          data
            .toString()
            .split('\n')
            .filter(Boolean)
            .forEach((stringifyData) => {
              const json = JSON.parse(stringifyData) as ServerWriteData;
              if ('list' in json) {
                json.list.forEach((item) => {
                  spinner.add(item, { text: item });
                });
              } else if ('done' in json) {
                spinner.succeed(json.done);
                if (!spinner.hasActiveSpinners()) {
                  client.destroy();
                }
              }
            });
        });
      });
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('cron.stop') };
      },
    },
  });
};
