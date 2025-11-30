import { existsSync, rmSync } from 'fs';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import path from 'path';
import { expect, test } from 'vitest';

const execPromise = promisify(exec);

const fixtures = path.join(import.meta.dirname, 'fixtures');

/**
 * 动态加载数据库配置并获取 schema 路径
 */
function getSchemaPath(provider: string): string {
  return path.join(fixtures, `${provider}.prisma`);
}

const getConfigPath = (provider: string): string => {
  return path.relative(process.cwd(), path.join(fixtures, `${provider}.config.ts`));
};

const bin = path.join(import.meta.dirname, '..', 'node_modules', '.bin', 'prisma');

test.each(['mysql', 'postgresql', 'mongodb', 'sqlite'])(
  'generate %s',
  async (provider) => {
    const tsFile = path.join(fixtures, `temp.${provider}.ts`);
    try {
      rmSync(tsFile);
    } catch {}
    await execPromise(
      `${bin} generate --schema ${getSchemaPath(provider)} --generator aomex --config ${getConfigPath(provider)}`,
    );
    expect(existsSync(tsFile)).toBeTruthy();
    try {
      rmSync(tsFile);
    } catch {}
  },
  300_000,
);
