import { describe, expect, test } from 'vitest';
import { MockStringValidator } from '../../mock/mock-string-validator';
import { ValidateResult } from '../../../src';

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
      ValidateResult.accept('0123456789'),
    );
    await expect(validator['validate']('0123456', '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL字符串长度不合法",
        ],
      }
    `);
  });

  test('最小长度', async () => {
    const validator = new MockStringValidator()['length']({ min: 5 });
    await expect(validator['validate']('0123456')).resolves.toStrictEqual(
      ValidateResult.accept('0123456'),
    );
    await expect(validator['validate']('01234')).resolves.toStrictEqual(
      ValidateResult.accept('01234'),
    );
    await expect(validator['validate']('0123', '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL字符串长度不合法",
        ],
      }
    `);
  });

  test('最大长度', async () => {
    const validator = new MockStringValidator()['length']({ max: 5 });
    await expect(validator['validate']('0123')).resolves.toStrictEqual(
      ValidateResult.accept('0123'),
    );
    await expect(validator['validate']('01234')).resolves.toStrictEqual(
      ValidateResult.accept('01234'),
    );
    await expect(validator['validate']('0123456', '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL字符串长度不合法",
        ],
      }
    `);
  });

  test('长度区间', async () => {
    const validator = new MockStringValidator()['length']({ min: 3, max: 6 });
    await expect(validator['validate']('01', '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL字符串长度不合法",
        ],
      }
    `);
    await expect(validator['validate']('01234')).resolves.toStrictEqual(
      ValidateResult.accept('01234'),
    );
    await expect(validator['validate']('0123456', '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL字符串长度不合法",
        ],
      }
    `);
  });
});

test('只允许字符串', async () => {
  const validator = new MockStringValidator();
  for (const data of [1, {}, 1n, []]) {
    await expect(validator['validate'](data, '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL必须是字符串类型'],
    });
  }
});

test('空字符串是空值', async () => {
  const validator = new MockStringValidator();
  await expect(validator['validate']('', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必填",
      ],
    }
  `);
});

test('去除两边空格', async () => {
  const validator = new MockStringValidator()['trim']();
  await expect(validator['validate']('   ', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必填",
      ],
    }
  `);
  await expect(validator['validate'](' a  ')).resolves.toStrictEqual(
    ValidateResult.accept('a'),
  );
});

test('匹配格式', async () => {
  const validator = new MockStringValidator()['match'](/abc/);
  await expect(validator['validate']('abd', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL字符串未匹配到规则",
      ],
    }
  `);
  await expect(validator['validate']('abc')).resolves.toStrictEqual(
    ValidateResult.accept('abc'),
  );
});
