import { i18n, middleware } from '@aomex/core';
import { collectSchedules } from '../lib/collect-schedule';
import { Job } from '../lib/job';
import type { CronOptions, ServerWriteData } from '../lib/type';
import net, { Socket } from 'node:net';
import { DEFAULT_PORT } from '../lib/constant';

const commandName = 'cron:start';

export const start = (opts: CronOptions) => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();

      ctx.commandMatched = true;
      const schedules = await collectSchedules(opts);

      if (!schedules.length) return;

      const jobs = schedules.map((schedule) => new Job(schedule));

      const stopJobs = async (callback: (remain: number) => void) => {
        jobs.forEach((job) => job.stop());
        let remain = jobs.length;
        await Promise.all(
          jobs.map((job) => {
            return new Promise((resolve) => {
              const timer = setInterval(() => {
                if (!job.runningLevel) {
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
        return jobs.reduce<{ pid: string; command: string; schedule: string }[]>(
          (carry, job) =>
            carry.concat(
              job.getPIDs().map((pid) => ({
                pid,
                command: job.schedule.argv.join(' '),
                schedule: job.schedule.time,
              })),
            ),
          [],
        );
      };

      const sendStopMessages = async (socket: Socket) => {
        socket.write(
          JSON.stringify({ runners: collectRunners() } satisfies ServerWriteData) + '\n',
        );
        await stopJobs(() => {
          socket.write(
            JSON.stringify({
              runningPIDs: jobs.flatMap((job) => job.getPIDs()),
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
      // 子进程也会被立即杀死，但是job.start仍然在生产任务
      process.once('SIGINT', async () => {
        stopJobs(() => {});
      });

      await Promise.all(jobs.map((job) => job.start()));
      // 确保执行中的任务已经完成
      await stopJobs((remain) => {
        if (!remain) server.close();
      });
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('cron.start') };
      },
    },
  });
};
