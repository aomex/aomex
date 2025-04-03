import { expect, test } from 'vitest';
import { Task } from '../../src/lib/task';
import { Cron } from '../../src/lib/cron';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeFileSync } from 'fs';
import { sleep } from '@aomex/internal-tools';

test('并发达上限后，多余的servers不能触发任务', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 4,
    serves: Infinity,
    waitingTimeout: 2_000,
  });
  const task1 = new Task(cron, 1, 2);
  const task2 = new Task(cron, 2, 3);
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeFalsy();
  await expect(task1.win()).resolves.toBeFalsy();
});

test('servers多于并发数部分无法触发任务', async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: Infinity,
    serves: 3,
    waitingTimeout: 3_000,
  });
  const task = new Task(cron, 1, 2);
  await expect(task.win()).resolves.toBeTruthy();
  await expect(task.win()).resolves.toBeTruthy();
  await expect(task.win()).resolves.toBeTruthy();
  await expect(task.win()).resolves.toBeFalsy();
  await expect(task.win()).resolves.toBeFalsy();
});

test('任务结束后可补充排队中的任务', { timeout: 20_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 2,
    serves: Infinity,
    waitingTimeout: 5_000,
  });

  const task1 = new Task(cron, 1, 2);
  const task2 = new Task(cron, 2, 3);
  const task3 = new Task(cron, 3, 4);
  const task4 = new Task(cron, 4, 5);
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeTruthy();
  const result = task3.win();
  await task1.ping()();
  await expect(result).resolves.toBeTruthy();
  await expect(task4.win()).resolves.toBeFalsy();
  await expect(task1.win()).resolves.toBeFalsy();
});

test('排队中的任务超时后被放弃', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 1,
    serves: Infinity,
    waitingTimeout: 4_000,
  });

  const task1 = new Task(cron, 1, 2);
  const task2 = new Task(cron, 2, 3);

  await expect(task1.win()).resolves.toBeTruthy();
  const result = task2.win();
  const pong = task1.ping();
  await sleep(4_500);
  await pong();
  await expect(result).resolves.toBeFalsy();
});

test('排队中的任务在遇到cron:stop后需放弃排队', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 1,
    serves: Infinity,
    waitingTimeout: 40_000,
  });

  const task1 = new Task(cron, 1, 2);
  const task2 = new Task(cron, 2, 3);

  await expect(task1.win()).resolves.toBeTruthy();
  const result = task2.win();
  await sleep(2000);
  cron.stop();
  await expect(result).resolves.toBeFalsy();
});

test('无限并发', { timeout: 12_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    serves: Infinity,
    concurrent: Infinity,
  });
  const task = new Task(cron, 1, 2);
  const result = await Promise.all(new Array(1000).fill('').map(() => task.win()));
  expect([...new Set(result)]).toStrictEqual([true]);
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
  const task = new Task(cron, 1, 2);
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
