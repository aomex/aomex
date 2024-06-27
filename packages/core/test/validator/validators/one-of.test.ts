import { expect, test } from 'vitest';
import {
  ArrayValidator,
  BigIntValidator,
  OneOfValidator,
  magistrate,
} from '../../../src';

test('匹配到任意一个规则即可', async () => {
  const validator = new OneOfValidator([new ArrayValidator(), new BigIntValidator()]);
  await expect(validator['validate'](123n)).resolves.toStrictEqual(magistrate.ok(123n));
  await expect(validator['validate'](['x'])).resolves.toStrictEqual(magistrate.ok(['x']));
});

test('匹配不上则报错', async () => {
  const validator = new OneOfValidator([new ArrayValidator(), new BigIntValidator()]);
  await expect(validator['validate']({})).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：未匹配规则",
      ],
    }
  `);
});

test('空值也由子验证器处理', async () => {
  const validator = new OneOfValidator([
    new ArrayValidator(),
    new BigIntValidator().optional().transform(() => 'OK'),
  ]);
  await expect(validator['validate'](undefined)).resolves.toStrictEqual(
    magistrate.ok('OK'),
  );
});

test('获取文档', () => {
  expect(
    new OneOfValidator([
      new ArrayValidator(new BigIntValidator()),
      new BigIntValidator().min(10n),
    ])['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "oneOf": [
        {
          "items": {
            "format": "int64",
            "type": "integer",
          },
          "type": "array",
        },
        {
          "exclusiveMinimum": false,
          "format": "int64",
          "minimum": 10,
          "type": "integer",
        },
      ],
    }
  `);
});
