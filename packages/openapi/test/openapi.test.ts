import { afterEach, expect, test, vitest } from 'vitest';
import { openapi } from '../src';
import { ConsoleApp, ConsoleMiddleware } from '@aomex/console';
import { middleware } from '@aomex/core';
import { join } from 'path';
import { tmpdir } from 'os';
import { readFileSync, rmSync } from 'fs';

afterEach(async () => {
  try {
    rmSync('openapi.json');
  } catch {}
});

test('中间件', async () => {
  expect(openapi({ routers: [] })).toBeInstanceOf(ConsoleMiddleware);
});

test('执行指令', async () => {
  const file = join(tmpdir(), Math.random() + Date.now() + 'openapi.json');

  const app = new ConsoleApp({
    mount: [openapi({ routers: [], saveToFile: file })],
  });

  const code = await app.run('openapi');
  expect(code).toBe(0);
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(
    `"{"openapi":"3.0.3","tags":[],"info":{"title":"aomex","version":"0.0.0"},"paths":{}}"`,
  );
});

test('未命中则继续执行中间件', async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: [openapi({ routers: [] }), middleware.console(spy)],
  });

  await app.run('openapi');
  expect(spy).toHaveBeenCalledTimes(0);

  const code = await app.run('openapio');
  expect(code).toBe(1);
  expect(spy).toHaveBeenCalledTimes(1);
});
