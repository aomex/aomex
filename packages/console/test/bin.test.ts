import { execSync } from 'node:child_process';
import { mkdirSync, rmdirSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, expect, test } from 'vitest';

const bin = path.join(path.dirname(import.meta.dirname), 'bin.mjs');
let dir = '';

beforeEach(() => {
  dir = path.join(
    import.meta.dirname,
    'tmpdir',
    Date.now().toString() + Math.random().toString(),
  );
  mkdirSync(path.join(dir, 'src'), { recursive: true });
  writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}');
});

afterEach(() => {
  rmdirSync(dir, { recursive: true });
});

test('找不到入口文件报错', async () => {
  expect(() => execSync(`node ${bin}`, { cwd: dir, encoding: 'utf8' })).toThrowError(
    'CLI entry file is not found',
  );
});

test('执行.js文件', async () => {
  await writeFile(
    path.join(dir, 'src/cli.js'),
    `
    const a = "abc";
    const b = 1;
    console.log(a, b);
    `,
  );
  expect(execSync(`node ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe('abc 1\n');
});

test('执行.ts文件', async () => {
  await writeFile(
    path.join(dir, 'src/cli.ts'),
    `
    const a: string = "abc";
    const b = 1;
    console.log(a, b);
    `,
  );
  expect(execSync(`node ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe('abc 1\n');
});

test('环境变量', async () => {
  await writeFile(
    path.join(dir, 'src/cli.ts'),
    'console.log(process.env.AOMEX_CLI_MODE)',
  );
  expect(execSync(`node ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe('1\n');
});

test('允许import相对模块时缺省后缀', async () => {
  await writeFile(
    path.join(dir, 'src', 'cli.ts'),
    `
    import { str } from './b';
    console.log(str);
    `,
  );
  await writeFile(path.join(dir, 'src', 'b.ts'), `export * from './c';`);
  await writeFile(path.join(dir, 'src', 'c.js'), `export const str='abcd';`);

  expect(execSync(`node ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe('abcd\n');
});

test.each(<const>[
  'cli.js',
  'cli.mjs',
  'cli.ts',
  'cli.mts',
  'src/cli.js',
  'src/cli.ts',
  'src/cli.mjs',
  'src/cli.mts',
])('寻找文件 %s', async (value) => {
  await writeFile(path.join(dir, value), `console.log('${value}')`);
  expect(execSync(`node ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe(value + '\n');
});
