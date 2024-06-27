import { i18n, middleware } from '@aomex/core';
import type { ConsoleMiddleware } from '@aomex/console';
import { generateDocument, type OpenapiOptions } from './lib/generate-document';

const commandName = 'openapi';

export const openapi = (options: OpenapiOptions): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;
      await generateDocument(options);
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('openapi.help_summary') };
      },
    },
  });
};
