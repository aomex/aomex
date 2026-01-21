import { expect, test } from 'vitest';
import { Task } from '../../src/lib/task';
import { Cron } from '../../src/lib/cron';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeFileSync } from 'fs';
import { sleep } from '@aomex/internal-tools';

test('并发达上限', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 4,
    waitingTimeout: 2_000,
  });
  const task1 = new Task(cron, 10000, 20000);
  const task2 = new Task(cron, 20000, 30000);
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeFalsy();
  await expect(task1.win()).resolves.toBeFalsy();
});

test('任务结束后可补充排队中的任务', { timeout: 20_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 2,
    waitingTimeout: 3_000,
  });

  const task1 = new Task(cron, 10_000, 20_000);
  const task2 = new Task(cron, 10_000, 20_000);
  const task3 = new Task(cron, 10_000, 20_000);
  const task4 = new Task(cron, 10_000, 20_000);
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeTruthy();
  const pong = task1.ping();
  await sleep(3_000);
  const result = task3.win();
  pong();
  await expect(result).resolves.toBeTruthy();
  await expect(task4.win()).resolves.toBeFalsy();
  await expect(task1.win()).resolves.toBeFalsy();
});

test('任务结束后，如果还在排队期间，则仍占用名额', { timeout: 20_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 2,
    waitingTimeout: 3_000,
  });

  const task1 = new Task(cron, 10_000, 20_000);
  const task2 = new Task(cron, 10_000, 20_000);
  const task3 = new Task(cron, 10_000, 20_000);
  const task4 = new Task(cron, 10_000, 20_000);
  await expect(task1.win()).resolves.toBeTruthy();
  await expect(task2.win()).resolves.toBeTruthy();
  const pong = task1.ping();
  const result = task3.win();
  pong();
  await expect(result).resolves.toBeFalsy();
  await sleep(2_000);
  await expect(task4.win()).resolves.toBeTruthy();
  await expect(task1.win()).resolves.toBeFalsy();
});

test('排队中的任务超时后被放弃', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 1,
    waitingTimeout: 4_000,
  });

  const task1 = new Task(cron, 10000, 20000);
  const task2 = new Task(cron, 20000, 30000);

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
    waitingTimeout: 40_000,
  });

  const task1 = new Task(cron, 10000, 20000);
  const task2 = new Task(cron, 20000, 30000);

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
  cron['_tasks'].add(task);
  // @ts-expect-error
  task.filePath = file;
  // @ts-expect-error
  task.execArgv = ['--no-warnings'];
  const promise = task.runChildProcess();
  expect(task.pid).toMatch(/\d+/);
  expect(cron.getPIDs()).toHaveLength(1);
  expect(cron.getPIDs().every((pid) => /^\d+$/.test(pid)));

  await promise;
  expect(cron.getPIDs()).toHaveLength(0);
});
