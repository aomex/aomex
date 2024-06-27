import { expect, test } from 'vitest';
import { ScheduleMiddleware, schedule } from '../../src';

test('中间件', () => {
  expect(schedule('')).toBeInstanceOf(ScheduleMiddleware);
});

test('传递字符串为定时表达式', () => {
  const md = schedule('* * * * *');
  expect(md['options']).toMatchInlineSnapshot(`
    {
      "time": "* * * * *",
    }
  `);
});

test('传递对象', () => {
  const md = schedule({
    minute: 2,
    hour: '*',
    args: ['-t', '10'],
  });
  expect(md['options']).toMatchInlineSnapshot(`
    {
      "args": [
        "-t",
        "10",
      ],
      "hour": "*",
      "minute": 2,
    }
  `);
});
