import { ArrayValidator, ValidateResult, rule, toDocument } from '../../../src';
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

  test('unique', () => {
    const v1 = validator.unique();
    expect(v1).toBeInstanceOf(ArrayValidator);
    expect(v1).not.toBe(validator);

    const objects = rule.array(rule.object({ id: rule.number() }));
    const v2 = objects.unique('id');
    expect(v2).toBeInstanceOf(ArrayValidator);
    expect(v2).not.toBe(objects);

    const v3 = objects.unique((item) => item.id);
    expect(v3).toBeInstanceOf(ArrayValidator);
    expect(v3).not.toBe(objects);
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
        "0必须为数组",
        "1必须为数组",
        "2必须为数组",
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

describe('唯一', () => {
  test('整项唯一', async () => {
    const validator = rule.array(rule.string()).unique();
    await expect(validator['validate']([])).resolves.toStrictEqual(
      ValidateResult.accept([]),
    );
    await expect(validator['validate'](['a'])).resolves.toStrictEqual(
      ValidateResult.accept(['a']),
    );
    await expect(validator['validate'](['a', 'b'])).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'b']),
    );
    await expect(validator['validate'](['a', 'a'], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
  });

  test('整项唯一不做深比较', async () => {
    const validator = new ArrayValidator().unique();
    const a = { id: 1 };
    const b = { id: 1 };
    await expect(validator['validate']([a, b])).resolves.toStrictEqual(
      ValidateResult.accept([a, b]),
    );
    await expect(validator['validate']([a, a], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
  });

  test('按 key 唯一', async () => {
    const validator = rule
      .array(
        rule.object({
          id: rule.number(),
        }),
      )
      .unique('id');
    await expect(validator['validate']([{ id: 1 }, { id: 2 }])).resolves.toStrictEqual(
      ValidateResult.accept([{ id: 1 }, { id: 2 }]),
    );
    await expect(validator['validate']([{ id: 1 }, { id: 1 }], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
  });

  test('按函数唯一', async () => {
    const validator = rule
      .array(
        rule.object({
          id: rule.number(),
          name: rule.string(),
        }),
      )
      .unique((item) => item.id);
    await expect(
      validator['validate']([
        { id: 1, name: 'a' },
        { id: 2, name: 'a' },
      ]),
    ).resolves.toStrictEqual(
      ValidateResult.accept([
        { id: 1, name: 'a' },
        { id: 2, name: 'a' },
      ]),
    );
    await expect(
      validator['validate'](
        [
          { id: 1, name: 'a' },
          { id: 1, name: 'b' },
        ],
        '',
        'LABEL',
      ),
    ).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
  });

  test('按函数抽取嵌套字段', async () => {
    const validator = rule
      .array(
        rule.object({
          profile: rule.object({
            code: rule.string(),
          }),
        }),
      )
      .unique((item) => item.profile.code);
    await expect(
      validator['validate']([{ profile: { code: 'a' } }, { profile: { code: 'b' } }]),
    ).resolves.toStrictEqual(
      ValidateResult.accept([{ profile: { code: 'a' } }, { profile: { code: 'b' } }]),
    );
    await expect(
      validator['validate'](
        [{ profile: { code: 'a' } }, { profile: { code: 'a' } }],
        '',
        'LABEL',
      ),
    ).resolves.toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
  });

  test('SameValueZero：NaN 与 +0/-0', async () => {
    const anyItems = new ArrayValidator().unique();
    await expect(anyItems['validate']([NaN, NaN], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);

    const numbers = rule.array(rule.number()).unique();
    await expect(numbers['validate']([0, -0], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
    await expect(numbers['validate']([0, 1])).resolves.toStrictEqual(
      ValidateResult.accept([0, 1]),
    );
  });

  test('元素校验通过后再做唯一比较', async () => {
    const validator = rule.array(rule.number()).unique();
    await expect(validator['validate'](['1', '1'], '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
        ],
      }
    `);
    await expect(validator['validate'](['1', '2'])).resolves.toStrictEqual(
      ValidateResult.accept([1, 2]),
    );
  });

  test('元素校验失败时不继续检查唯一', async () => {
    const validator = rule.array(rule.number()).unique();
    await expect(validator['validate'](['a', 'a'], 'field', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL.0必须为数字",
          "LABEL.1必须为数字",
        ],
      }
    `);
  });

  test('forceToArray 后再检查唯一', async () => {
    const validator = rule.array(rule.string()).forceToArray('separator').unique();
    await expect(validator['validate']('a,b')).resolves.toStrictEqual(
      ValidateResult.accept(['a', 'b']),
    );
    await expect(validator['validate']('a,a', '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL数组元素不能重复",
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
      "uniqueItems": undefined,
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
      "uniqueItems": undefined,
    }
  `);
  expect(new ArrayValidator().unique()['toDocument']()).toMatchInlineSnapshot(`
    {
      "items": {},
      "maxItems": undefined,
      "minItems": undefined,
      "type": "array",
      "uniqueItems": true,
    }
  `);
  expect(
    rule
      .array(rule.object({ id: rule.number() }))
      .unique('id')
      ['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "items": {
        "additionalProperties": false,
        "properties": {
          "id": {
            "type": "number",
          },
        },
        "required": [
          "id",
        ],
        "type": "object",
      },
      "maxItems": undefined,
      "minItems": undefined,
      "type": "array",
      "uniqueItems": undefined,
    }
  `);
  expect(
    rule
      .array(rule.object({ id: rule.number() }))
      .unique((item) => item.id)
      ['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "items": {
        "additionalProperties": false,
        "properties": {
          "id": {
            "type": "number",
          },
        },
        "required": [
          "id",
        ],
        "type": "object",
      },
      "maxItems": undefined,
      "minItems": undefined,
      "type": "array",
      "uniqueItems": undefined,
    }
  `);
});

test('nullable 文档快照', () => {
  expect(toDocument(rule.array(rule.string()).nullable()).schema).toMatchInlineSnapshot(`
    {
      "items": {
        "type": "string",
      },
      "type": [
        "array",
        "null",
      ],
    }
  `);
});
