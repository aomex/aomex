import { expect, test } from 'vitest';
import {
  ArrayValidator,
  BigIntValidator,
  HashValidator,
  AnyOfValidator,
  StringValidator,
  UrlValidator,
  ValidateResult,
} from '../../../src';

test('匹配其中一个规则即可', async () => {
  const validator = new AnyOfValidator([new ArrayValidator(), new BigIntValidator()]);
  await expect(validator['validate'](123n)).resolves.toStrictEqual(
    ValidateResult.accept(123n),
  );
  await expect(validator['validate'](['x'])).resolves.toStrictEqual(
    ValidateResult.accept(['x']),
  );
});

test('匹配多个也不会报错', async () => {
  const validator = new AnyOfValidator([
    new HashValidator('md5'),
    new StringValidator(),
    new UrlValidator(),
  ]);
  await expect(validator['validate']('x')).resolves.toStrictEqual(
    ValidateResult.accept('x'),
  );
  await expect(validator['validate']('http://www.example.com')).resolves.toStrictEqual(
    ValidateResult.accept('http://www.example.com'),
  );
});

test('管道', async () => {
  const validator = new AnyOfValidator([
    new StringValidator().transform((data) => data + 'abc'),
    new StringValidator().transform((data) => data + 'def'),
  ]);
  await expect(validator['validate']('x')).resolves.toStrictEqual(
    ValidateResult.accept('xabcdef'),
  );
});

test('匹配不上则报错', async () => {
  const validator = new AnyOfValidator([new ArrayValidator(), new BigIntValidator()]);
  await expect(validator['validate']({})).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：未匹配规则",
      ],
    }
  `);
});

test('空值也由子验证器处理', async () => {
  const validator = new AnyOfValidator([
    new ArrayValidator(),
    new BigIntValidator().optional().transform(() => 'OK'),
  ]);
  await expect(validator['validate'](undefined)).resolves.toStrictEqual(
    ValidateResult.accept('OK'),
  );
});

test('获取文档', () => {
  expect(
    new AnyOfValidator([
      new ArrayValidator(new BigIntValidator()),
      new BigIntValidator().min(10n),
    ])['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "anyOf": [
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
