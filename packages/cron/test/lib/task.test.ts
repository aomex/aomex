import { describe, expect, test } from 'vitest';
import { Task } from '../../src/lib/task';
import { Cron } from '../../src/lib/cron';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeFileSync } from 'fs';
import { sleep } from '@aomex/internal-tools';

test('并发达上限后，同一时间点任务不能再触发', async () => {
  const cron = new Cron({ commanders: '', command: '', concurrent: 2 });
  const task = new Task(cron, 1);
  await expect(task.win()).resolves.toBeTruthy();
  await expect(task.win()).resolves.toBeTruthy();
  await expect(task.win()).resolves.toBeFalsy();
});

test('无限并发', { timeout: 12_000 }, async () => {
  const cron = new Cron({ commanders: '', command: '', concurrent: Infinity });
  const task = new Task(cron, 1);
  const result = await Promise.all(new Array(1000).fill('').map(() => task.win()));
  expect([...new Set(result)]).toStrictEqual([true]);
});

describe('重叠', () => {
  test('[overlap=true] 当前任务无需等待上一次任务结束', { timeout: 12_000 }, async () => {
    const cron = new Cron({ commanders: '', command: '', overlap: true });
    const task = new Task(cron, 1);

    await expect(task.win()).resolves.toBeTruthy();
    await expect(task.win()).resolves.toBeFalsy();

    const task1 = new Task(cron, 2);
    await expect(task1.win()).resolves.toBeTruthy();
    await expect(task1.win()).resolves.toBeFalsy();
  });

  test(
    '[overlap=false] 上一次任务未执行完，当前任务无效',
    { timeout: 12_000 },
    async () => {
      const cron = new Cron({ commanders: '', command: '' });
      const task = new Task(cron, 1);

      await expect(task.win()).resolves.toBeTruthy();
      await expect(task.win()).resolves.toBeFalsy();

      const task1 = new Task(cron, 2);
      await expect(task1.win()).resolves.toBeFalsy();
    },
  );

  test(
    '[overlap=false] 上一次任务已经执行完，当前任务立即执行',
    { timeout: 12_000 },
    async () => {
      const cron = new Cron({ commanders: '', command: '', concurrent: 2 });
      const task1_0 = new Task(cron, 1);
      const task1_1 = new Task(cron, 1);

      await expect(task1_0.win()).resolves.toBeTruthy();
      await expect(task1_1.win()).resolves.toBeTruthy();
      await expect(task1_0.win()).resolves.toBeFalsy();
      await expect(task1_1.win()).resolves.toBeFalsy();

      const task2 = new Task(cron, 2);
      await expect(task2.win()).resolves.toBeFalsy();

      await task1_0.ping()();
      await expect(task2.win()).resolves.toBeFalsy();

      await task1_1.ping()();
      await expect(task2.win()).resolves.toBeTruthy();
    },
  );

  test('[overlap=false] 允许等待上一次任务执行完', { timeout: 12_000 }, async () => {
    const cron = new Cron({
      commanders: '',
      command: '',
      overlap: false,
      waitingTimeout: 4_000,
    });
    const task_1 = new Task(cron, 1);
    const task_2 = new Task(cron, 2);

    await expect(task_1.win()).resolves.toBeTruthy();
    const pong = task_1.ping();
    const startTime = Date.now();
    await expect(task_2.win()).resolves.toBeFalsy();
    expect(Date.now() - startTime).to.greaterThan(4_000);

    const promise = task_2.win();
    await sleep(2000);
    await pong();
    await expect(promise).resolves.toBeTruthy();
  });
});

test('执行时记录pid', { timeout: 12_000 }, async () => {
  const file = join(tmpdir(), 'bin_' + Date.now() + Math.random() + '.mjs');
  writeFileSync(
    file,
    `
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    `,
  );

  const cron = new Cron({ commanders: '', command: 'foo:bar' });
  const task = new Task(cron, 1);
  // @ts-expect-error
  task.filePath = file;
  // @ts-expect-error
  task.execArgv = ['--no-warnings'];
  const promise1 = task.runChildProcess();
  expect(cron.getPIDs()).toHaveLength(1);
  const promise2 = task.runChildProcess();
  expect(cron.getPIDs()).toHaveLength(2);
  expect(cron.getPIDs().every((pid) => /^\d+$/.test(pid)));

  await promise1;
  await promise2;
  expect(cron.getPIDs()).toHaveLength(0);
});
