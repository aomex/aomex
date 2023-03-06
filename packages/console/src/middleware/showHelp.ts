import { compose, Middleware, middleware, Next } from '@aomex/core';
import yargs, { type Argv } from 'yargs';
import type { ConsoleContext } from '../app';

import { scriptName, version } from '../meta';

export interface ShowHelpProps {
  cli: ShowHelp;
}

export class ShowHelp {
  constructor(
    protected readonly ctx: ConsoleContext,
    protected readonly status: 'all' | 'detail',
    protected readonly yargs: Argv,
  ) {}

  async config({
    next,
    all,
    detail,
    detailCommand,
  }: {
    all: (yargs: Argv) => Promise<void> | void;
    detail: (yargs: Argv) => Promise<void> | void;
    detailCommand: string | (() => boolean);
    next: Next;
  }) {
    if (this.status === 'all') {
      await all(this.yargs);
      return next();
    } else if (this.status === 'detail') {
      if (typeof detailCommand === 'string') {
        if (detailCommand !== this.ctx.request.command) return next();
      } else {
        if (!detailCommand()) {
          return next();
        }
      }

      await detail(this.yargs);
      this.ctx.response.commandMatched = true;
    }
  }
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
        ctx.cli = new ShowHelp(ctx, 'all', cli);
        await composeFn(ctx);
        cli.showHelp('log');
      }
      return;
    }

    if (options['help'] || options['h']) {
      const cli = yargs([]).scriptName(scriptName).version(false).help(false);
      ctx.cli = new ShowHelp(ctx, 'detail', cli);

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
