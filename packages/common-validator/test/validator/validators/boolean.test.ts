import { describe, expect, test } from 'vitest';
import { BooleanValidator, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new BooleanValidator();

  test('setTrueValues', () => {
    const v1 = validator.setTruthyValues([]);
    expect(v1).toBeInstanceOf(BooleanValidator);
    expect(v1).not.toBe(validator);
  });

  test('setFalseValues', () => {
    const v1 = validator.setFalsyValues([]);
    expect(v1).toBeInstanceOf(BooleanValidator);
    expect(v1).not.toBe(validator);
  });
});

test('测试真值', async () => {
  const validator = new BooleanValidator();
  for (const data of BooleanValidator['defaultTruthyValues']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(true),
    );
  }
});

test('测试假值', async () => {
  const validator = new BooleanValidator();
  for (const data of BooleanValidator['defaultFalsyValues']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(false),
    );
  }
});

test('不在范围内则报错', async () => {
  const validator = new BooleanValidator();
  await expect(validator['validate']('yes', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须是布尔类型",
      ],
    }
  `);
});

test('自定义范围', async () => {
  await expect(
    new BooleanValidator().setTruthyValues(['yes'])['validate']('yes'),
  ).resolves.toStrictEqual(ValidateResult.accept(true));
  await expect(
    new BooleanValidator().setFalsyValues(['yes'])['validate']('yes'),
  ).resolves.toStrictEqual(ValidateResult.accept(false));
});

test('获取文档', () => {
  expect(new BooleanValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "type": "boolean",
    }
  `);
});
