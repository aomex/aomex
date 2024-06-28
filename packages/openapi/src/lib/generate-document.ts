import type { Mode } from 'node:fs';
import { OpenAPI, i18n } from '@aomex/core';
import { sleep } from '@aomex/internal-tools';
import { pathToFiles, type GlobPathOptions } from '@aomex/internal-file-import';
import path from 'node:path';
import {
  validateOpenapi,
  type OpenapiValidateResult,
  type OpenapiValidateResultItem,
} from './validate-openapi';
import { methodParameterToPathParameter } from './hoist-parameter';
import { saveToFile } from './save-to-file';
import { initializeDocument } from './initialize-document';
import { Listr } from 'listr2';
import { parseFiles } from './parse-files';
import logSymbols from 'log-symbols';
import { appendTag } from './append-tag';
import { styleText } from 'node:util';

export interface OpenapiOptions {
  /**
   * 指令名称。默认值：`openapi`
   */
  commandName?: string;
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
   * 保存到指定文件。默认值：`openapi.json`
   * - `*.json` 保存为JSON格式
   * - `*.yml`  保存为YAML格式
   * - `*.yaml` 保存为YAML格式
   */
  saveToFile?: string;
  /**
   * 设置保存文件的系统权限。
   */
  fileMode?: Mode;
  /**
   * 手动修复文档内容
   */
  fix?: (data: OpenAPI.Document) => void | Promise<void>;
}

interface SpinnerContext {
  document: OpenAPI.Document;
  files: string[];
  usedTags: string[];
  validateResult: OpenapiValidateResult;
}

export const generateDocument = async (
  config: OpenapiOptions,
): Promise<OpenAPI.Document> => {
  const spinner = new Listr<SpinnerContext>([], { concurrent: false, exitOnError: true });

  spinner.add({
    title: i18n.t('openapi.initialize'),
    task: async (ctx) => {
      ctx.document = await initializeDocument(config.docs);
    },
  });

  spinner.add({
    title: i18n.t('openapi.search_routers_files'),
    task: async (ctx) => {
      ctx.files = await pathToFiles(config.routers);
      await sleep(500);
    },
  });

  spinner.add({
    title: i18n.t('openapi.parse_routers'),
    task: async (ctx) => {
      ctx.usedTags = await parseFiles(ctx.document, ctx.files);
      await sleep(500);
    },
  });

  spinner.add({
    title: i18n.t('openapi.add_tag'),
    task: (ctx, task) => {
      const undefinedTags = appendTag(ctx.document, ctx.usedTags);
      if (undefinedTags.length) {
        task.title += ' ' + styleText('gray', undefinedTags.join(','));
      } else {
        task.skip();
      }
    },
  });

  spinner.add({
    title: i18n.t('openapi.hand_fix_documentation'),
    skip: !config.fix,
    task: async (ctx) => {
      await config.fix!(ctx.document);
      await sleep(500);
    },
  });

  spinner.add({
    title: i18n.t('openapi.optimize_parameter'),
    task: async (ctx) => {
      methodParameterToPathParameter(ctx.document);
      await sleep(500);
    },
  });

  spinner.add({
    title: i18n.t('openapi.save_to_file'),
    task: async (ctx, task) => {
      const result = await saveToFile(ctx.document, config.saveToFile, config.fileMode);
      task.title +=
        ' ' +
        styleText(['blue', 'underline'], path.relative(process.cwd(), result.dest)) +
        styleText('green', ` [${result.size}]`);
    },
  });

  spinner.add({
    title: i18n.t('openapi.validate'),
    task: async (ctx, task) => {
      const result = (ctx.validateResult = await validateOpenapi(ctx.document));
      await sleep(500);

      if (result.errors.length || result.warnings.length) {
        task.title +=
          ' ' +
          styleText(
            'yellow',
            i18n.t('openapi.has_error', {
              error_count: result.errors.length,
              warning_count: result.warnings.length,
            }),
          );
      } else {
        task.title += ' ' + styleText('green', i18n.t('openapi.no_error'));
      }
    },
  });

  const context = await spinner.run({} as SpinnerContext);

  const { errors, warnings } = context.validateResult;
  for (const error of errors) {
    console.log(`  ${logSymbols.error} ${formatValidateMessage(error)}`);
  }
  for (const warning of warnings) {
    console.log(`  ${logSymbols.warning} ${formatValidateMessage(warning)}`);
  }

  return JSON.parse(JSON.stringify(context.document));
};

const formatValidateMessage = (item: OpenapiValidateResultItem) => {
  let pathname = item.path.length ? item.path.join('.') : '';
  return `${styleText('gray', `[${pathname || '.'}]`)} ${item.message}`;
};
