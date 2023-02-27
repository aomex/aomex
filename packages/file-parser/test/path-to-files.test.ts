import { isAbsolute, resolve } from 'node:path';
import { test } from 'vitest';
import { pathToFiles } from '../src';

test('always returning absolute path', async () => {
  const files = await pathToFiles('./test/mocks/dir-a/*');
  expect(files.length).toBeGreaterThan(0);
  expect(files.every(isAbsolute)).toBeTruthy();
});

test('find files in one directory', async () => {
  const files = await pathToFiles('./test/mocks/dir-a/*');
  expect(files).toHaveLength(3);
  expect(files).contains(resolve('./test/mocks/dir-a/file-c.yml'));
  expect(files).not.contains(resolve('./test/mocks/dir-a/.dot-file'));
});

test('find all finds (includes dot file)', async () => {
  const files = await pathToFiles({
    pattern: ['./test/mocks/dir-a/*'],
    dot: true,
  });
  expect(files).toHaveLength(4);
  expect(files).contains(resolve('./test/mocks/dir-a/.dot-file'));
});

test('find all files recursively', async () => {
  const files = await pathToFiles('./test/mocks/**');
  expect(files).toHaveLength(8);
  expect(files).contains(resolve('./test/mocks/dir-a/sub/file-i.js'));
});

test('only search js files without magic path', async () => {
  const files = await pathToFiles('./test/mocks/');
  expect(files).toHaveLength(2);
  expect(files).contains(resolve('./test/mocks/dir-a/sub/file-i.js'));
  expect(files).contains(resolve('./test/mocks/dir-a/sub/file-b.ts'));
});

test('ignore specific files', async () => {
  const files = await pathToFiles({
    pattern: ['./test/mocks/dir-b/*'],
    ignore: ['**/file-d.txt'],
  });
  expect(files).toHaveLength(2);
  expect(files).not.contains(resolve('./test/mocks/dir-b/file-d.txt'));
});

test('throw exception when directory not exists', async () => {
  await expect(
    pathToFiles('./test/mocks/not-exist-dir'),
  ).rejects.toThrowError();
});

test('support string[] arguments', async () => {
  const files = await pathToFiles([
    './test/mocks/dir-a/*',
    './test/mocks/dir-b/*',
  ]);
  expect(files).toHaveLength(6);
  expect(files).contains(resolve('./test/mocks/dir-a/file-a.yml'));
  expect(files).contains(resolve('./test/mocks/dir-b/file-d.txt'));
});

test('support object[] arguments', async () => {
  const files = await pathToFiles([
    {
      pattern: ['./test/mocks/dir-a/*'],
      ignore: ['**/*.yml'],
    },
    {
      pattern: ['./test/mocks/dir-b/*'],
    },
  ]);
  expect(files).toHaveLength(4);
  expect(files).not.contains(resolve('./test/mocks/dir-a/file-a.yml'));
  expect(files).contains(resolve('./test/mocks/dir-b/file-e.yml'));
});
