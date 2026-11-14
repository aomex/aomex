import { expect, test } from 'vitest';
import { MockTransport } from '../mocks/mock-transport';

const t = new MockTransport();

test('默认 onInit / flush / onDestroy 可 await', async () => {
  await expect(t.onInit()).resolves.toBeUndefined();
  await expect(t.flush()).resolves.toBeUndefined();
  await expect(t.onDestroy()).resolves.toBeUndefined();
});

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

test('formatLog 含 bindings', () => {
  const log = {
    message: 'hello',
    timestamp: new Date(1730296983321),
    level: 'info' as const,
    bindings: { requestId: 'r1' },
  };
  expect(t['formatLog'](log, 'text')).toBe(
    '[info] 2024-10-30 22:03:03 hello {"requestId":"r1"}',
  );
  expect(JSON.parse(t['formatLog'](log, 'json'))).toMatchObject({
    level: 'info',
    message: 'hello',
    bindings: { requestId: 'r1' },
  });
});
