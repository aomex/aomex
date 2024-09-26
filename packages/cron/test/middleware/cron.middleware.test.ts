import { expect, test } from 'vitest';
import { CronMiddleware, cron } from '../../src';

test('中间件', () => {
  expect(cron('')).toBeInstanceOf(CronMiddleware);
});

test('传递字符串为定时表达式', () => {
  const md = cron('* * * * *');
  expect(md['options']).toMatchInlineSnapshot(`
    {
      "time": "* * * * *",
    }
  `);
});

test('传递对象', () => {
  const md = cron({
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
