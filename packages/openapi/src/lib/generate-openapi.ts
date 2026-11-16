import { OpenAPI } from '@aomex/common';
import { pathToFiles, type GlobPathOptions } from '@aomex/internal-file-import';
import type { WebApp } from '@aomex/web';
import { methodParameterToPathParameter } from './hoist-parameter';
import { hoistSchemaRef } from './hoist-schema-ref';
import { initializeDocument } from './initialize-document';
import { parseFiles } from './parse-files';
import { appendTag } from './append-tag';

export interface GenerateOpenapiOptions {
  /**
   * http接口路由文件
   */
  routers: GlobPathOptions;
  /**
   * `WebApp` 实例：读取全局 `mount` 与 `envelope`，作为 OpenAPI 注入的单一真源。
   *
   * CLI / 测试会 `import` 该模块时，请把 `new WebApp(...)` 与 `app.listen(...)` 拆开
   *（或仅在入口文件 listen），避免副作用起服。
   *
   * ```ts
   * // app.ts —— 只创建并导出
   * export const app = new WebApp({
   *   envelope: { content: { ... } },
   *   mount: [formatError({ ... })],
   *   // services / logger / ...
   * });
   *
   * // main.ts —— 进程入口才听端口
   * import { app } from './app.js';
   * app.listen(3000);
   *
   * generateOpenapi({
   *   routers: './src/routers',
   *   app,
   * });
   * ```
   */
  app: WebApp;
  /**
   * Openapi基础信息
   */
  docs?: Omit<OpenAPI.Document, 'paths' | 'openapi' | 'info'> & {
    openapi?: `3.0.${0 | 1 | 2 | 3}`;
    info?: Partial<OpenAPI.Document['info']>;
  };
  /**
   * 手动修复文档内容
   */
  fix?: (data: OpenAPI.Document) => void | Promise<void>;
}

/**
 * 生成openapi文档
 */
export const generateOpenapi = async (
  config: GenerateOpenapiOptions,
): Promise<OpenAPI.Document> => {
  const document = await initializeDocument(config.docs);
  const files = await pathToFiles(config.routers);
  const app = config.app;
  const usedTags = await parseFiles(document, files, {
    mount: app['middlewareList'],
    envelope: app['options'].envelope,
  });
  appendTag(document, usedTags);
  await config.fix?.(document);
  hoistSchemaRef(document);
  methodParameterToPathParameter(document);

  return JSON.parse(JSON.stringify(document));
};
