import { middleware } from '@aomex/core';
import { HelpMiddleware, scriptName } from '@aomex/console';

export const runToHelp = (commandName: string): HelpMiddleware =>
  middleware.help(async (ctx, next) => {
    const { status, yargs } = ctx.cli;
    switch (status) {
      case 'show-all':
        yargs.command(commandName, 'Star cron');
        return next();
      case 'show-detail':
        if (ctx.request.command !== commandName) return next();
        yargs.usage(`${scriptName} ${commandName} [options]`);
        ctx.response.commandMatched = true;
        return;
      default:
        const _: never = status;
        return _;
    }
  });
