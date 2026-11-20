import { expect, test } from 'vitest';
import { parseDuration } from '../src/duration';

test('数字毫秒原样返回', () => {
  expect(parseDuration(1000)).toBe(1000);
  expect(parseDuration(0)).toBe(0);
});

test('解析人类可读时长', () => {
  expect(parseDuration('500ms')).toBe(500);
  expect(parseDuration('1 s')).toBe(1_000);
  expect(parseDuration('2 seconds')).toBe(2_000);
  expect(parseDuration('2m')).toBe(120_000);
  expect(parseDuration('3 minutes')).toBe(180_000);
  expect(parseDuration('1 hour')).toBe(3_600_000);
  expect(parseDuration('2 hrs')).toBe(7_200_000);
  expect(parseDuration('1 day')).toBe(86_400_000);
  expect(parseDuration('1 week')).toBe(604_800_000);
  expect(parseDuration('1 month')).toBe(2_592_000_000);
  expect(parseDuration('2 months')).toBe(5_184_000_000);
  expect(parseDuration('1 year')).toBe(31_536_000_000);
  expect(parseDuration('1 years')).toBe(31_536_000_000);
});

test('解析小数时长', () => {
  expect(parseDuration('1.5 hours')).toBe(5_400_000);
  expect(parseDuration('0.5s')).toBe(500);
});

test('非法时长抛错', () => {
  expect(() => parseDuration(-1)).toThrow(RangeError);
  expect(() => parseDuration(Number.NaN)).toThrow(RangeError);
  expect(() => parseDuration(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  // 运行时仍校验；类型上非法的字符串需断言绕过
  expect(() => parseDuration('abc' as `${number}day`)).toThrow(TypeError);
  expect(() => parseDuration(-1)).toThrow(/无效的时长/);
  expect(() => parseDuration('abc' as `${number}day`)).toThrow(/无效的时长/);
  // 超长数字串 → Infinity，与数字路径一致抛 RangeError
  expect(() => parseDuration(`${'9'.repeat(400)}ms` as `${number}ms`)).toThrow(
    RangeError,
  );
  expect(() => parseDuration(`${'9'.repeat(400)}ms` as `${number}ms`)).toThrow(
    /无效的时长/,
  );
});
