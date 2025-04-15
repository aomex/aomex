import { ConsoleApp } from '@aomex/console';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { migrationCreateFile } from '../../src/middleware/migration-create-file.md';
import path from 'path';
import { readdir, readFile, rm } from 'fs/promises';

let migrationsPath!: string;

beforeEach(async () => {
  migrationsPath = path.join(
    path.relative(path.resolve(), path.dirname(import.meta.dirname)),
    'fixtures',
    'migrations-for-create' + Math.random(),
  );
});

afterEach(async () => {
  await rm(migrationsPath, { recursive: true, force: true });
});

test('生成时间前缀', async () => {
  const app = new ConsoleApp({
    mount: [migrationCreateFile(migrationsPath)],
  });
  await app.run('mongoose:migration:create');
  const files = await readdir(migrationsPath);
  expect(files).toHaveLength(1);
  expect(files[0]).toMatch(/^\d{17}_\.ts$/);
});

test('自定义名称', async () => {
  const app = new ConsoleApp({
    mount: [migrationCreateFile(migrationsPath)],
  });
  await app.run('mongoose:migration:create', '--name', 'foobar');
  const files = await readdir(migrationsPath);
  expect(files).toHaveLength(1);
  expect(files[0]).toMatch(/^\d{17}_foobar\.ts$/);
});

test('模板内容', async () => {
  const app = new ConsoleApp({
    mount: [migrationCreateFile(migrationsPath)],
  });
  await app.run('mongoose:migration:create');
  const files = await readdir(migrationsPath);
  await expect(readFile(path.join(migrationsPath, files[0]!), 'utf8')).resolves
    .toMatchInlineSnapshot(`
    "import { migrate } from '@aomex/mongoose';

    export default migrate({
      up: async (db, session) => {
        // up transaction
      },
      down: async (db, session) => {
        // down transaction
      },
    });
    "
  `);
});
