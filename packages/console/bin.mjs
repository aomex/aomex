#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { glob } from 'glob';
import { tsImport } from 'tsx/esm/api';

const fileName = 'cli.{ts,js,mts,mjs}';
const files = await glob([fileName, 'src/' + fileName], {
  magicalBraces: true,
});
const cliEntry = files[0];

if (!cliEntry) {
  const err = new Error(
    'CLI entry file is not found, Did you forget to create file "cli.ts" or "src/cli.ts"',
  );
  // @ts-expect-error
  err.code = 'ENOENT';
  throw err;
}

if (cliEntry.endsWith('ts')) {
  await tsImport(pathToFileURL(cliEntry).toString(), import.meta.url);
} else {
  await import(pathToFileURL(cliEntry).toString());
}
