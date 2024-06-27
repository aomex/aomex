#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { pathToFiles } from '@aomex/internal-file-import';

const fileName = 'cli.{ts,js,mts,mjs}';
const files = await pathToFiles([fileName, 'src/' + fileName]);
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
  const execArgv = [...process.execArgv];
  execArgv.unshift('--import', 'tsx/esm');
  const streams = spawn(
    process.argv0,
    [...execArgv, cliEntry, ...hideBin(process.argv)],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
    },
  );
  streams.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  await import(pathToFileURL(cliEntry).toString());
}
