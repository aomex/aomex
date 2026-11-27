import { expect, test } from 'vitest';
import { NumberValidator, toDocument, ValidateResult } from '../../../src';

test('可以是整数或者浮点数', async () => {
  const validator = new NumberValidator();

  await expect(validator['validate'](123)).resolves.toStrictEqual(
    ValidateResult.accept(123),
  );
  await expect(validator['validate'](123.4)).resolves.toStrictEqual(
    ValidateResult.accept(123.4),
  );
});

test('获取文档', () => {
  expect(new NumberValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "exclusiveMaximum": undefined,
      "exclusiveMinimum": undefined,
      "maximum": undefined,
      "minimum": undefined,
      "type": "number",
    }
  `);
  expect(new NumberValidator().min(10).max(20)['toDocument']()).toMatchInlineSnapshot(`
    {
      "exclusiveMaximum": undefined,
      "exclusiveMinimum": undefined,
      "maximum": 20,
      "minimum": 10,
      "type": "number",
    }
  `);
});

test('nullable 文档快照', () => {
  expect(toDocument(new NumberValidator().nullable()).schema).toMatchInlineSnapshot(`
    {
      "type": [
        "number",
        "null",
      ],
    }
  `);
});

test('排他数值边界使用 3.2 的数值形式', () => {
  expect(new NumberValidator().min(10, false).max(20, false)['toDocument']()).toEqual({
    type: 'number',
    maximum: undefined,
    minimum: undefined,
    exclusiveMaximum: 20,
    exclusiveMinimum: 10,
  });
});
