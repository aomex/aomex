import '../../src';
import { ConsoleApp, terminal } from '@aomex/console';
import { middleware } from '@aomex/common';
import { beforeEach, expect, test, vitest } from 'vitest';
import { dirname, join } from 'path';
import { stats } from '../../src/middleware/stats.middleware';
import { createServer } from 'net';
import type { ServerWriteData } from '../../src';
import sleep from 'sleep-promise';
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
    mount: [stats({ commanders: '', port })],
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
          runners: [{ pid: '12345', command: 'foo:bar -t', schedule: '* * * * *' }],
        } satisfies ServerWriteData) +
          '\n' +
          JSON.stringify({
            runners: [{ pid: '12345', command: 'foo:bar -t', schedule: '* * * * *' }],
          } satisfies ServerWriteData) +
          '\n' +
          JSON.stringify({
            runners: [],
          } satisfies ServerWriteData) +
          '\n' +
          JSON.stringify({
            runners: [{ pid: '12345', command: 'foo:bar -t', schedule: '* * * * *' }],
          } satisfies ServerWriteData) +
          '\n',
      );
    });
    await sleep(2000);
    socket.destroy();
  });

  server.listen(port);

  const app = new ConsoleApp({
    mount: [stats({ commanders: '', port })],
  });
  let outputs: string[] = [];
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation((str) => {
    outputs.push(str.toString());
    return true;
  });
  app.run('cron:stats');
  await sleep(2000);
  await new Promise((resolve) => server.close(resolve));

  expect(terminal.stripStyle(outputs.join(''))).toContain(
    '12345     foo:bar -t                * * * * *     0.00%     0B         00:00',
  );

  spy.mockRestore();
});

test('无效指令继续往后执行', { timeout: 9_000 }, async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: [
      stats({
        commanders: join(testDir, '..', 'package.json'),
        port,
      }),
      middleware.console(spy),
    ],
  });
  await app.run('cron:stats');
  expect(spy).toHaveBeenCalledTimes(0);

  await app.run('cron:stats123');
  expect(spy).toHaveBeenCalledTimes(1);
});

test('监听了无效的端口', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: [stats({ commanders: '', port })],
  });
  const spy = vitest.spyOn(terminal, 'printWarning');
  await expect(app.run('cron:stats')).resolves.toBe(0);
  expect(spy).toHaveBeenCalledWith(`定时任务未启动，端口：${port}`);

  spy.mockRestore();
});
