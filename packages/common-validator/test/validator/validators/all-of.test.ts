import { expect, test } from 'vitest';
import {
  ArrayValidator,
  BigIntValidator,
  AllOfValidator,
  StringValidator,
  UrlValidator,
  ValidateResult,
} from '../../../src';

test('管道', async () => {
  const validator = new AllOfValidator([
    new StringValidator().transform((data) => data + 'abc'),
    new StringValidator().transform((data) => data + 'def'),
  ]);
  await expect(validator['validate']('x')).resolves.toStrictEqual(
    ValidateResult.accept('xabcdef'),
  );
});

test('必须匹配所有规则', async () => {
  const validator = new AllOfValidator([new StringValidator(), new UrlValidator()]);
  await expect(validator['validate']('http://www.example.com')).resolves.toStrictEqual(
    ValidateResult.accept('http://www.example.com'),
  );
  await expect(validator['validate']('x', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL未匹配所有规则",
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
            "example": "922337203685475807",
            "format": "int64",
            "type": "integer",
          },
          "type": "array",
        },
        {
          "example": "922337203685475807",
          "exclusiveMinimum": false,
          "format": "int64",
          "minimum": 10,
          "type": "integer",
        },
      ],
    }
  `);
});
