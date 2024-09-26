import { terminal, type ConsoleMiddleware } from '@aomex/console';
import { middleware } from '@aomex/core';
import type { CronsOptions, ServerWriteData } from '../lib/type';
import net from 'node:net';
import { CONNECT_REFUSED, DEFAULT_PORT } from '../lib/constant';
import { bytes, sleep } from '@aomex/internal-tools';
import formatDuration from 'format-duration';
import pidusage from 'pidusage';
import { i18n } from '../i18n';

const commandName = 'cron:stop';

export const stop = (opts: CronsOptions): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;

      const PORT = opts.port || DEFAULT_PORT;
      const client = net.createConnection({ port: PORT }, () => {
        client.write(commandName);
      });

      const logSession = terminal.applySession();
      let runners: {
        cpu: number;
        memory: number;
        elapsed: number;
        pid: string;
        command: string;
        schedule: string;
        status: 'loading' | 'success';
      }[] = [];

      let timer: NodeJS.Timeout;
      (function loop() {
        timer = setTimeout(async () => {
          let stats: Awaited<ReturnType<typeof pidusage>>;
          try {
            const pids = runners
              .filter(({ status }) => status === 'loading')
              .map(({ pid }) => pid);
            stats = pids.length ? await pidusage(pids) : {};
          } catch {
            stats = {};
          }
          runners = runners
            .map((runner) => {
              if (runner.status === 'success') return runner;
              const stat = stats[runner.pid];
              if (!stat) return runner;
              return {
                ...runner,
                cpu: stat.cpu,
                memory: stat.memory,
                elapsed: stat.elapsed,
              };
            })
            .sort((a, b) => b.elapsed - a.elapsed);

          if (runners.length) {
            logSession.update(
              terminal
                .generateTable(
                  [
                    ['', 'PID', 'COMMAND', 'SCHEDULE', 'CPU', 'MEMORY', 'TIME'],
                    ...runners.map(
                      ({ pid, command, schedule, elapsed, cpu, memory, status }) => {
                        return [
                          `:${status}:`,
                          pid,
                          command.padEnd(24, ' '),
                          schedule,
                          `${cpu.toFixed(2)}%`,
                          bytes(memory),
                          formatDuration(elapsed, { leading: true }),
                        ];
                      },
                    ),
                  ],
                  {
                    columnDefault: { paddingRight: 4 },
                    columns: {
                      0: { paddingLeft: 0, paddingRight: 0 },
                      2: { paddingRight: 1, width: 24, wrapWord: true },
                    },
                    drawVerticalLine: () => false,
                    drawHorizontalLine: () => false,
                  },
                )
                .replace(/^\s+/, '  '),
            );
          }

          if (runners.every((item) => item.status === 'success')) {
            logSession.commit();
            client.destroy();
          } else {
            loop();
          }
        }, 100);
      })();

      process.once('SIGINT', () => {
        clearTimeout(timer);
        client.destroy();
      });

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
            if ('runners' in jsonData) {
              runners = jsonData.runners.map((runner) => {
                return {
                  ...runner,
                  cpu: 0,
                  memory: 0,
                  elapsed: 0,
                  status: 'loading' as const,
                };
              });
            } else if ('runningPIDs' in jsonData) {
              runners.forEach((item) => {
                if (!jsonData.runningPIDs.includes(item.pid)) {
                  item.status = 'success';
                }
              });
            }
          }
        });
      });

      // 让终端日志渲染完
      await sleep(300);
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('stop') };
      },
    },
  });
};
