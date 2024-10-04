import { expect, test } from 'vitest';
import { AnyValidator, ValidateResult } from '../../../src';

test('可以传递任何值', async () => {
  const validator = new AnyValidator();
  for (const data of ['a', 1, Symbol('x'), {}, [], 123n]) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(data),
    );
  }
});

test('获取文档', () => {
  expect(new AnyValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "anyOf": [
        {
          "items": {},
          "type": "array",
        },
        {
          "type": "boolean",
        },
        {
          "type": "integer",
        },
        {
          "type": "number",
        },
        {
          "type": "object",
        },
        {
          "type": "string",
        },
      ],
    }
  `);
});
