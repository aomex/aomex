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

/**
 * Console 中间件：生成 OpenAPI 文档。
 *
 * 传入 `app` 时请把 `new WebApp(...)` 与 `app.listen(...)` 拆开（或仅在入口 listen），
 * 否则 CLI `import` 同一模块会副作用起服、抢端口。
 *
 * ```ts
 * // app.ts
 * export const app = new WebApp({ envelope: { ... }, mount: [...] });
 *
 * // main.ts
 * import { app } from './app.js';
 * app.listen(3000);
 *
 * // console mount
 * openapi({
 *   commandName: 'openapi',
 *   routers: './src/routers',
 *   app, // 与运行时同一实例
 * });
 * ```
 */
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
        doc[commandName] = {
          summary: i18n.t('help_summary'),
          description: i18n.t('help_app_listen_tip'),
        };
      },
    },
  });
};
