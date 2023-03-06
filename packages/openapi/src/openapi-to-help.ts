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
    const { status, yargs } = ctx.cli;

    switch (status) {
      case 'show-all':
        yargs.command(commandName, summary || '生成openapi标准文档');
        return next();
      case 'show-detail':
        if (!showInHelp || ctx.request.command !== commandName) {
          return next();
        }

        yargs.usage(
          `${scriptName} ${commandName} [options]${
            description ? '\n\n' + chalk.bold(description) : ''
          }`,
        );
        ctx.response.commandMatched = true;
        return;
      default:
        const _: never = status;
        return _;
    }
  });
