import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { AsyncAPI } from '@aomex/common';
import type { GenerateAsyncapiOptions } from './generate-asyncapi';

/** 深拷贝 `docs` 并补上生成器要写的空骨架。`title` / `version` 为空时回退到 cwd 的 package.json。 */
export const initializeDocument = async (
  basic: GenerateAsyncapiOptions['docs'],
): Promise<AsyncAPI.Document> => {
  const document: AsyncAPI.Document = JSON.parse(JSON.stringify(basic));
  const pkg = await readPackageJson();
  document.info ||= { title: '', version: '' };
  document.info.title ||= pkg.name || 'AsyncAPI';
  document.info.version ||= pkg.version || '0.0.0';
  document.channels = {};
  document.operations = {};
  document.components ||= {};
  document.components.messages ||= {};
  return document;
};

const readPackageJson = async (): Promise<{ name?: string; version?: string }> => {
  try {
    const content = await readFile(path.resolve('package.json'), 'utf8');
    const json = JSON.parse(content);
    return json && typeof json === 'object' ? json : {};
  } catch {
    return {};
  }
};
