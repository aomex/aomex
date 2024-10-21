import { describe, expect, test } from 'vitest';
import { UrlValidator, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new UrlValidator();
  test('scheme', () => {
    const v1 = validator.scheme(['http']);
    expect(v1).toBeInstanceOf(UrlValidator);
    expect(v1).not.toBe(validator);
  });
});

test('合法的URL格式', async () => {
  const validator = new UrlValidator();

  for (const data of [
    'http://example',
    'http://www.example.com',
    'https://example.com:3000/path/to?a=b#myhash',
  ]) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(data),
    );
  }
});

test('不合法的URL格式', async () => {
  const validator = new UrlValidator();

  for (const data of [
    'sometext',
    'http:example.com',
    '//example.com',
    '://example.com',
    'http:/example.com',
    'http://example.com:3000000',
  ]) {
    await expect(validator['validate'](data)).resolves.toStrictEqual({
      errors: ['：必须是URL格式'],
    });
  }
});

test('扩展协议', async () => {
  const validator = new UrlValidator().scheme(['http', 'https', 'abc']);
  await expect(validator['validate']('abc://baidu.com')).resolves.toStrictEqual(
    ValidateResult.accept('abc://baidu.com'),
  );
  await expect(validator['validate']('ftp://baidu.com')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：URL包含不支持的协议：ftp",
      ],
    }
  `);
});

test('获取文档', () => {
  expect(new UrlValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "example": "https://example.com/path/to?id=1",
      "format": "uri",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
});
