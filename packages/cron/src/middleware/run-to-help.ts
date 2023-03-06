import { middleware } from '@aomex/core';
import { HelpMiddleware, scriptName } from '@aomex/console';
import { chalk } from '@aomex/utility';

export const runToHelp = (commandName: string): HelpMiddleware =>
  middleware.help(async (ctx, next) => {
    ctx.cli.config({
      all(yargs) {
        yargs.command(chalk.yellow(commandName), 'Star cron jobs');
      },
      detail(yargs) {
        yargs.usage(`${scriptName} ${commandName} [options]`);
      },
      detailCommand: commandName,
      next,
    });
  });
