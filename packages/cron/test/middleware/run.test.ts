import { ConsoleApp } from '@aomex/console';
import { commanders } from '@aomex/commander';
import { test } from 'vitest';
import { Job } from '../../src/lib/job';
import { run } from '../../src/middleware/run';

test('Run middleware', async () => {
  const spy = vitest.spyOn(Job.prototype, 'start');
  spy.mockImplementation(async () => {});

  const app = new ConsoleApp();
  app.mount(commanders('./test/mocks/commanders'));
  app.mount(run({ paths: './test/mocks/commanders' }));
  await app.run('cron:start');
  expect(spy).toHaveBeenCalledTimes(4);
});

test('Not matched', async () => {
  const app = new ConsoleApp();
  app.mount(commanders('./test/mocks/commanders'));
  app.mount(run({ paths: './test/mocks/commanders' }));
  await expect(app.run('cron:any')).rejects.toThrowError();
});
