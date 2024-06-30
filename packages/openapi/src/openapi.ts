import { i18n, middleware } from '@aomex/core';
import type { ConsoleMiddleware } from '@aomex/console';
import {
  generateOpenapiWithSpinner,
  type GenerateOpenapiWithSpinnerOptions,
} from './lib/generate-document-with-spinner';

export interface OpenapiOptions extends GenerateOpenapiWithSpinnerOptions {
  /**
   * 指令名称。默认值：`openapi`
   */
  commandName?: string;
}

export const openapi = (options: OpenapiOptions): ConsoleMiddleware => {
  const { commandName = 'openapi' } = options;

  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;
      await generateOpenapiWithSpinner(options);
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('openapi.help_summary') };
      },
    },
  });
};
