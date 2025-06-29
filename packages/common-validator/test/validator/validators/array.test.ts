import { ArrayValidator, ValidateResult } from '../../../src';
import { expect, test, describe } from 'vitest';

describe('链式调用返回新的实例', () => {
  const validator = new ArrayValidator();

  test('forceToArray', () => {
    const v1 = validator.forceToArray('block');
    expect(v1).toBeInstanceOf(ArrayValidator);
    expect(v1).not.toBe(validator);
  });

  test('length', () => {
    const v1 = validator.length(10);
    expect(v1).toBeInstanceOf(ArrayValidator);
    expect(v1).not.toBe(validator);
  });
});

test('未指定元素类型时，允许传入混合数组', async () => {
  const validator = new ArrayValidator();
  const data = [1, 'abc', {}];
  await expect(validator['validate'](data)).resolves.toStrictEqual(
    ValidateResult.accept(data),
  );
});

test('指定元素类型', async () => {
  const validator = new ArrayValidator(new ArrayValidator());
  const data = [1, 'abc', {}];
  await expect(validator['validate']([[], []])).resolves.toStrictEqual(
    ValidateResult.accept([[], []]),
  );
  await expect(validator['validate'](data, '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "0必须是数组类型",
        "1必须是数组类型",
        "2必须是数组类型",
      ],
    }
  `);
});

describe('强制转换', () => {
  test('允许分割字符串', async () => {
    const validator = new ArrayValidator().forceToArray('separator');
    await expect(validator['validate']('a,bcd,c')).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'bcd', 'c']),
    );
  });

  test('允许指定分割字符串', async () => {
    const validator = new ArrayValidator().forceToArray('separator', '-');
    await expect(validator['validate']('a,bcd-c')).resolves.toStrictEqual(
      ValidateResult.accept(['a,bcd', 'c']),
    );
  });

  test('允许强制把非数组转换为数组', async () => {
    const validator = new ArrayValidator().forceToArray('block');
    await expect(validator['validate']('a,bcd,c')).resolves.toStrictEqual(
      ValidateResult.accept(['a,bcd,c']),
    );
  });
});

describe('长度', () => {
  test('具体长度', async () => {
    const validator = new ArrayValidator().length(2);
    await expect(validator['validate'](['a', 'b'])).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'b']),
    );
    await expect(validator['validate'](['a', 'b', 'c'], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组长度不在指定范围内",
        ],
      }
    `);
  });

  test('最短长度', async () => {
    const validator = new ArrayValidator().length({ min: 2 });
    await expect(validator['validate'](['a', 'b'])).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'b']),
    );
    await expect(validator['validate'](['a', 'b', 'c'])).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'b', 'c']),
    );
    await expect(validator['validate'](['a'], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组长度不在指定范围内",
        ],
      }
    `);
  });

  test('最大长度', async () => {
    const validator = new ArrayValidator().length({ max: 2 });
    await expect(validator['validate'](['a'], '')).resolves.toStrictEqual(
      ValidateResult.accept(['a']),
    );
    await expect(validator['validate'](['a', 'b'])).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'b']),
    );
    await expect(validator['validate'](['a', 'b', 'c'], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组长度不在指定范围内",
        ],
      }
    `);
  });
});

test('获取文档', () => {
  expect(new ArrayValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "items": {},
      "maxItems": undefined,
      "minItems": undefined,
      "type": "array",
    }
  `);
  expect(
    new ArrayValidator(new ArrayValidator(new ArrayValidator()))
      .length({ min: 10, max: 22 })
      ['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "items": {
        "items": {
          "items": {},
          "type": "array",
        },
        "type": "array",
      },
      "maxItems": 22,
      "minItems": 10,
      "type": "array",
    }
  `);
});
