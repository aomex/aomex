import { expect, test } from 'vitest';
import { EnumValidator, ValidateResult } from '../../../src';

test('枚举限制', async () => {
  const validator = new EnumValidator(['a', 2, 3]);
  await expect(validator['validate'](2)).resolves.toStrictEqual(ValidateResult.accept(2));
  await expect(validator['validate']('a')).resolves.toStrictEqual(
    ValidateResult.accept('a'),
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

test('枚举值不能是空值', () => {
  expect(() => new EnumValidator([''])).toThrowError();
});

test('枚举值只能是数字或者字符串', () => {
  expect(() => new EnumValidator([{}])).toThrowError();
  expect(() => new EnumValidator([true])).toThrowError();
  expect(() => new EnumValidator([1n])).toThrowError();
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
});
