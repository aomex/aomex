#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { glob } from 'glob';
import { enableCompileCache } from 'node:module';

const fileName = 'cli.{ts,js,mts,mjs}';
const files = await glob([fileName, `src/${fileName}`], { magicalBraces: true });
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

enableCompileCache();

if (cliEntry.endsWith('ts')) {
  const { tsImport } = await import('tsx/esm/api');
  await tsImport(pathToFileURL(cliEntry).toString(), import.meta.url);
} else {
  await import(pathToFileURL(cliEntry).toString());
}
