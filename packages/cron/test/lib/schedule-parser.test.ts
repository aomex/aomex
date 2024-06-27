import { expect, test } from 'vitest';
import { ScheduleParser } from '../../src/lib/schedule-parser';

test('时间', () => {
  expect(
    new ScheduleParser({
      time: '0 *   1-4 *   2',
      command: '',
      path: '',
    }).time,
  ).toMatchInlineSnapshot(`"0 * 1-4 * 2"`);

  expect(
    new ScheduleParser({
      time: '*/2  0 *   1-4 *   2',
      command: '',
      path: '',
    }).time,
  ).toMatchInlineSnapshot(`"*/2 0 * 1-4 * 2"`);

  expect(
    new ScheduleParser({
      second: '*/10',
      minute: 5,
      hour: 3,
      month: 10,
      dayOfMonth: '*/2',
      dayOfWeek: '2-5',
      command: '',
      path: '',
    }).time,
  ).toMatchInlineSnapshot(`"*/10 5 3 */2 10 2-5"`);

  expect(
    new ScheduleParser({
      minute: 5,
      command: '',
      path: '',
    }).time,
  ).toMatchInlineSnapshot(`"5 * * * *"`);

  expect(
    new ScheduleParser({
      time: '*/2',
      command: '',
      path: '',
    }).time,
  ).toMatchInlineSnapshot(`"* * * * 0-6/2"`);

  expect(
    () =>
      new ScheduleParser({
        time: '* * * * * * *',
        command: '',
        path: '',
      }).time,
  ).toThrowErrorMatchingInlineSnapshot(`[Error: 时间表达式不合法：* * * * * * *]`);
});

test('overlap默认是false', async () => {
  expect(new ScheduleParser({ time: '', command: '', path: '' }).overlap).toBeFalsy();
  expect(
    new ScheduleParser({ time: '', command: '', path: '', overlap: true }).overlap,
  ).toBeTruthy();
});

test('concurrent默认是1', async () => {
  expect(new ScheduleParser({ time: '', command: '', path: '' }).concurrent).toBe(1);
  expect(
    new ScheduleParser({ time: '', command: '', path: '', concurrent: -2 }).concurrent,
  ).toBe(1);
  expect(
    new ScheduleParser({ time: '', command: '', path: '', concurrent: 0 }).concurrent,
  ).toBe(1);
  expect(
    new ScheduleParser({ time: '', command: '', path: '', concurrent: 2 }).concurrent,
  ).toBe(2);
});

test('转换为列表', async () => {
  expect(
    new ScheduleParser({
      time: '* * * * * *',
      command: 'schedule:command',
      path: '/path/to',
    }).toCrontab(),
  ).toMatchInlineSnapshot(`"* * * * * * aomex schedule:command"`);

  expect(
    new ScheduleParser({
      time: '* * */2 * *',
      command: 'schedule:command',
      path: '/path/to',
      args: ['--hello', 'world', '-x', 'foo bar'],
      concurrent: 5,
      overlap: true,
    }).toCrontab(),
  ).toMatchInlineSnapshot(
    `"* * */2 * * aomex schedule:command --hello world -x "foo bar""`,
  );
});

test('转换为对象', async () => {
  const parser = new ScheduleParser({
    time: '* * */2 * *',
    command: 'schedule:command',
    path: '/path/to',
    args: ['--hello', 'world'],
    concurrent: 5,
    overlap: true,
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
      "overlap": true,
      "time": "* * */2 * *",
    }
  `);
});
