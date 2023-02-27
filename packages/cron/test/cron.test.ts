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

test('output schedule:* help information', async () => {
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
  await app.run('schedule:run', '-h');
  expect(msg).toMatchSnapshot();
  await app.run('schedule:export', '-h');
  expect(msg).toMatchSnapshot();
});
