import { ConsoleApp } from '@aomex/console';
import { readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { output } from '../../src/middleware/output';

test('export crontab', async () => {
  const spy = vitest.spyOn(console, 'log');
  let msg = '';
  spy.mockImplementation((_) => {
    msg = _;
  });

  const app = new ConsoleApp();
  app.mount(output('./test/mocks/commanders'));
  await app.run('cron:export');
  expect(msg).toMatchSnapshot();
  spy.mockRestore();
});

test('export crontab to specific file', async () => {
  const file = path.join(
    tmpdir(),
    'd' + Date.now().toString(),
    'f' + Math.random().toString(),
  );
  const app = new ConsoleApp();
  app.mount(output('./test/mocks/commanders'));
  await app.run('cron:export', '--output', file);
  expect(readFileSync(file, 'utf-8')).toMatchSnapshot();

  await rm(file);
  await app.run('cron:export', '-o', file);
  expect(readFileSync(file, 'utf-8')).toMatchSnapshot();
});
