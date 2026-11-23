import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import type { Mode } from 'node:fs';
import YAML from 'yaml';
import { bytes } from '@aomex/internal-tools';
import type { AsyncAPI } from '@aomex/common';

export const saveToFile = async (
  document: AsyncAPI.Document,
  filename?: string,
  fileMode?: Mode,
) => {
  const dest = path.resolve(filename || 'asyncapi.json');
  const ext = path.extname(dest);
  const content =
    ext.endsWith('.yaml') || ext.endsWith('.yml')
      ? YAML.stringify(document)
      : JSON.stringify(document);
  const size = bytes(Buffer.byteLength(content), { unitSeparator: '' });

  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, content, { mode: fileMode, flush: true });

  return { dest, size };
};
