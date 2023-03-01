import { HelpMiddleware, scriptName } from '@aomex/console';
import { middleware } from '@aomex/core';
import { outputRule } from './output';

export const outputToHelp = (commandName: string): HelpMiddleware =>
  middleware.help(async (ctx, next) => {
    const { status, yargs } = ctx.cli;
    switch (status) {
      case 'show-all':
        yargs.command(commandName, 'Create cron-compatibly list');
        return next();
      case 'show-detail':
        if (ctx.request.command !== commandName) return next();
        yargs.usage(`${scriptName} ${commandName} [options]`);
        outputRule.toHelp(yargs);
        ctx.response.commandMatched = true;
        return;
      default:
        const _: never = status;
        assert(_);
    }
  });
