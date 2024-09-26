import { terminal, type ConsoleMiddleware } from '@aomex/console';
import { middleware } from '@aomex/core';
import type { CronsOptions, ServerWriteData } from '../lib/type';
import net from 'node:net';
import pidusage from 'pidusage';
import { bytes } from '@aomex/internal-tools';
import { CONNECT_REFUSED, DEFAULT_PORT } from '../lib/constant';
import formatDuration from 'format-duration';
import { i18n } from '../i18n';

const commandName = 'cron:stats';

export const stats = (opts: CronsOptions): ConsoleMiddleware => {
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
            terminal.printWarning(i18n.t('not_started', { port: PORT }));
            resolve(undefined);
          } else {
            reject(err);
          }
        });
        client.on('data', async (data) => {
          // 数据可能会堆积下发，直接用JSON.parse容易出错
          for (const stringifyData of data.toString().split('\n').filter(Boolean)) {
            const jsonData = JSON.parse(stringifyData) as ServerWriteData;
            if (!('runners' in jsonData)) return;

            let stats: Awaited<ReturnType<typeof pidusage>>;
            try {
              stats = await pidusage(jsonData.runners.map((item) => item.pid));
            } catch {
              stats = {};
            }

            logSession.update(
              terminal.generateTable(
                [
                  ['PID', 'COMMAND', 'SCHEDULE', 'CPU', 'MEMORY', 'TIME'],
                  ...jsonData.runners
                    .map((runner) => {
                      const stat = stats[runner.pid] || { cpu: 0, memory: 0, elapsed: 0 };
                      return { ...runner, ...stat };
                    })
                    .sort((a, b) => b.elapsed - a.elapsed)
                    .map(({ pid, command, schedule, elapsed, cpu, memory }) => {
                      return [
                        pid,
                        command.padEnd(24, ' '),
                        schedule,
                        `${cpu.toFixed(2)}%`,
                        bytes(memory),
                        formatDuration(elapsed, { leading: true }),
                      ];
                    }),
                ],
                {
                  columnDefault: { paddingRight: 4 },
                  columns: {
                    1: {
                      paddingRight: 1,
                      width: 24,
                      wrapWord: true,
                    },
                  },
                  drawVerticalLine: () => false,
                  drawHorizontalLine: () => false,
                },
              ),
            );
          }
        });
      });
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('stats') };
      },
    },
  });
};
