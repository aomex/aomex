import { describe, expect, test } from 'vitest';
import { MockStringValidator } from '../../mock/mock-string-validator';
import { magistrate } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new MockStringValidator();

  test('trim', () => {
    const v1 = validator['trim']();
    expect(v1).toBeInstanceOf(MockStringValidator);
    expect(v1).not.toBe(validator);
  });

  test('match', () => {
    const v1 = validator['match'](/x/);
    expect(v1).toBeInstanceOf(MockStringValidator);
    expect(v1).not.toBe(validator);
  });

  test('length', () => {
    const v1 = validator['length'](10);
    expect(v1).toBeInstanceOf(MockStringValidator);
    expect(v1).not.toBe(validator);
  });
});

describe('长度', () => {
  test('具体长度', async () => {
    const validator = new MockStringValidator()['length'](10);
    await expect(validator['validate']('0123456789')).resolves.toStrictEqual(
      magistrate.ok('0123456789'),
    );
    await expect(validator['validate']('0123456')).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "：字符串长度不合法",
        ],
      }
    `);
  });

  test('最小长度', async () => {
    const validator = new MockStringValidator()['length']({ min: 5 });
    await expect(validator['validate']('0123456')).resolves.toStrictEqual(
      magistrate.ok('0123456'),
    );
    await expect(validator['validate']('01234')).resolves.toStrictEqual(
      magistrate.ok('01234'),
    );
    await expect(validator['validate']('0123')).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "：字符串长度不合法",
        ],
      }
    `);
  });

  test('最大长度', async () => {
    const validator = new MockStringValidator()['length']({ max: 5 });
    await expect(validator['validate']('0123')).resolves.toStrictEqual(
      magistrate.ok('0123'),
    );
    await expect(validator['validate']('01234')).resolves.toStrictEqual(
      magistrate.ok('01234'),
    );
    await expect(validator['validate']('0123456')).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "：字符串长度不合法",
        ],
      }
    `);
  });

  test('长度区间', async () => {
    const validator = new MockStringValidator()['length']({ min: 3, max: 6 });
    await expect(validator['validate']('01')).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "：字符串长度不合法",
        ],
      }
    `);
    await expect(validator['validate']('01234')).resolves.toStrictEqual(
      magistrate.ok('01234'),
    );
    await expect(validator['validate']('0123456')).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "：字符串长度不合法",
        ],
      }
    `);
  });
});

test('只允许字符串', async () => {
  const validator = new MockStringValidator();
  for (const data of [1, {}, 1n, []]) {
    await expect(validator['validate'](data)).resolves.toStrictEqual({
      errors: ['：必须是字符串类型'],
    });
  }
});

test('空字符串是空值', async () => {
  const validator = new MockStringValidator();
  await expect(validator['validate']('')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必填",
      ],
    }
  `);
});

test('去除两边空格', async () => {
  const validator = new MockStringValidator()['trim']();
  await expect(validator['validate']('   ')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必填",
      ],
    }
  `);
  await expect(validator['validate'](' a  ')).resolves.toStrictEqual(magistrate.ok('a'));
});

test('匹配格式', async () => {
  const validator = new MockStringValidator()['match'](/abc/);
  await expect(validator['validate']('abd')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：字符串未匹配到规则",
      ],
    }
  `);
  await expect(validator['validate']('abc')).resolves.toStrictEqual(magistrate.ok('abc'));
});
