import '../../src';
import { ConsoleApp, terminal } from '@aomex/console';
import { middleware, sleep } from '@aomex/common';
import { beforeEach, expect, test, vitest } from 'vitest';
import { dirname, join } from 'path';
import { stop } from '../../src/middleware/stop.middleware';
import { createServer } from 'net';
import { getPort } from '../mock/get-port';
import { appForAlive } from '../mock/app-for-alive';
import { readFile, rm } from 'fs/promises';

const testDir = dirname(import.meta.dirname);

let port: number;

beforeEach(() => {
  port = getPort();
});

test('连接服务', async () => {
  const spy = vitest.fn();
  const server = createServer(async (socket) => {
    socket.on('data', (data) => {
      spy(data.toString());
      socket.end(() => {
        server.close();
      });
    });
  });

  server.listen(port);

  const app = new ConsoleApp({
    mount: [stop({ commanders: '', port })],
  });
  const code = await app.run('cron:stop');
  await new Promise((resolve) => server.close(resolve));
  expect(code).toBe(0);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith('cron:stop');
});

test('无效指令继续往后执行', { timeout: 9_000 }, async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: [
      stop({
        commanders: join(testDir, '..', 'package.json'),
        port,
      }),
      middleware.console(spy),
    ],
  });
  await app.run('cron:stop');
  expect(spy).toHaveBeenCalledTimes(0);

  await app.run('cron:stop123');
  expect(spy).toHaveBeenCalledTimes(1);
});

test('监听了无效的端口', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: [stop({ commanders: '', port })],
  });
  const spy = vitest.spyOn(terminal, 'printWarning');
  await expect(app.run('cron:stop')).resolves.toBe(0);
  expect(spy).toHaveBeenCalledWith(`定时任务未启动，端口：${port}`);

  spy.mockRestore();
});

test('配合isAlive()快速结束任务', { timeout: 10_000 }, async () => {
  const logFile = join(testDir, 'mock', 'commanders', 'alive.log');
  await rm(logFile, { force: true });
  process.execArgv = ['--import', 'tsx/esm'];
  process.argv[1] = join(testDir, 'mock', 'app-for-alive.ts');
  const promise = appForAlive.run('cron:start');
  await sleep(6000);
  await appForAlive.run('cron:stop');
  const code = await promise;
  expect(code).toBe(0);
  const content = await readFile(logFile, 'utf8');
  expect(content).toContain(
    'in loop;in loop;in loop;in loop;in loop;in loop;in loop;in loop;in loop;in loop;in loop;in loop;in loop;',
  );
  expect(content).toContain('exit loop;');
});
