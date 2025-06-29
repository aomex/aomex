import { describe, expect, test } from 'vitest';
import { BigIntValidator, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new BigIntValidator();

  test('min', () => {
    const v1 = validator.min(1n);
    expect(v1).toBeInstanceOf(BigIntValidator);
    expect(v1).not.toBe(validator);
  });

  test('max', () => {
    const v1 = validator.max(12n);
    expect(v1).toBeInstanceOf(BigIntValidator);
    expect(v1).not.toBe(validator);
  });
});

test('最小值（包含自身）', async () => {
  const validator = new BigIntValidator().min(10n);
  await expect(validator['validate'](1n, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在指定的数字范围",
      ],
    }
  `);
  await expect(validator['validate'](10n)).resolves.toStrictEqual(
    ValidateResult.accept(10n),
  );
  await expect(validator['validate'](101n)).resolves.toStrictEqual(
    ValidateResult.accept(101n),
  );
});

test('最小值（不包含自身）', async () => {
  const validator = new BigIntValidator().min(10n, false);
  await expect(validator['validate'](10n, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在指定的数字范围",
      ],
    }
  `);
  await expect(validator['validate'](11n)).resolves.toStrictEqual(
    ValidateResult.accept(11n),
  );
});

test('最大值（包含自身）', async () => {
  const validator = new BigIntValidator().max(10n);
  await expect(validator['validate'](101n, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在指定的数字范围",
      ],
    }
  `);
  await expect(validator['validate'](10n)).resolves.toStrictEqual(
    ValidateResult.accept(10n),
  );
  await expect(validator['validate'](1n)).resolves.toStrictEqual(
    ValidateResult.accept(1n),
  );
});

test('最大值（不包含自身）', async () => {
  const validator = new BigIntValidator().max(10n, false);
  await expect(validator['validate'](10n, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不在指定的数字范围",
      ],
    }
  `);
  await expect(validator['validate'](9n)).resolves.toStrictEqual(
    ValidateResult.accept(9n),
  );
});

test('从字符串或者数字转换', async () => {
  const validator = new BigIntValidator();
  for (const data of [123, '123']) {
    await expect(validator['validate'](data, '', 'LABEL')).resolves.toStrictEqual(
      ValidateResult.accept(123n),
    );
  }
});

test('严格模式下，禁止从字符串或者数字转换', async () => {
  const validator = new BigIntValidator().strict();
  for (const data of [123, '123']) {
    await expect(validator['validate'](data, '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL必须是大整数类型'],
    });
  }
});

test('获取文档', () => {
  expect(new BigIntValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "example": "922337203685475807",
      "exclusiveMaximum": undefined,
      "exclusiveMinimum": undefined,
      "format": "int64",
      "maximum": undefined,
      "minimum": undefined,
      "type": "integer",
    }
  `);

  expect(new BigIntValidator().min(10n).max(20n, false).default(15n)['toDocument']())
    .toMatchInlineSnapshot(`
      {
        "default": 15,
        "example": "922337203685475807",
        "exclusiveMaximum": true,
        "exclusiveMinimum": false,
        "format": "int64",
        "maximum": 20,
        "minimum": 10,
        "type": "integer",
      }
    `);
});
