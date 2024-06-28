import { ConsoleApp } from '@aomex/console';
import { middleware } from '@aomex/core';
import { beforeEach, expect, test, vitest } from 'vitest';
import { start } from '../../src/middleware/start.middleware';
import { dirname, join } from 'path';
import { sleep } from '@aomex/internal-tools';
import { Job } from '../../src/lib/job';
import { createConnection } from 'net';
import { stop } from '../../src/middleware/stop.middleware';
import { getPort } from '../mock/get-port';

const testDir = dirname(import.meta.dirname);

let port: number;

beforeEach(() => {
  port = getPort();
});

test('无任务时自动结束', async () => {
  const app = new ConsoleApp({
    mount: [start({ path: join(testDir, 'mock', 'commanders', 'empty.cmd.ts'), port })],
  });
  await expect(app.run('cron:start')).resolves.toBe(0);
});

test('执行任务', async () => {
  const spy = vitest.spyOn(Job.prototype, 'start').mockImplementation(async () => {
    await sleep(1000);
  });
  const app = new ConsoleApp({
    mount: [start({ path: join(testDir, 'mock', 'commanders', 'start.cmd.ts'), port })],
  });
  const promise = app.run('cron:start');
  await sleep(500);
  expect(spy).toHaveBeenCalledTimes(1);
  await expect(promise).resolves.toBe(0);

  spy.mockRestore();
});

test('等待长任务完成后才能中断', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: [
      start({ path: join(testDir, 'mock', 'commanders', 'start-delay.cmd.ts'), port }),
    ],
  });
  const spy = vitest.spyOn(Job.prototype, 'start').mockImplementation(async function (
    this: Job,
  ) {
    this.runningLevel = 5;
    await sleep(5000);
    this.runningLevel = 0;
  });
  const promise = app.run('cron:start');
  await sleep(500);

  const client = createConnection({ port }, () => {
    client.write('cron:stop');
  });
  let str = '';
  await new Promise((resolve): void => {
    client.on('close', resolve);
    client.on('data', (data) => {
      str += data.toString();
    });
  });

  await expect(promise).resolves.toBe(0);
  expect(str).toMatchInlineSnapshot(`
    "{"list":["*/2 * * * * * aomex schedule:n","*/2 * * * * * aomex schedule:t"]}
    {"done":"*/2 * * * * * aomex schedule:n"}
    {"done":"*/2 * * * * * aomex schedule:t"}
    "
  `);

  spy.mockRestore();
});

test('使用监听获取正在执行的任务', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: [
      start({
        path: join(testDir, 'mock', 'commanders', 'start-delay.cmd.ts'),
        port,
      }),
    ],
  });

  const startSpy = vitest
    .spyOn(Job.prototype, 'start')
    .mockImplementation(() => sleep(3000));
  const getPIDSpy = vitest
    .spyOn(Job.prototype, 'getPIDs')
    .mockImplementation(() => ['1123']);
  const promise = app.run('cron:start');
  await sleep(500);

  const client = createConnection({ port }, () => {
    client.write('cron:stats');
  });

  let str = '';
  await new Promise((resolve): void => {
    client.on('close', resolve);
    client.on('data', (data) => {
      str += data.toString();
      client.destroy();
    });
  });

  await promise;
  expect(str).toMatchInlineSnapshot(`
    "{"runners":[{"pid":"1123","argv":["schedule:n"]},{"pid":"1123","argv":["schedule:t"]}]}
    "
  `);

  getPIDSpy.mockRestore();
  startSpy.mockRestore();
});

test('使用cron:stop结束任务', { timeout: 9_000 }, async () => {
  const app = new ConsoleApp({
    mount: [
      start({
        path: join(testDir, 'mock', 'commanders', 'start-delay.cmd.ts'),
        port,
      }),
      stop({ path: '', port }),
    ],
  });
  const spy = vitest
    .spyOn(Job.prototype, 'runChildProcess')
    .mockImplementation(async () => {
      await sleep(5000);
    });
  const promise = app.run('cron:start');
  await sleep(3000);

  await expect(app.run('cron:stop')).resolves.toBe(0);
  await expect(promise).resolves.toBe(0);

  spy.mockRestore();
});

test('不是cron:start指令则继续往后执行', async () => {
  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: [
      start({ path: join(testDir, 'mock', 'commanders', 'empty.cmd.ts'), port }),
      middleware.console(spy),
    ],
  });
  await app.run('cron:start');
  expect(spy).toHaveBeenCalledTimes(0);

  await app.run('cron:start123');
  expect(spy).toHaveBeenCalledTimes(1);
});
