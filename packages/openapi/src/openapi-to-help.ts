import { HelpMiddleware, scriptName } from '@aomex/console';
import { middleware } from '@aomex/core';
import { chalk } from '@aomex/utility';

export const openapiToHelp = (
  commandName: string,
  summary?: string,
  description?: string,
  showInHelp: boolean = true,
): HelpMiddleware =>
  middleware.help(async (ctx, next) => {
    return ctx.cli.config({
      all(yargs) {
        yargs.command(
          chalk.yellow(commandName),
          summary || 'Generate openapi v3 documentation',
        );
      },
      detailCommand: () => showInHelp && ctx.request.command === commandName,
      detail(yargs) {
        yargs.usage(
          `${scriptName} ${commandName} [options]${
            description ? '\n\n' + chalk.bold(description) : ''
          }`,
        );
      },
      next,
    });
  });
