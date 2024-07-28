import { expect, test } from 'vitest';
import {
  ArrayValidator,
  BigIntValidator,
  AllOfValidator,
  StringValidator,
  UrlValidator,
  magistrate,
} from '../../../src';

test('管道', async () => {
  const validator = new AllOfValidator([
    new StringValidator().transform((data) => data + 'abc'),
    new StringValidator().transform((data) => data + 'def'),
  ]);
  await expect(validator['validate']('x')).resolves.toStrictEqual(
    magistrate.ok('xabcdef'),
  );
});

test('必须匹配所有规则', async () => {
  const validator = new AllOfValidator([new StringValidator(), new UrlValidator()]);
  await expect(validator['validate']('http://www.example.com')).resolves.toStrictEqual(
    magistrate.ok('http://www.example.com'),
  );
  await expect(validator['validate']('x')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：未匹配所有规则",
      ],
    }
  `);
});

test('获取文档', () => {
  expect(
    new AllOfValidator([
      new ArrayValidator(new BigIntValidator()),
      new BigIntValidator().min(10n),
    ])['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "allOf": [
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
