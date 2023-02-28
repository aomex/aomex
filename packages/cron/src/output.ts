import { options } from '@aomex/console';
import { Commander } from '@aomex/console-router';
import { Chain, chain, Middleware, middleware, rule } from '@aomex/core';
import {
  fileToModules,
  PathToFileOptions,
  pathToFiles,
} from '@aomex/file-parser';
import { chalk } from '@aomex/utility';
import { mkdir, writeFile } from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { outputToHelp } from './output-to-help';
import { ScheduleMiddleware } from './schedule';

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
          const files = await pathToFiles(paths);
          const commanders = await fileToModules<Commander>(
            files,
            (item) => !!item && item instanceof Commander,
          );

          const crons: string[] = [];
          for (const commander of commanders) {
            for (const builder of Commander.getBuilders(commander)) {
              for (const middleware of Chain.flatten(builder.chain)) {
                if (middleware instanceof ScheduleMiddleware) {
                  crons.push(...middleware.toCrontab(builder.commands[0]!));
                }
              }
            }
          }

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
