import { ConsoleApp } from '@aomex/console';
import { sleep } from '@aomex/utility';
import { test } from 'vitest';
import { CronJob } from '../src/cron-job';

const app = new ConsoleApp();
const spy = vitest.spyOn(app, 'run');
spy.mockImplementation(async () => sleep(10));

beforeEach(() => {
  spy.mockReset();
});

const defaultSchedule = {
  time: '* * * * *',
  seconds: [],
  args: [],
  command: 'x',
};

test('mode=sequence', () => {
  const job = new CronJob(app, defaultSchedule, 'sequence');
  const spy = vitest.spyOn(job, 'sequenceLoop');
  job.start();
  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});

test('mode=overlap', () => {
  const job = new CronJob(app, defaultSchedule);
  const spy = vitest.spyOn(job, 'sequenceLoop');
  job.start();
  expect(spy).toHaveBeenCalledTimes(0);
  spy.mockRestore();
});

test('mode=overlap will switch execute()', () => {
  const job = new CronJob(app, defaultSchedule);
  const spy = vitest.spyOn(job, 'execute');
  job.executeOrQueue();
  expect(job.queue).toBe(0);
  expect(spy).toBeCalledTimes(1);
});

test('mode=sequence will switch queue', () => {
  const job = new CronJob(app, defaultSchedule, 'sequence');
  const spy = vitest.spyOn(job, 'execute');
  job.executeOrQueue();
  expect(job.queue).toBe(1);
  expect(spy).toBeCalledTimes(0);
});

test('current minute will not run job by default', () => {
  const job = new CronJob(app, defaultSchedule);
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  const nextMinute = now.getMinutes();
  expect(job.getCronExp().next().getMinutes()).toBe(nextMinute);
});

test('minus one minute to against second schedules', () => {
  const job = new CronJob(app, { ...defaultSchedule, seconds: [1, 2] });
  const currentMinute = new Date().getMinutes();
  expect(job.getCronExp().next().getMinutes()).toBe(currentMinute);
});
