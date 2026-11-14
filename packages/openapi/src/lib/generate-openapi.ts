import { OpenAPI } from '@aomex/common';
import { pathToFiles, type GlobPathOptions } from '@aomex/internal-file-import';
import type { WebMiddlewareToken } from '@aomex/web';
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
   * Web 全局中间件（与 `WebApp` 的 `mount` 对应）。
   * 用于收集鉴权、错误格式化等全局中间件写入的 OpenAPI 信息。
   *
   * ```ts
   * import { middlewares } from './middleware/web.js';
   *
   * generateOpenapi({
   *   routers: './src/routers',
   *   mount: middlewares,
   * });
   * ```
   */
  mount?: WebMiddlewareToken[];
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
  const usedTags = await parseFiles(document, files, config.mount);
  appendTag(document, usedTags);
  await config.fix?.(document);
  hoistSchemaRef(document);
  methodParameterToPathParameter(document);

  return JSON.parse(JSON.stringify(document));
};
