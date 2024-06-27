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
