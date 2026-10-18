import { expect, test } from 'vitest';
import { Task } from '../../src/lib/task';
import { Cron } from '../../src/lib/cron';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeFileSync } from 'fs';
import { sleep } from '@aomex/internal-tools';
import { TELL_CHILD_STOP } from '../../src/lib/constant';

type WinResult = Awaited<ReturnType<Task['win']>>;

function expectWon(result: WinResult): Extract<WinResult, { slot: string }> {
  expect(result).not.toBe('lose');
  expect(result).toEqual(
    expect.objectContaining({
      slot: expect.any(String),
      token: expect.any(String),
    }),
  );
  return result as Extract<WinResult, { slot: string }>;
}

test('并发达上限', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 4,
    waitingTimeout: 0,
  });
  const task1 = new Task(cron, 10000, 20000);
  const task2 = new Task(cron, 20000, 30000);
  expectWon(await task1.win());
  expectWon(await task1.win());
  expectWon(await task1.win());
  expectWon(await task2.win());
  await expect(task2.win()).resolves.toBe('lose');
  await expect(task1.win()).resolves.toBe('lose');
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
  const won1 = expectWon(await task1.win());
  expectWon(await task2.win());
  const pong = task1.ping(won1.slot, won1.token);
  await sleep(3_000);
  const result = task3.win();
  await pong();
  expectWon(await result);
  await expect(task4.win()).resolves.toBe('lose');
  await expect(task1.win()).resolves.toBe('lose');
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
  const won1 = expectWon(await task1.win());
  expectWon(await task2.win());
  const pong = task1.ping(won1.slot, won1.token);
  const result = task3.win();
  await pong();
  await expect(result).resolves.toBe('lose');
  await sleep(2_000);
  expectWon(await task4.win());
  await expect(task1.win()).resolves.toBe('lose');
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

  const won1 = expectWon(await task1.win());
  const result = task2.win();
  const pong = task1.ping(won1.slot, won1.token);
  await sleep(4_500);
  await pong();
  await expect(result).resolves.toBe('lose');
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

  expectWon(await task1.win());
  const result = task2.win();
  await sleep(2000);
  cron.stop();
  await expect(result).resolves.toBe('lose');
});

test('无限并发', { timeout: 15_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: Infinity,
  });
  const task = new Task(cron, 1, 2);
  const total = 100;
  const result = await Promise.all(new Array(total).fill('').map(() => task.win()));
  expect(result.every((item) => item !== 'lose')).toBeTruthy();
  expect(new Set(result.map((item) => (item === 'lose' ? '' : item.slot))).size).toBe(
    total,
  );
});

test('只释放属于自己的slot', { timeout: 10_000 }, async () => {
  const cron = new Cron({
    commanders: '',
    command: '',
    concurrent: 1,
    waitingTimeout: 0,
  });
  const task1 = new Task(cron, 10_000, 20_000);
  const task2 = new Task(cron, 10_000, 20_000);

  const won1 = expectWon(await task1.win());
  const pong1 = task1.ping(won1.slot, won1.token);

  // 模拟租约被别人抢走
  await cron.cache.set(won1.slot, 'other-token', 900_000);
  await pong1();

  // 别人的 token 不应被 pong 删掉，因此仍然占着名额
  await expect(task2.win()).resolves.toBe('lose');
  expect(await cron.cache.get(won1.slot)).toBe('other-token');
});

test('slot被抢后先通知子进程停止', { timeout: 20_000 }, async () => {
  const file = join(tmpdir(), 'bin_' + Date.now() + Math.random() + '.mjs');
  writeFileSync(
    file,
    `
    await new Promise((resolve) => {
      setTimeout(resolve, 60_000);
    });
    `,
  );

  const cron = new Cron({
    commanders: '',
    command: 'foo:bar',
    concurrent: 1,
    waitingTimeout: 0,
  });
  const task = new Task(cron, 1, 2);
  // @ts-expect-error
  task.filePath = file;
  // @ts-expect-error
  task.execArgv = ['--no-warnings'];

  const won = expectWon(await task.win());
  const pong = task.ping(won.slot, won.token);
  const running = task.runChildProcess();

  await sleep(200);
  expect(task.child).not.toBeNull();

  const messages: string[] = [];
  const child = task.child!;
  const send = child.send.bind(child);
  child.send = ((message: string, ...args: any[]) => {
    messages.push(message);
    return send(message, ...args);
  }) as typeof child.send;

  await cron.cache.set(won.slot, 'stolen-token', 900_000);

  // ping 默认 10s 探测一次；此处只断言会先发 STOP，不等 20s 的延迟 kill
  await sleep(11_000);
  expect(messages).toContain(TELL_CHILD_STOP);
  expect(task.child).not.toBeNull();

  child.kill();
  await running;
  await pong();
  expect(task.child).toBeNull();
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
