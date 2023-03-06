import { ConsoleApp } from '@aomex/console';
import stripAnsi from 'strip-ansi';
import { cron } from '../../src';

test('output cron:* help information', async () => {
  const spy = vitest.spyOn(console, 'log');
  let msg = '';
  spy.mockImplementation((_) => {
    msg = _;
  });

  const app = new ConsoleApp();
  app.mount(
    cron({
      paths: [],
    }),
  );

  await app.run('-h');
  expect(stripAnsi(msg)).toMatchSnapshot();
  await app.run('cron:start', '-h');
  expect(msg).toMatchSnapshot();
  await app.run('cron:export', '-h');
  expect(msg).toMatchSnapshot();

  spy.mockRestore();
});
