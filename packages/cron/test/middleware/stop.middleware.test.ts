import '../../src';
import { ConsoleApp } from '@aomex/console';
import { mdchain, middleware } from '@aomex/core';
import { beforeEach, expect, test, vitest } from 'vitest';
import { dirname, join } from 'path';
import { stop } from '../../src/middleware/stop.middleware';
import { createServer } from 'net';
import { getPort } from '../mock/get-port';
import { styleText } from 'util';

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
    mount: mdchain.console.mount(stop({ path: '', port })),
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
    mount: mdchain.console
      .mount(
        stop({
          path: join(testDir, '..', 'package.json'),
          port,
        }),
      )
      .mount(middleware.console(spy)),
  });
  await app.run('cron:stop');
  expect(spy).toHaveBeenCalledTimes(0);

  await app.run('cron:stop123');
  expect(spy).toHaveBeenCalledTimes(1);
});

test('监听了无效的端口', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: mdchain.console.mount(stop({ path: '', port })),
  });
  const spy = vitest.spyOn(console, 'warn');
  await expect(app.run('cron:stop')).resolves.toBe(0);
  expect(spy).toHaveBeenCalledWith(styleText('yellow', `定时任务未启动，端口：${port}`));

  spy.mockRestore();
});
