import { describe, expect, test, vitest } from 'vitest';
import { Cron } from '../../src/lib/cron';
import sleep from 'sleep-promise';

test('时间', () => {
  expect(
    new Cron({
      time: '0 *   1-4 *   2',
      command: '',
      commanders: '',
    }).time,
  ).toMatchInlineSnapshot(`"0 0 * 1-4 * 2"`);

  expect(
    new Cron({
      time: '*/2  0 *   1-4 *   2',
      command: '',
      commanders: '',
    }).time,
  ).toMatchInlineSnapshot(`"*/2 0 * 1-4 * 2"`);

  expect(
    new Cron({
      second: '*/10',
      minute: 5,
      hour: 3,
      month: 10,
      dayOfMonth: '*/2',
      dayOfWeek: '2-5',
      command: '',
      commanders: '',
    }).time,
  ).toMatchInlineSnapshot(`"*/10 5 3 */2 10 2-5"`);

  expect(
    new Cron({
      minute: 5,
      command: '',
      commanders: '',
    }).time,
  ).toMatchInlineSnapshot(`"0 5 * * * *"`);

  expect(
    () =>
      new Cron({
        time: '*/2',
        command: '',
        commanders: '',
      }).time,
  ).toThrowErrorMatchingInlineSnapshot(`[Error: 时间表达式不合法：*/2]`);

  expect(
    () =>
      new Cron({
        time: '* * * * * * *',
        command: '',
        commanders: '',
      }).time,
  ).toThrowErrorMatchingInlineSnapshot(`[Error: 时间表达式不合法：* * * * * * *]`);
});

test('转换为字符串', async () => {
  expect(
    new Cron({
      time: '* * * * * *',
      command: 'schedule:command',
      commanders: '/path/to',
    }).toString(),
  ).toMatchInlineSnapshot(`"* * * * * * aomex schedule:command"`);

  expect(
    new Cron({
      time: '* * */2 * *',
      command: 'schedule:command',
      commanders: '/path/to',
      args: ['--hello', 'world', '-x', 'foo bar'],
      concurrent: 5,
    }).toString(),
  ).toMatchInlineSnapshot(
    `"0 * * */2 * * aomex schedule:command --hello world -x "foo bar""`,
  );
});

test('转换为对象', async () => {
  const parser = new Cron({
    time: '* * */2 * *',
    command: 'schedule:command',
    commanders: '/path/to',
    args: ['--hello', 'world'],
    concurrent: 5,
  });

  expect(JSON.stringify(parser.toJSON())).toBe(JSON.stringify(parser));
  expect(parser.toJSON()).toMatchInlineSnapshot(`
    {
      "argv": [
        "schedule:command",
        "--hello",
        "world",
      ],
      "command": "schedule:command",
      "concurrent": 5,
      "time": "0 * * */2 * *",
      "waitingTimeout": 10000,
    }
  `);
});

describe('执行', () => {
  test('start后可以通过stop退出', async () => {
    const cron = new Cron({ commanders: '', command: '', time: '* * * * *' });
    const spy = vitest.fn();
    const promise = cron.start().finally(spy);
    await sleep(1000);
    expect(spy).toBeCalledTimes(0);
    cron.stop();
    await promise;
  });

  test('没有下一个任务时自动结束', async () => {
    const cron = new Cron({ commanders: '', command: '', time: '* * * * *' });
    vitest.spyOn(cron.cronExpression, 'hasNext').mockImplementation(() => false);
    await cron.start();
  });
});

test('队列等待时间不能超过任务时间间隔', () => {
  const cron = new Cron({ time: '* * * * *', command: '', commanders: '' });

  expect(cron.getWaitingTimeout(20_000)).toBe(10_000);
  expect(cron.getWaitingTimeout(10_000)).toBe(10_000);
  expect(cron.getWaitingTimeout(6_000)).toBe(6_000);
  expect(cron.getWaitingTimeout(-30_000)).toBe(10_000);

  expect(
    new Cron({
      command: '',
      commanders: '',
      waitingTimeout: 40_000,
    }).getWaitingTimeout(60_000),
  ).toBe(40_000);
});
