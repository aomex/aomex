import { expect, test } from 'vitest';
import { MockTransport } from '../mocks/mock-transport';

const t = new MockTransport();

test('时间对象', () => {
  expect(t['dateToJSON'](new Date('2024-10-24T10:24:00+08:00'))).toMatchInlineSnapshot(`
    {
      "day": "24",
      "hour": "10",
      "minute": "24",
      "month": "10",
      "second": "00",
      "year": "2024",
    }
  `);
});

test('时间字符串', () => {
  expect(t['dateToString'](new Date('2024-10-24T10:24:00+08:00'))).toMatchInlineSnapshot(
    `"2024-10-24 10:24:00"`,
  );
});
