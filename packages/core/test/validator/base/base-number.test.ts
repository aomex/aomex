import { describe, expect, test } from 'vitest';
import { MockNumberValidator } from '../../mock/mock-number-validator';
import { magistrate } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new MockNumberValidator();

  test('min', () => {
    const v1 = validator.min(1);
    expect(v1).toBeInstanceOf(MockNumberValidator);
    expect(v1).not.toBe(validator);
  });

  test('max', () => {
    const v1 = validator.max(2);
    expect(v1).toBeInstanceOf(MockNumberValidator);
    expect(v1).not.toBe(validator);
  });
});

describe('大小', () => {
  test('最小值（包含）', async () => {
    const validator = new MockNumberValidator().min(10);
    await expect(validator['validate'](10)).resolves.toStrictEqual(
      magistrate.ok(10),
    );
    await expect(validator['validate'](11)).resolves.toStrictEqual(
      magistrate.ok(11),
    );
    await expect(validator['validate'](9, '')).resolves.toStrictEqual(
      magistrate.fail('数字太大或太小', '', []),
    );
  });

  test('最小值（不包含）', async () => {
    const validator = new MockNumberValidator().min(10, false);
    await expect(validator['validate'](10, '')).resolves.toStrictEqual(
      magistrate.fail('数字太大或太小', '', []),
    );
  });

  test('最大值（包含）', async () => {
    const validator = new MockNumberValidator().max(10);
    await expect(validator['validate'](9)).resolves.toStrictEqual(
      magistrate.ok(9),
    );
    await expect(validator['validate'](10)).resolves.toStrictEqual(
      magistrate.ok(10),
    );
    await expect(validator['validate'](11, '')).resolves.toStrictEqual(
      magistrate.fail('数字太大或太小', '', []),
    );
  });

  test('最大值（不包含）', async () => {
    const validator = new MockNumberValidator().max(10, false);
    await expect(validator['validate'](10, '')).resolves.toStrictEqual(
      magistrate.fail('数字太大或太小', '', []),
    );
  });
});

test('宽松模式下，字符串转换为数字', async () => {
  const validator = new MockNumberValidator();
  await expect(validator['validate']('123')).resolves.toStrictEqual(
    magistrate.ok(123),
  );
});

test('严格模式下，字符串禁止转换为数字', async () => {
  const validator = new MockNumberValidator().strict();
  await expect(validator['validate']('123', '')).resolves.toStrictEqual(
    magistrate.fail('必须是数字类型', '', []),
  );
});
