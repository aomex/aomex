import { middleware } from '@aomex/common';
import type { ConsoleMiddleware } from '@aomex/console';
import {
  generateAsyncapiWithSpinner,
  type GenerateAsyncapiWithSpinnerOptions,
} from './lib/generate-document-with-spinner';
import { i18n } from './i18n';

export interface AsyncapiOptions extends GenerateAsyncapiWithSpinnerOptions {
  /**
   * 指令名称。默认值：`asyncapi`
   */
  commandName?: string;
}

/**
 * Console 中间件：生成 AsyncAPI 文档。
 *
 * ```ts
 * import { asyncapi } from '@aomex/asyncapi-generator';
 *
 * asyncapi({
 *   commandName: 'asyncapi',
 *   channels: './src/channels',
 *   docs: { asyncapi: '3.1.0' },
 *   saveToFile: 'asyncapi.json',
 * });
 * ```
 */
export const asyncapi = (options: AsyncapiOptions): ConsoleMiddleware => {
  const { commandName = 'asyncapi' } = options;

  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;
      await generateAsyncapiWithSpinner(options);
    },
    help: {
      onDocument(doc) {
        doc[commandName] = {
          summary: i18n.t('help_summary'),
        };
      },
    },
  });
};
