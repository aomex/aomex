import { Middleware, i18n, middleware } from '@aomex/core';
import yargs from 'yargs';
import { scriptName, version } from '../utils';
import type { ConsoleDocument, ConsoleMiddleware } from '../override';
import { collectConsoleDocument } from '../utils';
import { styleText } from 'node:util';
import { getDistance } from '../utils/get-distance';

export const helpLogger = (middlewareList: Middleware[]): ConsoleMiddleware => {
  return middleware.console(async (ctx, next) => {
    const {
      input: { options, command },
    } = ctx;

    if (command === '') {
      ctx.commandMatched = true;
      if (options['version'] || options['v']) {
        console.log(version);
      } else {
        const cli = yargs([])
          .locale(i18n.getLocale())
          .scriptName(scriptName)
          .usage(`${scriptName} [指令] [选项]`)
          .describe('version', `显示${scriptName}版本号`)
          .alias('v', 'version')
          .alias('h', 'help');

        const document: ConsoleDocument.Document = {};
        await collectConsoleDocument({
          document,
          middlewareList,
          app: ctx.app,
        });
        Object.entries(document).forEach(([commandName, commandItem]) => {
          if (commandItem.show === false) return;
          cli.command(styleText('yellow', commandName), commandItem.summary || '');
        });
        cli.showHelp('log');
      }
      return;
    }

    if (options['help'] || options['h']) {
      ctx.commandMatched = true;
      const document: ConsoleDocument.Document = {};
      await collectConsoleDocument({ document, middlewareList, app: ctx.app });

      const commandItem = document[command];
      if (!commandItem || commandItem.show === false) {
        throw new Error(`找不到关于指令 "${command}" 的用法`);
      }

      const cli = yargs([])
        .locale(i18n.getLocale())
        .scriptName(scriptName)
        .version(false)
        .help(false);
      const { description, parameters = [] } = commandItem;

      cli.usage(
        `${scriptName} ${command} [选项]${description ? '\n\n' + styleText('bold', description) : ''}`,
      );

      parameters.forEach((parameter) => {
        cli.option(parameter.name, {
          alias: parameter.alias,
          description: parameter.description,
          deprecated: parameter.deprecated,
          type: parameter.type,
          default: parameter.defaultValue,
        });
      });

      cli.showHelp('log');

      return;
    }

    await next();

    if (!ctx.commandMatched) {
      const recommendCommand = Object.entries(
        await collectConsoleDocument({
          document: {},
          middlewareList,
          app: ctx.app,
        }),
      )
        .map(([commandName]) => <const>[commandName, getDistance(command, commandName)])
        .filter((item) => item[1] <= 3)
        .sort((a, b) => a[1] - b[1])[0];

      throw new Error(
        recommendCommand
          ? i18n.t('console.command_found_recommended', {
              command,
              recommended: recommendCommand[0],
            })
          : i18n.t('console.command_not_found', { command }),
      );
    }
  });
};
