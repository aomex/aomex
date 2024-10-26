import { describe, expect, test } from 'vitest';
import { StringValidator, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new StringValidator();

  test('allowEmptyString', () => {
    const v1 = validator.allowEmptyString();
    expect(v1).toBeInstanceOf(StringValidator);
    expect(v1).not.toBe(validator);
  });
});

test('默认允许空字符串', async () => {
  const validator = new StringValidator();
  await expect(validator['validate']('')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必填",
      ],
    }
  `);
});

test('设置allowEmptyString允许空字符串', async () => {
  const validator = new StringValidator().allowEmptyString();
  await expect(validator['validate']('')).resolves.toStrictEqual(
    ValidateResult.accept(''),
  );
});

test('获取文档', () => {
  expect(new StringValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
  expect(new StringValidator().length(10).match(/x$/)['toDocument']())
    .toMatchInlineSnapshot(`
    {
      "maxLength": 10,
      "minLength": 10,
      "pattern": "x$",
      "type": "string",
    }
  `);
});
