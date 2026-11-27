import { expect, test } from 'vitest';
import {
  ArrayValidator,
  BigIntValidator,
  HashValidator,
  OneOfValidator,
  StringValidator,
  toDocument,
  UrlValidator,
  ValidateResult,
} from '../../../src';

test('匹配其中一个规则即可', async () => {
  const validator = new OneOfValidator([new ArrayValidator(), new BigIntValidator()]);
  await expect(validator['validate'](123n)).resolves.toStrictEqual(
    ValidateResult.accept(123n),
  );
  await expect(validator['validate'](['x'])).resolves.toStrictEqual(
    ValidateResult.accept(['x']),
  );
});

test('匹配多个则报错', async () => {
  const validator = new OneOfValidator([
    new StringValidator(),
    new UrlValidator(),
    new HashValidator('md5'),
  ]);
  await expect(validator['validate']('x')).resolves.toStrictEqual(
    ValidateResult.accept('x'),
  );
  await expect(validator['validate']('http://www.example.com', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL符合了多条规则",
      ],
    }
  `);
});

test('匹配不上则报错', async () => {
  const validator = new OneOfValidator([new ArrayValidator(), new BigIntValidator()]);
  await expect(validator['validate']({}, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不符合规则",
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
    ValidateResult.accept('OK'),
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
            "example": "922337203685475807",
            "format": "int64",
            "type": "integer",
          },
          "type": "array",
        },
        {
          "example": "922337203685475807",
          "format": "int64",
          "minimum": 10,
          "type": "integer",
        },
      ],
    }
  `);
});

test('nullable 文档快照', () => {
  expect(
    toDocument(new OneOfValidator([new StringValidator(), new UrlValidator()]).nullable())
      .schema,
  ).toMatchInlineSnapshot(`
    {
      "anyOf": [
        {
          "oneOf": [
            {
              "type": "string",
            },
            {
              "example": "https://example.com/path/to?id=1",
              "format": "uri",
              "type": "string",
            },
          ],
        },
        {
          "type": "null",
        },
      ],
    }
  `);
});
