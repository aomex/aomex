import { ConsoleApp } from '@aomex/console';
import { commanders } from '@aomex/console-router';
import { pathToFiles } from '@aomex/file-parser';
import { sleep } from '@aomex/utility';
import { rmSync } from 'fs';
import { test } from 'vitest';
import { getJobConfigs, run } from '../src/run';

test('generate schedule configuration', async () => {
  await expect(
    getJobConfigs('./test/mocks/commanders'),
  ).resolves.toMatchSnapshot();
});

test('Run job (mode=overlap)', async () => {
  const pattern = './test/__temp__/auto-by-worker-*';
  const files = await pathToFiles(pattern);
  files.forEach((file) => rmSync(file));

  const app = new ConsoleApp();
  app.mount(commanders('./test/mocks/commanders'));
  app.mount(run({ paths: './test/mocks/commanders' }));
  await app.run('cron:start');
  await sleep(3000);
  const touchedFiles = await pathToFiles(pattern);
  expect(touchedFiles.length).greaterThan(1);
});

test('Run job (mode=sequence)', async () => {
  const pattern = './test/__temp__/auto-by-worker-*';
  const files = await pathToFiles(pattern);
  files.forEach((file) => rmSync(file));

  const app = new ConsoleApp();
  app.mount(commanders('./test/mocks/commanders'));
  app.mount(run({ paths: './test/mocks/commanders', mode: 'sequence' }));
  await app.run('cron:start');
  await sleep(3000);
  const touchedFiles = await pathToFiles(pattern);
  expect(touchedFiles.length).greaterThan(1);
});
