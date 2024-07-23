import { OpenAPI } from '@aomex/core';
import { pathToFiles, type GlobPathOptions } from '@aomex/internal-file-import';
import { methodParameterToPathParameter } from './hoist-parameter';
import { initializeDocument } from './initialize-document';
import { parseFiles } from './parse-files';
import { appendTag } from './append-tag';

export interface GenerateOpenapiOptions {
  /**
   * http接口路由文件
   */
  routers: GlobPathOptions;
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
  const usedTags = await parseFiles(document, files);
  appendTag(document, usedTags);
  await config.fix?.(document);
  methodParameterToPathParameter(document);

  return JSON.parse(JSON.stringify(document));
};
