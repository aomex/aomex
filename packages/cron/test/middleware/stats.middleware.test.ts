import '../../src';
import { ConsoleApp } from '@aomex/console';
import { mdchain, middleware } from '@aomex/core';
import { beforeEach, expect, test, vitest } from 'vitest';
import { dirname, join } from 'path';
import { stats } from '../../src/middleware/stats.middleware';
import { createServer } from 'net';
import type { ServerWriteData } from '../../src';
import Spinnies from 'spinnies';
import { sleep } from '@aomex/internal-tools';
import { styleText } from 'util';
import { getPort } from '../mock/get-port';

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
    mount: mdchain.console.mount(stats({ path: '', port })),
  });
  const code = await app.run('cron:stats');
  await new Promise((resolve) => server.close(resolve));
  expect(code).toBe(0);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith('cron:stats');
});

test('接收消息', { timeout: 9_000 }, async () => {
  const server = createServer(async (socket) => {
    socket.on('data', () => {
      socket.write(
        JSON.stringify({
          runners: [{ pid: '12345', argv: ['foo:bar', '-t'] }],
        } as ServerWriteData) +
          '\n' +
          JSON.stringify({
            runners: [{ pid: '12345', argv: ['foo:bar', '-t'] }],
          } as ServerWriteData) +
          '\n' +
          JSON.stringify({
            runners: [],
          } as ServerWriteData) +
          '\n' +
          JSON.stringify({
            runners: [{ pid: '12345', argv: ['foo:bar', '-t'] }],
          } as ServerWriteData) +
          '\n',
      );
    });
    await sleep(2000);
    socket.destroy();
  });

  server.listen(port);

  const app = new ConsoleApp({
    mount: mdchain.console.mount(stats({ path: '', port })),
  });
  const spy1 = vitest.spyOn(Spinnies.prototype, 'add');
  const spy2 = vitest.spyOn(Spinnies.prototype, 'update');
  app.run('cron:stats');
  await sleep(2000);
  await new Promise((resolve) => server.close(resolve));

  expect(spy1).toHaveBeenCalledWith('pid-12345', {
    status: 'non-spinnable',
    text: 'foo:bar -t (cpu: 0%, memory: 0B, time: 0s, pid: 12345)',
  });
  expect(spy2).toHaveBeenCalledWith('pid-12345', {
    status: 'non-spinnable',
    text: 'foo:bar -t (cpu: 0%, memory: 0B, time: 0s, pid: 12345)',
  });

  spy1.mockRestore();
  spy2.mockRestore();
});

test('无效指令继续往后执行', { timeout: 9_000 }, async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: mdchain.console
      .mount(
        stats({
          path: join(testDir, '..', 'package.json'),
          port,
        }),
      )
      .mount(middleware.console(spy)),
  });
  await app.run('cron:stats');
  expect(spy).toHaveBeenCalledTimes(0);

  await app.run('cron:stats123');
  expect(spy).toHaveBeenCalledTimes(1);
});

test('监听了无效的端口', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: mdchain.console.mount(stats({ path: '', port })),
  });
  const spy = vitest.spyOn(console, 'warn');
  await expect(app.run('cron:stats')).resolves.toBe(0);
  expect(spy).toHaveBeenCalledWith(styleText('yellow', `定时任务未启动，端口：${port}`));

  spy.mockRestore();
});
