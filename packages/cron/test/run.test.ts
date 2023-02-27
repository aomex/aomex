import { ConsoleApp } from '@aomex/console';
import { commanders } from '@aomex/console-router';
import { pathToFiles } from '@aomex/file-parser';
import { sleep } from '@aomex/helper';
import { rmSync } from 'fs';
import { test } from 'vitest';
import { getSchedules, run } from '../src/run';

test('generate schedule configuration', async () => {
  const schedules = await getSchedules('./test/mocks/commanders');
  expect(schedules).toMatchSnapshot();
});

test('Run job (mode=overlap)', async () => {
  const pattern = './test/__temp__/auto-by-worker-*';
  const files = await pathToFiles(pattern);
  files.forEach((file) => rmSync(file));

  const app = new ConsoleApp();
  app.mount(commanders('./test/mocks/commanders'));
  app.mount(run({ paths: './test/mocks/commanders' }));
  await app.run('schedule:run');
  await sleep(3000);
  const touchedFiles = pathToFiles(pattern);
  expect((await touchedFiles).length).greaterThan(1);
});

test('Run job (mode=sequence)', async () => {
  const pattern = './test/__temp__/auto-by-worker-*';
  const files = await pathToFiles(pattern);
  files.forEach((file) => rmSync(file));

  const app = new ConsoleApp();
  app.mount(commanders('./test/mocks/commanders'));
  app.mount(run({ paths: './test/mocks/commanders', mode: 'sequence' }));
  await app.run('schedule:run');
  await sleep(3000);
  const touchedFiles = pathToFiles(pattern);
  expect((await touchedFiles).length).greaterThan(1);
});
