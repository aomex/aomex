import { terminal, type ConsoleMiddleware } from '@aomex/console';
import { i18n, middleware } from '@aomex/core';
import type { CronOptions, ServerWriteData } from '../lib/type';
import net from 'node:net';
import pidusage from 'pidusage';
import { bytes } from '@aomex/internal-tools';
import { CONNECT_REFUSED, DEFAULT_PORT } from '../lib/constant';

const commandName = 'cron:stats';

export const stats = (opts: CronOptions): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;

      const PORT = opts.port || DEFAULT_PORT;
      const client = net.createConnection({ port: PORT }, () => {
        client.write(commandName);
        const timer = setInterval(() => {
          client.write(commandName);
        }, 600);
        client.on('error', () => {
          clearInterval(timer);
        });
        client.on('close', () => {
          clearInterval(timer);
        });
      });

      const logSession = terminal.applySession();

      await new Promise((resolve, reject): void => {
        // 多次resolve不会报错
        client.on('close', resolve);
        client.on('error', (err) => {
          // @ts-expect-error
          if (err.code === CONNECT_REFUSED) {
            console.warn(
              terminal.printWarning(i18n.t('cron.not_started', { port: PORT })),
            );
            resolve(undefined);
          } else {
            reject(err);
          }
        });
        client.on('data', async (data) => {
          // 数据可能会堆积下发，直接用JSON.parse容易出错
          for (const stringifyData of data.toString().split('\n').filter(Boolean)) {
            const json = JSON.parse(stringifyData) as ServerWriteData;
            if (!('runners' in json)) return;

            let stats: Awaited<ReturnType<typeof pidusage>>;
            try {
              stats = await pidusage(json.runners.map((item) => item.pid));
            } catch {
              stats = {};
            }

            logSession.update(
              terminal.generateTable([
                ['Schedule', 'PID', 'CPU', 'Memory', 'Time'],
                ...json.runners.map(({ pid, argv }) => {
                  const stat = stats[pid] || { cpu: 0, memory: 0, elapsed: 0 };
                  return [
                    argv.join(' '),
                    pid,
                    `${stat.cpu.toFixed(2)}%`,
                    bytes(stat.memory),
                    `${stat.elapsed / 1000}s`,
                  ];
                }),
              ]),
            );
          }
        });
      });
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('cron.stats') };
      },
    },
  });
};
