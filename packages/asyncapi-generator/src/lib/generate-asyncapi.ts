import type { GlobPathOptions } from '@aomex/internal-file-import';
import type { AsyncAPI } from '@aomex/common';
import { Channel } from '@aomex/websocket';
import { initializeDocument } from './initialize-document';
import { parseChannels } from './parse-channels';
import { resolveChannels } from './resolve-channels';

export interface GenerateAsyncapiOptions {
  /**
   * Channel 来源：目录 glob，或已实例化的 `Channel[]`。
   *
   * ```ts
   * generateAsyncapi({
   *   channels: './src/channels',
   *   docs: { asyncapi: '3.1.0' },
   * });
   * generateAsyncapi({
   *   channels: [channel],
   *   docs: { asyncapi: '3.1.0' },
   * });
   * ```
   */
  channels: GlobPathOptions | Channel[];
  /**
   * AsyncAPI 基础信息（会与空文档骨架合并）。
   * `asyncapi` 版本须由调用方显式填写（`3.0.0` / `3.1.0`）。
   * `channels` / `operations` / `components` 由生成器写入；
   * `servers`、`id`、`defaultContentType` 以及 `info` 的其余字段会保留。
   */
  docs: {
    asyncapi: AsyncAPI.Document['asyncapi'];
    info?: Partial<AsyncAPI.InfoObject>;
  } & Omit<
    AsyncAPI.Document,
    'asyncapi' | 'info' | 'channels' | 'operations' | 'components'
  >;
  /**
   * 手动修复文档内容。
   */
  fix?: (data: AsyncAPI.Document) => void | Promise<void>;
}

/**
 * 从 Channel 生成 AsyncAPI 3.x 文档。
 */
export const generateAsyncapi = async (
  config: GenerateAsyncapiOptions,
): Promise<AsyncAPI.Document> => {
  const document = await initializeDocument(config.docs);
  const channels = await resolveChannels(config.channels);
  parseChannels(document, channels);
  await config.fix?.(document);
  return JSON.parse(JSON.stringify(document));
};
