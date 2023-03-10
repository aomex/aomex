import { ConsoleMiddleware, scriptName } from '@aomex/console';
import { Chain, middleware } from '@aomex/core';
import {
  chalk,
  fileToModules,
  PathToFileOptions,
  pathToFiles,
} from '@aomex/utility';
import type { Builder } from './builder';
import { Commander } from './commander';

interface CommanderToHelpOptions {
  paths?: PathToFileOptions;
  commanders?: Commander[];
}

export const commanderToHelp = (options: CommanderToHelpOptions) =>
  middleware.help(async (ctx, next) => {
    const builders = await getBuilders(options);
    const { command } = ctx.request;

    return ctx.cli.config({
      all(yargs) {
        for (const builder of builders) {
          if (!builder.showInHelp) continue;
          const commands = builder.commands.slice();
          commands[0] = chalk.yellow(commands[0]);
          yargs.command(commands, builder.docs.summary || '');
        }
      },
      detail(yargs) {
        for (const builder of builders) {
          if (!builder.showInHelp || !builder.match(command)) continue;
          const { commands, docs } = builder;
          const description = docs.description || docs.summary;
          yargs.usage(
            `${scriptName} ${commands.join('|')} [options]${
              description ? '\n\n' + chalk.bold(description) : ''
            }`,
          );
          for (const middleware of Chain.flatten(builder.chain)) {
            if (middleware instanceof ConsoleMiddleware) {
              middleware.toHelp(yargs);
            }
          }
          break;
        }
      },
      next,
      detailCommand: () => {
        return builders.some(
          (builder) => builder.showInHelp && builder.match(command),
        );
      },
    });
  });

const getBuilders = async (options: CommanderToHelpOptions) => {
  const builders: Builder[] = [];
  const commanders: Commander[] = [];

  if (options.commanders) {
    commanders.push(...options.commanders);
  } else if (options.paths) {
    const files = await pathToFiles(options.paths);
    const modules = await fileToModules<Commander>(
      files,
      (item) => !!item && item instanceof Commander,
    );
    commanders.push(...modules);
  }

  for (const commander of Object.values(commanders)) {
    builders.push(...Commander.getBuilders(commander));
  }

  return builders;
};
