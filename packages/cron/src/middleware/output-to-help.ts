import { HelpMiddleware, scriptName } from '@aomex/console';
import { middleware } from '@aomex/core';
import { chalk } from '@aomex/utility';
import { outputRule } from './output';

export const outputToHelp = (commandName: string): HelpMiddleware =>
  middleware.help(async (ctx, next) => {
    return ctx.cli.config({
      all(yargs) {
        yargs.command(chalk.yellow(commandName), 'Create cron-compatibly list');
      },
      detail(yargs) {
        yargs.usage(`${scriptName} ${commandName} [options]`);
        outputRule.toHelp(yargs);
      },
      next,
      detailCommand: commandName,
    });
  });
