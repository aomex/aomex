import { expect, test } from 'vitest';
import {
  EnumValidator,
  ValidateResult,
  enumLikeToRanges,
  rule,
  toDocument,
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

test('nullable 文档快照', () => {
  expect(toDocument(rule.enum(['a', 1, true]).nullable()).schema).toMatchInlineSnapshot(`
    {
      "anyOf": [
        {
          "enum": [
            "a",
            1,
            true,
          ],
        },
        {
          "type": "null",
        },
      ],
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

test('pick 只保留指定值（rest / 数组）', async () => {
  const base = rule.enum(['a', 'b', 'c', 1]);
  const byRest = base.pick('a', 1);
  expect(byRest['config'].ranges).toEqual(['a', 1]);
  await expect(validate('a', byRest)).resolves.toBe('a');
  await expect(validate(1, byRest)).resolves.toBe(1);
  await expect(validate('b', byRest)).rejects.toThrow();

  const byArr = base.pick(['b', 'c']);
  expect(byArr['config'].ranges).toEqual(['b', 'c']);
  await expect(validate('b', byArr)).resolves.toBe('b');
  await expect(validate('a', byArr)).rejects.toThrow();
});

test('omit 去掉指定值（rest / 数组）', async () => {
  const base = rule.enum(['a', 'b', 'c', 1]);
  const byRest = base.omit('c', 1);
  expect(byRest['config'].ranges).toEqual(['a', 'b']);
  await expect(validate('a', byRest)).resolves.toBe('a');
  await expect(validate('c', byRest)).rejects.toThrow();
  await expect(validate(1, byRest)).rejects.toThrow();

  const byArr = base.omit(['a']);
  expect(byArr['config'].ranges).toEqual(['b', 'c', 1]);
  await expect(validate('a', byArr)).rejects.toThrow();
  await expect(validate(1, byArr)).resolves.toBe(1);
});

test('pick/omit 返回新实例且不修改原对象', () => {
  const base = rule.enum(['a', 'b', 'c', 1]);
  const picked = base.pick('a', 1);
  expect(picked).toBeInstanceOf(EnumValidator);
  expect(picked).not.toBe(base);
  expect(picked['config']).not.toBe(base['config']);
  expect(picked['config'].ranges).not.toBe(base['config'].ranges);
  expect(base['config'].ranges).toEqual(['a', 'b', 'c', 1]);

  const omitted = base.omit('c', 1);
  expect(omitted).toBeInstanceOf(EnumValidator);
  expect(omitted).not.toBe(base);
  expect(omitted['config']).not.toBe(base['config']);
  expect(omitted['config'].ranges).not.toBe(base['config'].ranges);
  expect(base['config'].ranges).toEqual(['a', 'b', 'c', 1]);
});

test('pick/omit 保留 strict 与 optional 配置', async () => {
  const base = rule.enum([1, 2, 3]).strict().optional();
  const picked = base.pick(1, 2);
  expect(picked['config'].strict).toBe(true);
  expect(picked['config'].required).toBe(false);
  expect(picked['config'].ranges).toEqual([1, 2]);
  await expect(validate('2', picked)).rejects.toThrow();
  await expect(validate(undefined, picked)).resolves.toBeUndefined();

  const omitted = base.omit(3);
  expect(omitted['config'].strict).toBe(true);
  expect(omitted['config'].required).toBe(false);
  expect(omitted['config'].ranges).toEqual([1, 2]);
});

test('pick/omit 可用于 TS enum 与枚举对象', async () => {
  enum Color {
    Red = 'red',
    Blue = 'blue',
    Green = 'green',
  }
  const colorPicked = rule.enum(Color).pick(Color.Red, Color.Blue);
  expect(colorPicked['config'].ranges).toEqual(['red', 'blue']);
  await expect(validate('green', colorPicked)).rejects.toThrow();

  const Role = { Admin: 'admin', User: 'user', Guest: 'guest' } as const;
  const roleOmitted = rule.enum(Role).omit(Role.Guest);
  expect(roleOmitted['config'].ranges).toEqual(['admin', 'user']);
  await expect(validate('guest', roleOmitted)).rejects.toThrow();
});

test('pick/omit 结果为空 ranges 时抛错', () => {
  const base = rule.enum(['a', 'b']);
  expect(() => base.omit('a', 'b')).toThrow(/枚举范围不能为空/);
  expect(() => base.omit(['a', 'b'])).toThrow(/枚举范围不能为空/);
  expect(() => base.pick([])).toThrow(/枚举范围不能为空/);
});

test('pick/omit 后 default 仍在范围内则保留', async () => {
  const base = rule.enum(['a', 'b', 'c']).default('b');
  const picked = base.pick('a', 'b');
  expect(picked['config'].defaultValue).toBe('b');
  expect(picked['config'].ranges).toEqual(['a', 'b']);
  await expect(validate(undefined, picked)).resolves.toBe('b');

  const omitted = base.omit('c');
  expect(omitted['config'].defaultValue).toBe('b');
  await expect(validate(undefined, omitted)).resolves.toBe('b');
});

test('pick/omit 后 default 不在范围内则抛错', () => {
  const base = rule.enum(['a', 'b', 'c']).default('c');
  expect(() => base.omit('c')).toThrow(/默认值「c」不在枚举范围/);
  expect(() => base.pick('a', 'b')).toThrow(/默认值「c」不在枚举范围/);
  expect(() => base.pick(['a'])).toThrow(/默认值「c」不在枚举范围/);

  const withFn = rule.enum(['a', 'b', 'c']).default(() => 'c' as const);
  expect(() => withFn.omit('c')).toThrow(/默认值「c」不在枚举范围/);
});
