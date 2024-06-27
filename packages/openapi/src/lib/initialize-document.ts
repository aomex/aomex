import type { OpenAPI } from '@aomex/core';
import type { OpenapiOptions } from './generate-document';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const initializeDocument = async (basic?: OpenapiOptions['docs']) => {
  const document: OpenAPI.Document = JSON.parse(JSON.stringify(basic || {}));
  document.openapi ||= '3.0.3';
  document.tags ||= [];
  document.info ||= { title: '', version: '' };
  document.paths = {};
  document.info.title ||= (await readPackageJson()).name || 'OpenAPI';
  document.info.version ||= (await readPackageJson()).version || '0.0.0';
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
