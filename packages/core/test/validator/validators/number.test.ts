import { expect, test } from 'vitest';
import { NumberValidator, magistrate } from '../../../src';

test('可以是整数或者浮点数', async () => {
  const validator = new NumberValidator();

  await expect(validator['validate'](123)).resolves.toStrictEqual(magistrate.ok(123));
  await expect(validator['validate'](123.4)).resolves.toStrictEqual(magistrate.ok(123.4));
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
      "exclusiveMaximum": false,
      "exclusiveMinimum": false,
      "maximum": 20,
      "minimum": 10,
      "type": "number",
    }
  `);
});
