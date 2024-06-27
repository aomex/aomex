import { execSync } from 'child_process';
import { test } from 'vitest';

test('使用tsx执行', async () => {
  const entryFile = 'packages/web/src/index.ts';
  execSync(`node --import tsx/esm ${entryFile}`, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit',
  });

  execSync(`node --import tsx ${entryFile}`, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit',
  });
});
