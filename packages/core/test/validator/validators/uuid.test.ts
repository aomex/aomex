import { expect, test } from 'vitest';
import { UuidValidator, ValidateResult } from '../../../src';

test('合法的uuid', async () => {
  await expect(
    new UuidValidator(['v4'])['validate']('59eb9789-08de-4286-abb2-cc2ef12045ea'),
  ).resolves.toStrictEqual(ValidateResult.accept('59eb9789-08de-4286-abb2-cc2ef12045ea'));
  await expect(
    new UuidValidator(['v1'])['validate']('8ac710f2-e9b8-11ee-8c18-43a8f0f223b0'),
  ).resolves.toStrictEqual(ValidateResult.accept('8ac710f2-e9b8-11ee-8c18-43a8f0f223b0'));
});

test('版本必须对应', async () => {
  await expect(
    new UuidValidator(['v1'])['validate']('59eb9789-08de-4286-abb2-cc2ef12045ea'),
  ).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是UUIDv1格式",
      ],
    }
  `);
});

test('所有版本都支持的情况', async () => {
  await expect(
    new UuidValidator([...UuidValidator.versions])['validate'](
      '59eb9789-08de-4286-abb2-cc2ef12045ea',
    ),
  ).resolves.toStrictEqual(ValidateResult.accept('59eb9789-08de-4286-abb2-cc2ef12045ea'));
});

test('获取文档', () => {
  expect(new UuidValidator(['v4'])['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "uuid",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
});
