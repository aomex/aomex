import { middleware } from '@aomex/common';
import type { ConsoleMiddleware } from '@aomex/console';
import {
  generateOpenapiWithSpinner,
  type GenerateOpenapiWithSpinnerOptions,
} from './lib/generate-document-with-spinner';
import { i18n } from './i18n';

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
        doc[commandName] = { summary: i18n.t('help_summary') };
      },
    },
  });
};
