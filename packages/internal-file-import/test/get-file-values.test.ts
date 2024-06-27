import { join } from 'node:path';
import { expect, test } from 'vitest';
import { getFileValues } from '../src';

const __dir = join(import.meta.dirname, 'fixture', 'files');

test('导出某个文件的所有值', async () => {
  await expect(
    getFileValues([join(__dir, 'normal', 'a.js')]),
  ).resolves.toMatchInlineSnapshot(`[]`);

  await expect(getFileValues([join(__dir, 'normal', 'a.mjs')])).resolves
    .toMatchInlineSnapshot(`
    [
      "str-1",
      {
        "obj": "1",
      },
    ]
  `);
});

test('多个文件值合并', async () => {
  await expect(
    getFileValues([join(__dir, 'normal', 'a.mjs'), join(__dir, 'normal', 'a.mts')]),
  ).resolves.toMatchInlineSnapshot(`
    [
      "str-1",
      {
        "obj": "1",
      },
      "str-2",
      {
        "obj": "2",
      },
    ]
  `);
});

test('相同的值被合并', async () => {
  await expect(getFileValues([join(__dir, 'normal', 'a.ts')])).resolves
    .toMatchInlineSnapshot(`
    [
      "str-3",
      {
        "obj": "3",
      },
    ]
  `);
});

test('过滤出期待的值', async () => {
  await expect(
    getFileValues(
      [join(__dir, 'normal', 'a.mjs'), join(__dir, 'normal', 'a.mts')],
      (item) => typeof item === 'string',
    ),
  ).resolves.toMatchInlineSnapshot(`
    [
      "str-1",
      "str-2",
    ]
  `);
});
