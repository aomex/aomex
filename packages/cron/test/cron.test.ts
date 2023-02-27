import { ConsoleApp } from '@aomex/console';
import { SpyInstance, test } from 'vitest';
import { cron } from '../src';

let spy: SpyInstance;

beforeAll(() => {
  spy = vitest.spyOn(console, 'log');
});

beforeEach(() => {
  spy.mockReset();
});

afterAll(() => {
  spy.mockRestore();
});

test('output cron:* help information', async () => {
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
  expect(msg).toMatchSnapshot();
  await app.run('cron:start', '-h');
  expect(msg).toMatchSnapshot();
  await app.run('cron:export', '-h');
  expect(msg).toMatchSnapshot();
});
