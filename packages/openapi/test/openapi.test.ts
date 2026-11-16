import { TestConsoleApp } from '../../console/src/testing';
import { afterEach, expect, test, vitest } from 'vitest';
import { openapi } from '../src';
import { ConsoleMiddleware } from '@aomex/console';
import { middleware, rule, type OpenAPI } from '@aomex/common';
import { envelope, formatError } from '@aomex/web';
import { TestWebApp } from '../../web/src/testing';
import { join } from 'path';
import { tmpdir } from 'os';
import { readFileSync, rmSync } from 'fs';

const tempFiles: string[] = [];

afterEach(() => {
  try {
    rmSync('openapi.json');
  } catch {}
  for (const file of tempFiles.splice(0)) {
    try {
      rmSync(file);
    } catch {}
  }
});

test('中间件', async () => {
  expect(openapi({ routers: [] })).toBeInstanceOf(ConsoleMiddleware);
});

test('执行指令', async () => {
  const file = join(tmpdir(), Math.random() + Date.now() + 'openapi.json');
  tempFiles.push(file);

  const app = new TestConsoleApp({
    mount: [openapi({ routers: [], saveToFile: file })],
  });

  const code = await app.run('openapi');
  expect(code).toBe(0);
  expect(readFileSync(file, 'utf8')).toMatchInlineSnapshot(
    `"{"openapi":"3.0.3","tags":[],"info":{"title":"@aomex/openapi","version":"3.30.7"},"paths":{}}"`,
  );
});

test('CLI 传入 app 时读取 mount 与 envelope', async () => {
  const file = join(tmpdir(), `cli-envelope-${Date.now()}.json`);
  tempFiles.push(file);

  const webApp = new TestWebApp({
    envelope: {
      description: '统一响应体套壳',
      content: {
        success: envelope.success,
        statusCode: envelope.statusCode,
        data: envelope.payload,
      },
    },
    mount: [
      formatError({
        content: { code: rule.string(), message: rule.string() },
        handler(err) {
          return { code: err.code ?? 'ERR', message: err.message };
        },
      }),
    ],
  });

  const cli = new TestConsoleApp({
    mount: [
      openapi({
        routers: join(import.meta.dirname, 'fixtures', 'routers', 'a.router.ts'),
        app: webApp,
        saveToFile: file,
      }),
    ],
  });

  const code = await cli.run('openapi');
  expect(code).toBe(0);

  const doc = JSON.parse(readFileSync(file, 'utf8')) as OpenAPI.Document;
  const method = doc.paths['/foo']!.get!;
  expect(Object.keys(method.responses!).sort()).toEqual(['200']);
  expect(method.responses!['200']).toMatchObject({
    description: '统一响应体套壳',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            {
              properties: {
                success: { type: 'boolean', enum: [true] },
              },
            },
            {
              properties: {
                success: { type: 'boolean', enum: [false] },
                data: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          ],
        },
      },
    },
  });
});

test('未命中则继续执行中间件', async () => {
  const spy = vitest.fn();
  const app = new TestConsoleApp({
    mount: [openapi({ routers: [] }), middleware.console(spy)],
  });

  await app.run('openapi');
  expect(spy).toHaveBeenCalledTimes(0);

  const code = await app.run('openapio');
  expect(code).toBe(1);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('自定义指令名称', async () => {
  const app = new TestConsoleApp({
    mount: [openapi({ commandName: 'openapi:admin', routers: [] })],
  });

  await expect(app.run('openapi')).resolves.toBe(1);
  await expect(app.run('openapi:user')).resolves.toBe(1);
  await expect(app.run('openapi:admin')).resolves.toBe(0);
});
