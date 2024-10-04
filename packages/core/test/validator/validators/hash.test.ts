import { expect, test } from 'vitest';
import { HashValidator, ValidateResult } from '../../../src';

test('md5', async () => {
  const validator = new HashValidator('md5');
  await expect(
    validator['validate']('b2a902e0e31cee64611271fe622b18c3'),
  ).resolves.toStrictEqual(ValidateResult.accept('b2a902e0e31cee64611271fe622b18c3'));
});

test('长度不符', async () => {
  const validator = new HashValidator('md5');
  await expect(validator['validate']('b2a902e0e31cee64611271fe622b1', '')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是哈希格式",
      ],
    }
  `);
});

test('错误的哈希算法', () => {
  // @ts-expect-error
  expect(() => new HashValidator('md6')).toThrowError();
});

test('获取文档', () => {
  expect(new HashValidator('sha1')['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "sha1",
      "maxLength": 40,
      "minLength": 40,
      "pattern": undefined,
      "type": "string",
    }
  `);
});
