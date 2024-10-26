import type { Mode } from 'node:fs';
import { OpenAPI } from '@aomex/common';
import sleep from 'sleep-promise';
import { pathToFiles } from '@aomex/internal-file-import';
import path from 'node:path';
import {
  validateOpenapi,
  type OpenapiValidateResult,
  type OpenapiValidateResultItem,
} from './validate-openapi';
import { methodParameterToPathParameter } from './hoist-parameter';
import { saveToFile } from './save-to-file';
import { initializeDocument } from './initialize-document';
import { parseFiles } from './parse-files';
import { appendTag } from './append-tag';
import { terminal } from '@aomex/console';
import type { GenerateOpenapiOptions } from './generate-openapi';
import { i18n } from '../i18n';

export interface GenerateOpenapiWithSpinnerOptions extends GenerateOpenapiOptions {
  /**
   * 保存到指定文件。默认值：`openapi.json`
   * - `*.json` 保存为JSON格式
   * - `*.yaml` 保存为YAML格式
   */
  saveToFile?: string;
  /**
   * 设置保存文件的系统权限。
   */
  fileMode?: Mode;
}

interface SpinnerContext {
  document: OpenAPI.Document;
  files: string[];
  usedTags: string[];
  validateResult: OpenapiValidateResult;
}

/**
 * 1. 生成openapi文档
 * 2. 保存文档到文件
 * 3. 验证
 * 4. 控制台输出执行步骤和验证结果
 *
 * 如果是主动调用，则应使用 generateOpenapi()
 * @see generateOpenapi
 */
export const generateOpenapiWithSpinner = async (
  config: GenerateOpenapiWithSpinnerOptions,
): Promise<OpenAPI.Document | null> => {
  const { error, context } = await terminal.runTasks<SpinnerContext>([
    {
      title: i18n.t('initialize'),
      task: async (ctx) => {
        ctx.document = await initializeDocument(config.docs);
      },
    },
    {
      title: i18n.t('search_routers_files'),
      task: async (ctx) => {
        ctx.files = await pathToFiles(config.routers);
        await sleep(500);
      },
    },
    {
      title: i18n.t('parse_routers'),
      task: async (ctx) => {
        ctx.usedTags = await parseFiles(ctx.document, ctx.files);
        await sleep(500);
      },
    },
    {
      title: i18n.t('add_tag'),
      task: async (ctx, task) => {
        const undefinedTags = appendTag(ctx.document, ctx.usedTags);
        if (undefinedTags.length) {
          task.suffix = terminal.style('gray', undefinedTags.join(','));
        } else {
          task.status = 'skip';
        }
      },
    },
    {
      title: i18n.t('hand_fix_documentation'),
      skip: !config.fix,
      task: async (ctx) => {
        await config.fix!(ctx.document);
        await sleep(500);
      },
    },
    {
      title: i18n.t('optimize_parameter'),
      task: async (ctx) => {
        methodParameterToPathParameter(ctx.document);
        await sleep(500);
      },
    },
    {
      title: i18n.t('save_to_file'),
      task: async (ctx, task) => {
        const result = await saveToFile(ctx.document, config.saveToFile, config.fileMode);
        task.suffix =
          terminal.style(
            ['blue', 'underline'],
            path.relative(process.cwd(), result.dest),
          ) + terminal.style('green', ` [${result.size}]`);
      },
    },
    {
      title: i18n.t('validate'),
      task: async (ctx, task) => {
        const result = (ctx.validateResult = await validateOpenapi(ctx.document));
        await sleep(500);

        if (result.errors.length || result.warnings.length) {
          task.suffix = terminal.style(
            'yellow',
            i18n.t('has_error', {
              error_count: result.errors.length,
              warning_count: result.warnings.length,
            }),
          );
        } else {
          task.suffix = terminal.style('green', i18n.t('no_error'));
        }
      },
    },
  ]);

  if (error) return null;

  const logSession = terminal.applySession();
  const { errors, warnings } = context.validateResult;
  for (const error of errors) {
    logSession.update(`  %error% ${formatValidateMessage(error)}`);
    logSession.commit();
  }
  for (const warning of warnings) {
    logSession.update(`  %warning% ${formatValidateMessage(warning)}`);
    logSession.commit();
  }

  return JSON.parse(JSON.stringify(context.document));
};

const formatValidateMessage = (item: OpenapiValidateResultItem) => {
  let pathname = item.path.length ? item.path.join('.') : '';
  return `${terminal.style('gray', `[${pathname || '.'}]`)} ${item.message}`;
};
