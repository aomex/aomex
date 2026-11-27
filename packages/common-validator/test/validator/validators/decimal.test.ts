import { describe, expect, test } from 'vitest';
import { Decimal, DecimalValidator, toDocument, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new DecimalValidator();

  test('min', () => {
    const v1 = validator.min(1);
    expect(v1).toBeInstanceOf(DecimalValidator);
    expect(v1).not.toBe(validator);
  });

  test('max', () => {
    const v1 = validator.max(12);
    expect(v1).toBeInstanceOf(DecimalValidator);
    expect(v1).not.toBe(validator);
  });
});

test('最小值（包含自身）', async () => {
  const validator = new DecimalValidator().min('10.5');
  await expect(validator['validate']('1', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL超出允许的数值范围",
      ],
    }
  `);
  await expect(validator['validate']('10.5')).resolves.toStrictEqual(
    ValidateResult.accept(new Decimal('10.5')),
  );
  await expect(validator['validate']('101')).resolves.toStrictEqual(
    ValidateResult.accept(new Decimal('101')),
  );
});

test('最小值（不包含自身）', async () => {
  const validator = new DecimalValidator().min('10.5', false);
  await expect(validator['validate']('10.5', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL超出允许的数值范围",
      ],
    }
  `);
  await expect(validator['validate']('10.6')).resolves.toStrictEqual(
    ValidateResult.accept(new Decimal('10.6')),
  );
});

test('最大值（包含自身）', async () => {
  const validator = new DecimalValidator().max('10.5');
  await expect(validator['validate']('101', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL超出允许的数值范围",
      ],
    }
  `);
  await expect(validator['validate']('10.5')).resolves.toStrictEqual(
    ValidateResult.accept(new Decimal('10.5')),
  );
  await expect(validator['validate']('1')).resolves.toStrictEqual(
    ValidateResult.accept(new Decimal('1')),
  );
});

test('最大值（不包含自身）', async () => {
  const validator = new DecimalValidator().max('10.5', false);
  await expect(validator['validate']('10.5', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL超出允许的数值范围",
      ],
    }
  `);
  await expect(validator['validate']('10.4')).resolves.toStrictEqual(
    ValidateResult.accept(new Decimal('10.4')),
  );
});

test('从字符串或者数字转换', async () => {
  const validator = new DecimalValidator();
  for (const data of [123.45, '123.45']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(new Decimal('123.45')),
    );
  }
});

test('接受 Decimal 实例', async () => {
  const validator = new DecimalValidator();
  const value = new Decimal('99.99');
  await expect(validator['validate'](value)).resolves.toStrictEqual(
    ValidateResult.accept(value),
  );
});

test('拒绝非法值', async () => {
  const validator = new DecimalValidator();
  for (const data of [true, {}, [], 'abc', NaN, Infinity]) {
    await expect(validator['validate'](data, '', 'LABEL')).resolves.toMatchObject({
      errors: ['LABEL必须为 Decimal'],
    });
  }
});

test('严格模式下，禁止从字符串或者数字转换', async () => {
  const validator = new DecimalValidator().strict();
  for (const data of [123.45, '123.45']) {
    await expect(validator['validate'](data, '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL必须为 Decimal'],
    });
  }
  const value = new Decimal('1');
  await expect(validator['validate'](value)).resolves.toStrictEqual(
    ValidateResult.accept(value),
  );
});

test('默认值支持 string / number / Decimal', async () => {
  const fromString = new DecimalValidator().default('1.5');
  expect(fromString['config'].defaultValue).toStrictEqual(new Decimal('1.5'));

  const fromNumber = new DecimalValidator().default(1.5);
  expect(fromNumber['config'].defaultValue).toStrictEqual(new Decimal('1.5'));

  const raw = new Decimal('1.5');
  const fromDecimal = new DecimalValidator().default(raw);
  expect(fromDecimal['config'].defaultValue).toBe(raw);
});

test('获取文档', () => {
  expect(new DecimalValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "example": "123.45",
      "exclusiveMaximum": undefined,
      "exclusiveMinimum": undefined,
      "maximum": undefined,
      "minimum": undefined,
      "type": "string",
    }
  `);

  expect(new DecimalValidator().min('10').max('20', false).default('15')['toDocument']())
    .toMatchInlineSnapshot(`
      {
        "default": "15",
        "example": "123.45",
        "exclusiveMaximum": 20,
        "exclusiveMinimum": undefined,
        "maximum": undefined,
        "minimum": 10,
        "type": "string",
      }
    `);

  expect(new DecimalValidator().min('10', false).max('20')['toDocument']()).toMatchObject(
    {
      minimum: undefined,
      exclusiveMinimum: 10,
      maximum: 20,
      exclusiveMaximum: undefined,
    },
  );
});

test('nullable 文档快照', () => {
  expect(toDocument(new DecimalValidator().nullable()).schema).toMatchInlineSnapshot(`
    {
      "example": "123.45",
      "type": [
        "string",
        "null",
      ],
    }
  `);
});
