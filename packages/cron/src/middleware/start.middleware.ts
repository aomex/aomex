import { middleware } from '@aomex/common';
import { collectCrontab as collectCrontab } from '../lib/collect-crontab';
import type { CronsOptions, ServerWriteData } from '../lib/type';
import net, { Socket } from 'node:net';
import { DEFAULT_PORT } from '../lib/constant';
import { i18n } from '../i18n';

const commandName = 'cron:start';

export const start = (opts: CronsOptions) => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();

      ctx.commandMatched = true;
      const crontab = await collectCrontab(opts);

      if (!crontab.length) return;

      const stopTasks = async (callback: (remain: number) => void) => {
        crontab.forEach((cron) => cron.stop());
        let remain = crontab.length;
        await Promise.all(
          crontab.map((cron) => {
            return new Promise((resolve) => {
              const timer = setInterval(() => {
                if (!cron.runningLevel) {
                  clearInterval(timer);
                  resolve(void 0);
                  callback(--remain);
                }
              }, 300);
            });
          }),
        );
      };

      const collectRunners = () => {
        return crontab.reduce<{ pid: string; command: string; schedule: string }[]>(
          (carry, cron) =>
            carry.concat(
              cron.getPIDs().map((pid) => ({
                pid,
                command: cron.argv.join(' '),
                schedule: cron.time,
              })),
            ),
          [],
        );
      };

      const sendStopMessages = async (socket: Socket) => {
        socket.write(
          JSON.stringify({ runners: collectRunners() } satisfies ServerWriteData) + '\n',
        );
        await stopTasks(() => {
          socket.write(
            JSON.stringify({
              runningPIDs: crontab.flatMap((cron) => cron.getPIDs()),
            } satisfies ServerWriteData) + '\n',
          );
        });
        socket.destroy();
      };

      const sendStatsMessage = (socket: Socket) => {
        socket.write(
          JSON.stringify({ runners: collectRunners() } satisfies ServerWriteData) + '\n',
        );
      };

      const server = net.createServer(async (socket) => {
        socket.on('data', async (data) => {
          switch (data.toString()) {
            case 'cron:stop':
              await sendStopMessages(socket);
              break;
            case 'cron:stats':
              sendStatsMessage(socket);
              break;
          }
        });
      });
      server.listen(opts.port || DEFAULT_PORT);

      // CTRL + C
      // 子进程也会被立即杀死，但是task.start仍然在生产任务
      process.once('SIGINT', async () => {
        stopTasks(() => {});
      });

      await Promise.all(crontab.map((cron) => cron.start()));
      // 确保执行中的任务已经完成
      await stopTasks((remain) => {
        if (!remain) server.close();
      });
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('start') };
      },
    },
  });
};
