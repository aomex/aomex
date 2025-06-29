import { expect, test } from 'vitest';
import { IntValidator, ValidateResult } from '../../../src';

test('只允许整数', async () => {
  const validator = new IntValidator();

  await expect(validator['validate'](123)).resolves.toStrictEqual(
    ValidateResult.accept(123),
  );
  await expect(validator['validate'](123.4, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须是整数",
      ],
    }
  `);
});

test('获取文档', () => {
  expect(new IntValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "exclusiveMaximum": undefined,
      "exclusiveMinimum": undefined,
      "maximum": undefined,
      "minimum": undefined,
      "type": "integer",
    }
  `);
  expect(new IntValidator().min(10).max(20)['toDocument']()).toMatchInlineSnapshot(`
    {
      "exclusiveMaximum": false,
      "exclusiveMinimum": false,
      "maximum": 20,
      "minimum": 10,
      "type": "integer",
    }
  `);
});
