import { ConsoleApp } from '@aomex/console';
import { sleep } from '@aomex/utility';
import { test } from 'vitest';
import { Job } from '../../src/lib/job';

const app = new ConsoleApp();

test('execute', async () => {
  const spy = vitest.spyOn(app, 'run');
  spy.mockImplementation(async () => sleep(10));
  const job = new Job(
    app,
    '* * * * *',
    [],
    ['test:schedule', '--hello', 'world'],
  );

  job.execute();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith('test:schedule', '--hello', 'world');

  job.execute();
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith('test:schedule', '--hello', 'world');

  spy.mockRestore();
});

test('executeWithoutOverlapping', () => {
  const job = new Job(app, '* * * * *', [], ['x'], 'one-by-one');
  const spy = vitest.spyOn(job, 'execute');
  spy.mockImplementation(async () => {});
  const spy1 = vitest.spyOn(job, 'executeWithoutOverlapping');

  ++job.queue;
  job.executeWithoutOverlapping();
  expect(spy).toBeCalledTimes(1);
  expect(spy1).toBeCalledTimes(1);

  ++job.queue;
  job.executeWithoutOverlapping();
  expect(job.queue).toBe(1);
  expect(spy).toBeCalledTimes(1);
  expect(spy1).toBeCalledTimes(2);

  ++job.queue;
  job.executeWithoutOverlapping();
  expect(job.queue).toBe(2);
  expect(spy).toBeCalledTimes(1);
  expect(spy1).toBeCalledTimes(3);

  spy.mockRestore();
  spy1.mockRestore();
});

test('[mode=overlap] emit will switch to execute()', () => {
  const job = new Job(app, '* * * * *', [], ['x']);
  const spy = vitest.spyOn(job, 'execute');
  spy.mockImplementation(async () => {});
  const spy1 = vitest.spyOn(job, 'executeWithoutOverlapping');
  job.emit();
  expect(spy).toBeCalledTimes(1);
  expect(spy1).toBeCalledTimes(0);
  spy.mockRestore();
  spy1.mockRestore();
});

test('[mode=sequence] emit will switch to executeWithoutOverlapping()', () => {
  const job = new Job(app, '* * * * *', [], ['x'], 'one-by-one');
  const spy = vitest.spyOn(job, 'execute');
  spy.mockImplementation(async () => {});
  const spy1 = vitest.spyOn(job, 'executeWithoutOverlapping');
  job.emit();
  expect(spy).toBeCalledTimes(1);
  expect(spy1).toBeCalledTimes(1);
  spy.mockRestore();
  spy1.mockRestore();
});

test('current minute will not trigger job', () => {
  const job = new Job(app, '* * * * *', [], ['x']);
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  const nextMinute = now.getMinutes();
  expect(job.getCronHandle().next().getMinutes()).toBe(nextMinute);
});

test('minus 1 minute to against schedules with second', () => {
  const job = new Job(app, '* * * * *', [1, 2], ['x']);
  const currentMinute = new Date().getMinutes();
  expect(job.getCronHandle().next().getMinutes()).toBe(currentMinute);
});

test('[mode=overlap] start a job', async () => {
  vitest.spyOn(app, 'run').mockImplementation(async () => {});
  const spy = vitest.spyOn(Job.prototype, 'emit');

  const job = new Job(
    app,
    '* * * * * *',
    [],
    ['test:job1', '--hello', 'world'],
  );
  job.start();
  await sleep(2000);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
