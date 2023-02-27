import path from 'node:path';
import { test } from 'vitest';
import { fileToModules } from '../src';

const jsFile = path.resolve('./test/mocks/dir-a/sub/file-i.js');
const tsFile = path.resolve('./test/mocks/dir-a/sub/file-b.ts');

test('parse script files', async () => {
  await expect(fileToModules([jsFile, tsFile])).resolves.toMatchSnapshot(
    'js + ts',
  );
  await expect(fileToModules([jsFile])).resolves.toMatchSnapshot('js only');
  await expect(fileToModules([tsFile])).resolves.toMatchSnapshot('ts only');
});

test('filter modules', async () => {
  const modules = await fileToModules(
    [jsFile],
    (item) => typeof item === 'string',
  );
  expect(modules.length).toBeGreaterThan(0);
  expect(modules.every((item) => typeof item === 'string')).toBeTruthy();
});

test('always returning empty array for non-script file', async () => {
  const modules = await fileToModules([
    path.resolve('./test/mocks/dir-a/file-c.yml'),
  ]);
  expect(modules).toHaveLength(0);
});
