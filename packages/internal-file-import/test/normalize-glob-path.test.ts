import { expect, test } from 'vitest';
import { normalizeGlobPath } from '../src';

test('传递字符串参数', () => {
  expect(normalizeGlobPath('/path/to/file')).toMatchInlineSnapshot(`
    [
      {
        "pattern": [
          "/path/to/file",
        ],
      },
    ]
  `);
});

test('传递对象', () => {
  expect(
    normalizeGlobPath({
      pattern: ['/path/to/file', 'path/to/file2'],
    }),
  ).toMatchInlineSnapshot(`
    [
      {
        "pattern": [
          "/path/to/file",
          "path/to/file2",
        ],
      },
    ]
  `);
});

test('传递字符串数组', () => {
  expect(normalizeGlobPath(['/path/to/file1', '/path/to/sub/file2']))
    .toMatchInlineSnapshot(`
    [
      {
        "pattern": [
          "/path/to/file1",
          "/path/to/sub/file2",
        ],
      },
    ]
  `);
});

test('传递对象数组', () => {
  expect(
    normalizeGlobPath([
      {
        pattern: ['/path/to/file'],
      },
    ]),
  ).toMatchInlineSnapshot(`
    [
      {
        "pattern": [
          "/path/to/file",
        ],
      },
    ]
  `);
});

test('传递空数组', () => {
  expect(normalizeGlobPath([])).toMatchInlineSnapshot(`[]`);
});
