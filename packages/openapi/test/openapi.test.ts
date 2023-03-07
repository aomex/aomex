import { ConsoleApp } from '@aomex/console';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import stripAnsi from 'strip-ansi';
import { openapi } from '../src';

const file = path.resolve('openapi.json');

beforeEach(async () => {
  try {
    await rm(file);
  } catch {}
});

afterEach(async () => {
  try {
    await rm(file);
  } catch {}
});

test('generate openapi from cli', async () => {
  const file = path.join(tmpdir(), Math.random().toString());
  const app = new ConsoleApp();
  app.mount(
    openapi({
      routers: './test/routers',
      output: file,
    }),
  );
  await app.run('openapi');

  expect(existsSync(file)).toBeTruthy();
});

test('log messages', async () => {
  const msgs: any[] = [];
  const spy = vitest
    .spyOn(process.stderr, 'write')
    .mockImplementation((value: any) => {
      msgs.push(stripAnsi(value.replace(/\n$/, '')));
      return true;
    });

  const app = new ConsoleApp();
  app.mount(
    openapi({
      docs: {
        openapi: '3.0.2',
      },
      routers: ['./test/routers'],
      renderWarnings: true,
    }),
  );
  await app.run('openapi');
  expect(msgs).toMatchSnapshot();

  spy.mockRestore();
});

test('customize command name', async () => {
  const app = new ConsoleApp();
  app.mount(
    openapi({
      commandName: 'closeapi',
      routers: [],
    }),
  );

  await expect(app.run('closeapi')).resolves.toBeUndefined();
});
