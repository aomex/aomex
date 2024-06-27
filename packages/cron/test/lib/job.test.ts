import { expect, test, vitest } from 'vitest';
import { Job } from '../../src/lib/job';
import { ScheduleParser } from '../../src/lib/schedule-parser';
import { sleep } from '@aomex/internal-tools';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeFileSync } from 'fs';

test('start后可以通过stop退出', async () => {
  const job = new Job(
    new ScheduleParser({
      path: '',
      command: '',
      time: '* * * * *',
    }),
  );
  const spy = vitest.fn();
  const promise = job.start().then(spy);
  await sleep(1000);
  expect(spy).toBeCalledTimes(0);
  job.stop();
  await promise;
});

test('没有下一个任务时自动结束', async () => {
  const job = new Job(
    new ScheduleParser({
      path: '',
      command: '',
      time: '* * * * *',
    }),
  );
  vitest.spyOn(job.cronExpression, 'hasNext').mockImplementation(() => false);
  await job.start();
});

test('overlap=false 时，必须等到上一次执行完毕', async () => {
  const job = new Job(new ScheduleParser({ path: '', command: '', overlap: false }));
  await expect(job.win('1')).resolves.toBeTruthy();
  await expect(job.win('2')).resolves.toBeFalsy();

  await job.done('1');
  await expect(job.win('2')).resolves.toBeTruthy();
});

test('overlap=true 时，可以与上一次任务并行', async () => {
  const job = new Job(new ScheduleParser({ path: '', command: '', overlap: true }));
  await expect(job.win('1')).resolves.toBeTruthy();
  await expect(job.win('2')).resolves.toBeTruthy();
});

test('overlap=false && concurrent>1 时，必须等到上一次全部执行完毕', async () => {
  const job = new Job(
    new ScheduleParser({ path: '', command: '', overlap: false, concurrent: 2 }),
  );
  await expect(job.win('1')).resolves.toBeTruthy();
  await expect(job.win('1')).resolves.toBeTruthy();
  await expect(job.win('2')).resolves.toBeFalsy();

  await job.done('1');
  await expect(job.win('2')).resolves.toBeFalsy();
  await job.done('1');
  await expect(job.win('2')).resolves.toBeTruthy();
});

test('执行并发限制', async () => {
  const job = new Job(
    new ScheduleParser({ path: '', command: '', overlap: false, concurrent: 2 }),
  );
  const result = await Promise.all([
    job.win('1'),
    job.win('1'),
    job.win('1'),
    job.win('1'),
    job.win('1'),
  ]);
  expect(result.sort()).toStrictEqual([false, false, false, true, true]);
});

test('并发达上限后，即使完成任务也不影响并发限制', async () => {
  const job = new Job(
    new ScheduleParser({ path: '', command: '', overlap: false, concurrent: 2 }),
  );
  await expect(job.win('1')).resolves.toBeTruthy();
  await expect(job.win('1')).resolves.toBeTruthy();
  await job.done('1');
  await job.done('1');
  await expect(job.win('1')).resolves.toBeFalsy();
});

test('消费时winner增加runningLevel', async () => {
  const job = new Job(new ScheduleParser({ path: '', command: '', concurrent: 2 }));
  const spy = vitest.spyOn(job, 'runChildProcess').mockImplementation(async () => {
    await sleep(200);
  });
  expect(job.runningLevel).toBe(0);
  const p1 = job.consume(1);
  expect(job.runningLevel).toBe(1);
  await sleep(50);
  spy.mockImplementation(async () => {
    await sleep(500);
    return 0;
  });
  const p2 = job.consume(1);
  expect(job.runningLevel).toBe(2);
  await sleep(50);
  expect(job.runningLevel).toBe(2);
  await p1;
  expect(job.runningLevel).toBe(1);
  await p2;
  expect(job.runningLevel).toBe(0);
});

test('消费结束后，调用done方法', async () => {
  const job = new Job(new ScheduleParser({ path: '', command: '' }));
  vitest.spyOn(job, 'runChildProcess').mockImplementation(async () => {});

  const spyTimer = vitest.spyOn(globalThis, 'clearInterval');
  const spyDone = vitest.spyOn(job, 'done');
  await job.consume(1);
  expect(spyTimer).toBeCalledTimes(1);
  expect(spyDone).toBeCalledTimes(1);
});

test('使用子进程执行任务', async () => {
  let str = '';
  const spy = vitest.spyOn(process.stdout, 'write').mockImplementation((msg) => {
    str += msg.toString();
    return true;
  });
  const file = join(tmpdir(), 'bin_' + Date.now() + Math.random() + '.mjs');
  writeFileSync(
    file,
    `
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    console.log('=from-entry=', process.execArgv, process.argv.slice(2), process.cwd());
    `,
  );

  let job = new Job(
    new ScheduleParser({
      path: '',
      command: 'foo:bar',
      args: ['--data1', 'abc', '-t', '-m'],
    }),
  );
  job.processData.filePath = file;
  job.processData.execArgv = ['--no-warnings'];
  await job.runChildProcess();
  expect(str).toMatchInlineSnapshot(`
    "=from-entry= [ '--no-warnings' ] [ 'foo:bar', '--data1', 'abc', '-t', '-m' ] ${process.cwd()}
    "
  `);

  spy.mockRestore();
});

test('子进程抛出异常不影响主任务', async () => {
  let str = '';
  const spy = vitest.spyOn(process.stderr, 'write').mockImplementation((msg) => {
    str += msg.toString();
    return true;
  });
  const file = join(tmpdir(), 'bin_' + Date.now() + Math.random() + '.mjs');
  writeFileSync(file, 'throw new Error("abcde")');

  let job = new Job(new ScheduleParser({ path: '', command: 'foo:bar' }));
  job.processData.filePath = file;
  await job.runChildProcess();
  expect(str).toMatch('Error: abcde');

  spy.mockRestore();
});

test('执行时记录pid', async () => {
  const file = join(tmpdir(), 'bin_' + Date.now() + Math.random() + '.mjs');
  writeFileSync(
    file,
    `
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    `,
  );

  let job = new Job(new ScheduleParser({ path: '', command: 'foo:bar' }));
  job.processData.filePath = file;
  job.processData.execArgv = ['--no-warnings'];
  const promise1 = job.runChildProcess();
  expect(job.getPIDs()).toHaveLength(1);
  const promise2 = job.runChildProcess();
  expect(job.getPIDs()).toHaveLength(2);
  expect(job.getPIDs().every((pid) => /^\d+$/.test(pid)));

  await promise1;
  await promise2;
  expect(job.getPIDs()).toHaveLength(0);
});
