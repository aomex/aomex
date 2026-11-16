import { expect, test } from 'vitest';
import { findFiles } from './fixture/helper/find-files';
import path, { join, relative } from 'node:path';

const __dir = join(import.meta.dirname, 'fixture', 'files');

test('匹配目录下的js文件', async () => {
  await expect(findFiles(join(__dir, 'normal'))).resolves.toMatchInlineSnapshot(`
    [
      "normal/a.js",
      "normal/a.mjs",
      "normal/a.mts",
      "normal/a.ts",
    ]
  `);
});

test('匹配目录和子目录的js文件', async () => {
  await expect(findFiles(join(__dir, 'with-sub-dir'))).resolves.toMatchInlineSnapshot(`
    [
      "with-sub-dir/a.mts",
      "with-sub-dir/sub-dir/a.js",
    ]
  `);
});

test('匹配特定文件', async () => {
  await expect(findFiles(join(__dir, 'normal', 'a.cjs'))).resolves.toMatchInlineSnapshot(`
    [
      "normal/a.cjs",
    ]
  `);
});

test('支持自定义通配符', async () => {
  await expect(findFiles({ pattern: [join(__dir, 'normal', '**')] })).resolves
    .toMatchInlineSnapshot(`
    [
      "normal/a.cjs",
      "normal/a.js",
      "normal/a.mjs",
      "normal/a.mts",
      "normal/a.ts",
      "normal/a.txt",
    ]
  `);
});

test('开启dot参数，可以匹配到.开头的文件', async () => {
  await expect(findFiles({ pattern: [join(__dir, 'normal', '**')], dot: true })).resolves
    .toMatchInlineSnapshot(`
    [
      "normal/.a",
      "normal/a.cjs",
      "normal/a.js",
      "normal/a.mjs",
      "normal/a.mts",
      "normal/a.ts",
      "normal/a.txt",
    ]
  `);
});

test('支持相对路径', async () => {
  const relativePath = relative(path.resolve(), __dir);
  await expect(findFiles(join(relativePath, 'normal'))).resolves.toMatchInlineSnapshot(`
    [
      "normal/a.js",
      "normal/a.mjs",
      "normal/a.mts",
      "normal/a.ts",
    ]
  `);
});

test('默认忽略 *.d.ts / *.d.mts', async () => {
  await expect(findFiles(join(__dir, 'with-decls'))).resolves.toMatchInlineSnapshot(`
    [
      "with-decls/a.ts",
    ]
  `);
});

test('默认忽略 node_modules', async () => {
  await expect(findFiles(join(__dir, 'with-node-modules'))).resolves
    .toMatchInlineSnapshot(`
    [
      "with-node-modules/app.ts",
    ]
  `);
});

test('自定义 ignore', async () => {
  await expect(
    findFiles({
      pattern: [join(__dir, 'normal', '**')],
      ignore: ['**/*.txt', '**/*.cjs'],
    }),
  ).resolves.toMatchInlineSnapshot(`
    [
      "normal/a.js",
      "normal/a.mjs",
      "normal/a.mts",
      "normal/a.ts",
    ]
  `);
});

test('花括号模式走 hasMagic(magicalBraces) 分支', async () => {
  await expect(
    findFiles({
      pattern: [join(__dir, 'normal', '*.{js,ts}')],
    }),
  ).resolves.toMatchInlineSnapshot(`
    [
      "normal/a.js",
      "normal/a.ts",
    ]
  `);
});

test('返回绝对路径且去重排序', async () => {
  const { pathToFiles } = await import('../src');
  const files = await pathToFiles([
    join(__dir, 'normal', 'a.ts'),
    join(__dir, 'normal', 'a.ts'),
    join(__dir, 'normal', 'a.js'),
  ]);
  expect(files.every((file) => path.isAbsolute(file))).toBe(true);
  expect(files).toEqual([...files].sort());
  expect(files).toHaveLength(2);
});
