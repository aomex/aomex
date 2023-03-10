import { options } from '@aomex/console';
import { chain, Middleware, middleware, rule } from '@aomex/core';
import { chalk, type PathToFileOptions } from '@aomex/utility';
import { mkdir, writeFile } from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { getMiddlewareSchedule } from '../lib/get-middleware-schedule';
import { outputToHelp } from './output-to-help';

const exportCron = 'cron:export';

export const outputRule = options(
  {
    output: rule.string().optional().docs({
      description: 'Export to specific file',
    }),
  },
  {
    output: ['o'],
  },
);

export const output = (paths: PathToFileOptions) =>
  chain.console
    .mount(outputToHelp(exportCron))
    .mount(outputRule)
    .mount(
      middleware.console<Middleware.Infer<typeof outputRule>>(
        async (ctx, next) => {
          if (ctx.request.command !== exportCron) {
            Reflect.deleteProperty(ctx, 'options');
            return next();
          }

          ctx.response.commandMatched = true;

          const schedules = await getMiddlewareSchedule(paths);
          const crons = schedules
            .map((schedule) => schedule.toCrontab())
            .flat();

          const { output: outputToFile } = ctx.options;
          if (outputToFile) {
            const file = path.resolve(outputToFile);
            await mkdir(dirname(file), { recursive: true });
            await writeFile(file, crons.join('\n'), {});
            console.log(`Crontab has been created: ${chalk.blue(file)}`);
          } else {
            console.log(crons.join('\n'));
          }
        },
      ),
    );
