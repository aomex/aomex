import type { ConsoleMiddleware } from '@aomex/console';
import { i18n, middleware } from '@aomex/core';
import type { CronOptions, ServerWriteData } from '../lib/type';
import net from 'node:net';
import Spinnies from 'spinnies';
import pidusage from 'pidusage';
import { bytes } from '@aomex/internal-tools';
import { styleText } from 'node:util';
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
        }, 800);
        client.on('error', () => {
          clearInterval(timer);
        });
        client.on('close', () => {
          clearInterval(timer);
        });
      });

      const spinner = new Spinnies();
      spinner.add('default', { text: 'Running jobs count: 0' });

      let lastPIDs: string[] = [];

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
        client.on('data', async (data) => {
          // 数据可能会堆积下发，直接用JSON.parse容易出错
          for (const stringifyData of data.toString().split('\n').filter(Boolean)) {
            const json = JSON.parse(stringifyData) as ServerWriteData;
            if (!('runners' in json)) return;

            spinner.update('default', {
              text: `Running jobs count: ${json.runners.length}`,
            });

            const pids = json.runners.map((item) => item.pid);
            lastPIDs.forEach((pid) => {
              if (!pids.includes(pid)) {
                spinner.remove('pid-' + pid);
              }
            });
            let stats: Awaited<ReturnType<typeof pidusage>>;
            try {
              // 传入后会对原数组进行toNumber()处理，因此需要使用新数组
              stats = await pidusage([...pids]);
            } catch {
              stats = {};
            }

            json.runners.forEach(({ pid, argv }) => {
              const stat = stats[pid] || { cpu: 0, memory: 0, elapsed: 0 };
              const msg =
                argv.join(' ') +
                // 使用中文会导致文字显示不全
                ` (cpu: ${Math.round(stat.cpu * 1000) / 1000}%, memory: ${bytes(stat.memory)}, time: ${stat.elapsed / 1000}s, pid: ${pid})`;

              if (lastPIDs.includes(pid)) {
                spinner.update('pid-' + pid, { text: msg, status: 'non-spinnable' });
              } else {
                // 直接使用数字作为key会导致排序不正确
                spinner.add('pid-' + pid, { text: msg, status: 'non-spinnable' });
              }
            });

            lastPIDs = pids;
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
