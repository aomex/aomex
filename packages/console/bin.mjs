#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { globSync } from 'node:fs';
import { tsImport } from 'tsx/esm/api';
import { join } from 'node:path';

const fileName = 'cli.{ts,js,mts,mjs}';
const files = globSync([fileName, join('src', fileName)]);
const cliEntry = files[0];

if (!cliEntry) {
  const err = new Error(
    'CLI entry file is not found, Did you forget to create file "cli.ts" or "src/cli.ts"',
  );
  // @ts-expect-error
  err.code = 'ENOENT';
  throw err;
}

process.env['AOMEX_CLI_MODE'] = '1';

if (cliEntry.endsWith('ts')) {
  await tsImport(pathToFileURL(cliEntry).toString(), import.meta.url);
} else {
  await import(pathToFileURL(cliEntry).toString());
}
