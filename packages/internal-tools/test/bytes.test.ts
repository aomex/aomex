import { expect, test } from 'vitest';
import { bytes } from '../src';

test('数字格式化为带单位字符串', () => {
  expect(bytes(1024)).toBe('1KB');
  expect(bytes(1000, { thousandsSeparator: ' ' })).toBe('1 000B');
});

test('字符串解析为字节数', () => {
  expect(bytes('1KB')).toBe(1024);
  expect(bytes('10.5MB')).toBe(10.5 * 1024 * 1024);
});

test('非法输入抛错', () => {
  expect(() => bytes('not-a-size')).toThrowErrorMatchingInlineSnapshot(
    `[TypeError: 无效的字节大小：not-a-size]`,
  );
  expect(() => bytes(Number.NaN)).toThrowErrorMatchingInlineSnapshot(
    `[TypeError: 无效的字节大小：NaN]`,
  );
});
