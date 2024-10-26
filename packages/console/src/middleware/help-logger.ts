import { Middleware, middleware } from '@aomex/common';
import yargs from 'yargs';
import { scriptName, version } from '../utils';
import type { ConsoleDocument, ConsoleMiddleware } from '../override';
import { collectConsoleDocument } from '../utils';
import { styleText } from 'node:util';
import { getDistance } from '../utils/get-distance';
import { i18n } from '../i18n';

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
          .locale(i18n.language)
          .scriptName(scriptName)
          .usage(`${scriptName} ${i18n.t('help.command')} ${i18n.t('help.option')}`)
          .describe('version', i18n.t('help.version', { scriptName }))
          .alias('v', 'version')
          .alias('h', 'help');

        const document: ConsoleDocument.Document = {};
        await collectConsoleDocument({
          document,
          middlewareList,
          app: ctx.app,
        });
        Object.entries(document).forEach(([commandName, commandItem]) => {
          if (commandItem.showInHelp === false) return;
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
      if (!commandItem || commandItem.showInHelp === false) {
        throw new Error(i18n.t('help.no_usage', { command }));
      }

      const cli = yargs([])
        .locale(i18n.language)
        .scriptName(scriptName)
        .version(false)
        .help(false);
      const { description, parameters = [] } = commandItem;

      cli.usage(
        `${scriptName} ${command} ${i18n.t('help.option')}${description ? '\n\n' + styleText('bold', description) : ''}`,
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
          ? i18n.t('command_found_recommended', {
              command,
              recommended: recommendCommand[0],
            })
          : i18n.t('command_not_found', { command }),
      );
    }
  });
};
