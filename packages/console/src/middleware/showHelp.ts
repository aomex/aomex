import { compose, Middleware, middleware } from '@aomex/core';
import yargs, { type Argv } from 'yargs';

import { scriptName, version } from '../meta';

export interface ShowHelpProps {
  cli: ShowHelp;
}

export class ShowHelp {
  constructor(
    public readonly status: 'show-all' | 'show-detail',
    public readonly yargs: Argv,
  ) {}
}

export const showHelp = (middlewareList: Middleware[]) => {
  const composeFn = compose(middlewareList);

  return middleware.console<ShowHelpProps>(async (ctx, next) => {
    const {
      request: { options, command },
      response,
    } = ctx;

    if (command === '') {
      response.commandMatched = true;
      if (options['version'] || options['v']) {
        console.log(version);
      } else {
        const cli = yargs([])
          .scriptName(scriptName)
          .usage(`${scriptName} [command] [options] [--help|-h]`)
          .describe('version', `Show ${scriptName} version number`)
          .alias('v', 'version')
          .alias('h', 'help');
        ctx.cli = new ShowHelp('show-all', cli);
        await composeFn(ctx);
        cli.showHelp('log');
      }
      return;
    }

    if (options['help'] || options['h']) {
      const cli = yargs([]).scriptName(scriptName).version(false).help(false);
      ctx.cli = new ShowHelp('show-detail', cli);

      await composeFn(ctx);

      if (!response.commandMatched) {
        throw new Error(`Unable to find usage of command "${command}"`);
      }

      cli
        .alias('help', 'h')
        .describe('help', `Show help for command "${command}"`)
        .showHelp('log');
      return;
    }

    return next();
  });
};
