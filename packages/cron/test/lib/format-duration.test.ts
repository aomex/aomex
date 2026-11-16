import { expect, test } from 'vitest';
import formatDuration from 'format-duration';

/** 与 stats/stop 中间件一致：`formatDuration(elapsed, { leading: true })` */
test('leading 补零时长格式', () => {
  expect(formatDuration(0, { leading: true })).toBe('00:00');
  expect(formatDuration(1_000, { leading: true })).toBe('00:01');
  expect(formatDuration(61_000, { leading: true })).toBe('01:01');
  // v4：leading 时小时也会补到两位
  expect(formatDuration(3_661_000, { leading: true })).toBe('01:01:01');
});
