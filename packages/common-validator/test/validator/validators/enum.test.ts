import { expect, test } from 'vitest';
import {
  EnumValidator,
  ValidateResult,
  enumLikeToRanges,
  rule,
  validate,
} from '../../../src';

test('枚举限制', async () => {
  const validator = new EnumValidator(['a', 2, 3, true, false]);
  await expect(validator['validate'](2)).resolves.toStrictEqual(ValidateResult.accept(2));
  await expect(validator['validate']('a')).resolves.toStrictEqual(
    ValidateResult.accept('a'),
  );
  await expect(validator['validate'](true)).resolves.toStrictEqual(
    ValidateResult.accept(true),
  );
  await expect(validator['validate'](false)).resolves.toStrictEqual(
    ValidateResult.accept(false),
  );
  await expect(validator['validate'](4, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在枚举范围",
      ],
    }
  `);
});

test('宽松模式下，字符串允许与数字对比', async () => {
  const validator = new EnumValidator(['1', 2, 3]);
  await expect(validator['validate']('2')).resolves.toStrictEqual(
    ValidateResult.accept(2),
  );
});

test('严格模式下，字符串不允许与数字对比', async () => {
  const validator = new EnumValidator(['1', 2, 3]).strict();
  await expect(validator['validate']('2', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在枚举范围",
      ],
    }
  `);
});

test('宽松模式下，布尔值允许与字符串对比', async () => {
  const validator = new EnumValidator([true, false]);
  await expect(validator['validate']('true')).resolves.toStrictEqual(
    ValidateResult.accept(true),
  );
  await expect(validator['validate']('false')).resolves.toStrictEqual(
    ValidateResult.accept(false),
  );
});

test('严格模式下，布尔值不允许与字符串对比', async () => {
  const validator = new EnumValidator([true, false]).strict();
  await expect(validator['validate']('true', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在枚举范围",
      ],
    }
  `);
  await expect(validator['validate']('false', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在枚举范围",
      ],
    }
  `);
});

test('枚举值不能是空值', () => {
  expect(() => new EnumValidator([''])).toThrow();
});

test('枚举值包含字符串0时可以正确判断', async () => {
  const validator = new EnumValidator([0, 1, 2]);
  await expect(validator['validate'](0)).resolves.toStrictEqual(ValidateResult.accept(0));
  await expect(validator['validate']('0')).resolves.toStrictEqual(
    ValidateResult.accept(0),
  );
});

test('枚举值只能是数字、字符串或者布尔值', () => {
  expect(() => new EnumValidator([{}])).toThrow();
  expect(() => new EnumValidator([1n])).toThrow();
});

test('获取文档', () => {
  expect(new EnumValidator([1, 2, 3])['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        1,
        2,
        3,
      ],
      "type": "number",
    }
  `);

  expect(new EnumValidator([1, 2, 'a']).default('a')['toDocument']())
    .toMatchInlineSnapshot(`
    {
      "enum": [
        1,
        2,
        "a",
      ],
      "type": undefined,
    }
  `);

  expect(new EnumValidator([true])['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        true,
      ],
      "type": "boolean",
    }
  `);
});

test('enumLikeToRanges 丢掉数字 enum 反向映射', () => {
  enum Status {
    A,
    B,
  }
  expect(Status[0]).toBe('A');
  expect(enumLikeToRanges(Status)).toEqual([0, 1]);
  expect(enumLikeToRanges(Status)).not.toContain('A');
  expect(enumLikeToRanges(Status)).not.toContain('B');
});

test('rule.enum 支持字符串 TS enum', async () => {
  enum Color {
    Red = 'red',
    Blue = 'blue',
  }
  const validator = rule.enum(Color);
  expect(validator['config'].ranges).toEqual(['red', 'blue']);
  await expect(validate('red', validator)).resolves.toBe('red');
  await expect(validate('green', validator)).rejects.toThrow();
});

test('rule.enum 支持数字 TS enum', async () => {
  enum Status {
    Off = 0,
    On = 1,
  }
  const validator = rule.enum(Status);
  expect(validator['config'].ranges).toEqual([0, 1]);
  await expect(validate(0, validator)).resolves.toBe(0);
  await expect(validate('1', validator)).resolves.toBe(1);
  await expect(validate('On', validator)).rejects.toThrow();
});

test('rule.enum 支持枚举风格对象', async () => {
  const Role = { Admin: 'admin', User: 'user' } as const;
  const validator = rule.enum(Role);
  expect(validator['config'].ranges).toEqual(['admin', 'user']);
  await expect(validate('admin', validator)).resolves.toBe('admin');
  await expect(validate('guest', validator)).rejects.toThrow();
});
