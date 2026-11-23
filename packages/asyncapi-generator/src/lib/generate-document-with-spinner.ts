import type { Mode } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { terminal } from '@aomex/console';
import type { AsyncAPI } from '@aomex/common';
import { Channel } from '@aomex/websocket';
import { i18n } from '../i18n';
import type { GenerateAsyncapiOptions } from './generate-asyncapi';
import { initializeDocument } from './initialize-document';
import { parseChannels } from './parse-channels';
import { isChannelList, resolveChannels } from './resolve-channels';
import { saveToFile } from './save-to-file';
import {
  validateAsyncapi,
  type AsyncapiValidateResult,
  type AsyncapiValidateResultItem,
} from './validate-asyncapi';

export interface GenerateAsyncapiWithSpinnerOptions extends GenerateAsyncapiOptions {
  /**
   * 保存到指定文件。默认值：`asyncapi.json`
   * - `*.json` 保存为 JSON
   * - `*.yaml` / `*.yml` 保存为 YAML
   */
  saveToFile?: string;
  /**
   * 设置保存文件的系统权限。
   */
  fileMode?: Mode;
}

interface SpinnerContext {
  document: AsyncAPI.Document;
  channels: Channel[];
  validateResult: AsyncapiValidateResult;
}

/**
 * 生成 → 保存 → 校验，并在终端展示步骤。
 * 编程调用请优先用 {@link generateAsyncapi}。
 */
export const generateAsyncapiWithSpinner = async (
  config: GenerateAsyncapiWithSpinnerOptions,
): Promise<AsyncAPI.Document | null> => {
  const { error, context } = await terminal.runTasks<SpinnerContext>([
    {
      title: i18n.t('initialize'),
      task: async (ctx) => {
        ctx.document = await initializeDocument(config.docs);
      },
    },
    {
      title: i18n.t('search_channels_files'),
      task: async (ctx, task) => {
        if (isChannelList(config.channels)) {
          ctx.channels = config.channels;
          task.status = 'skip';
          return;
        }
        ctx.channels = await resolveChannels(config.channels);
        await sleep(500);
      },
    },
    {
      title: i18n.t('parse_channels'),
      task: async (ctx) => {
        parseChannels(ctx.document, ctx.channels);
        await sleep(500);
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
        const result = (ctx.validateResult = await validateAsyncapi(ctx.document));
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

  const logSession = terminal.createSession();
  const { errors, warnings } = context.validateResult;
  for (const item of errors) {
    logSession.update(`  %error% ${formatValidateMessage(item)}`);
    logSession.commit();
  }
  for (const item of warnings) {
    logSession.update(`  %warning% ${formatValidateMessage(item)}`);
    logSession.commit();
  }

  return JSON.parse(JSON.stringify(context.document));
};

const formatValidateMessage = (item: AsyncapiValidateResultItem) => {
  const pathname = item.path.length ? item.path.join('.') : '';
  return `${terminal.style('gray', `[${pathname || '.'}]`)} ${item.message}`;
};
