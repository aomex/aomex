import { expect, test } from 'vitest';
import { ObjectValidator, rule, ValidateResult } from '../../../src';
import { describe } from 'node:test';

describe('链式调用返回新的实例', () => {
  const validator = new ObjectValidator();

  test('parseFromString', () => {
    const v1 = validator.parseFromString();
    expect(v1).toBeInstanceOf(ObjectValidator);
    expect(v1).not.toBe(validator);
  });

  test('additional', () => {
    const v1 = validator.additional();
    expect(v1).toBeInstanceOf(ObjectValidator);
    expect(v1).not.toBe(validator);
  });
});

test('返回副本', async () => {
  const validator = new ObjectValidator();
  const data = { key: 'value' };
  const result = await validator['validate'](data);
  // @ts-expect-error
  expect(result['data']).toStrictEqual(data);
  // @ts-expect-error
  expect(result['data']).not.toBe(data);
});

test('提供属性验证器后，仅保留指定部分', async () => {
  const validator = new ObjectValidator({
    data: new ObjectValidator(),
  });
  const result = await validator['validate']({ data: {}, key: 'value' });
  expect(result).toStrictEqual(ValidateResult.accept({ data: {} }));
});

test('属性验证失败报错', async () => {
  const validator = new ObjectValidator({
    data: new ObjectValidator(),
  });
  const result = await validator['validate'](
    { data: 0, key: 'value' },
    'path_1',
    'path_1',
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "errors": [
        "path_1.data必须是对象类型",
      ],
    }
  `);
});

describe('解析字符串', () => {
  test('非严格模式，自动从字符串中恢复', async () => {
    const validator = new ObjectValidator();
    const data = { key: 'value' };
    const result = await validator['validate'](JSON.stringify(data));
    expect(result).toStrictEqual(ValidateResult.accept(data));
  });

  test('非法字符串', async () => {
    const validator = new ObjectValidator();
    const result1 = await validator['validate']('abc', '', 'LABEL');
    expect(result1).toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL必须是对象类型",
        ],
      }
    `);
    const result2 = await validator['validate'](JSON.stringify('abc'), '', 'LABEL');
    expect(result2).toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL必须是对象类型",
        ],
      }
    `);
  });

  test('严格模式，默认不从字符串恢复', async () => {
    const validator = new ObjectValidator().strict();
    const data = { key: 'value' };
    const result = await validator['validate'](JSON.stringify(data), '', 'LABEL');
    expect(result).toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL必须是对象类型",
        ],
      }
    `);
  });

  test('严格模式，允许手动指定从字符串恢复', async () => {
    const validator = new ObjectValidator().strict().parseFromString();
    const data = { key: 'value' };
    const result = await validator['validate'](JSON.stringify(data));
    expect(result).toStrictEqual(ValidateResult.accept(data));
  });
});

describe('保留属性', () => {
  test('无其他验证器时保留所有剩余文档', async () => {
    const validator = new ObjectValidator().additional();
    const data = { foo: 'foo', bar: 123, baz: true, test: '456' };
    const result = await validator['validate'](data);
    expect(result).toStrictEqual(ValidateResult.accept(data));
  });

  test('无其他验证器时保留所有满足验证器的剩余文档', async () => {
    const validator = new ObjectValidator().additional({
      value: rule.anyOf([rule.string(), rule.number()]),
    });
    const data = { foo: 'foo', bar: 123, baz: true, test: '456' };
    const result = await validator['validate'](data);
    expect(result).toStrictEqual(
      ValidateResult.accept({ foo: 'foo', bar: 123, test: 456 }),
    );
  });

  test('有其他验证器时保留所有剩余文档', async () => {
    const validator = new ObjectValidator({ foo: rule.string() }).additional();
    const data = { foo: 'foo', bar: 123, baz: true, test: '456' };
    const result = await validator['validate'](data);
    expect(result).toStrictEqual(ValidateResult.accept(data));
  });

  test('有其他验证器时保留所有满足验证器的剩余文档', async () => {
    const validator = new ObjectValidator({ test: rule.string() }).additional({
      value: rule.boolean(),
    });
    const data = { foo: 'foo', bar: 123, baz: true, test: '456' };
    const result = await validator['validate'](data);
    expect(result).toStrictEqual(ValidateResult.accept({ baz: true, test: '456' }));
  });

  test('满足key规则', async () => {
    const validator = new ObjectValidator().additional({
      key: /^ba/,
    });
    const data = { foo: 'foo', bar: 123, baz: true, test: '456' };
    const result = await validator['validate'](data);
    expect(result).toStrictEqual(ValidateResult.accept({ bar: 123, baz: true }));
  });

  test('满足key和value规则', async () => {
    const validator = new ObjectValidator().additional({
      key: /^ba/,
      value: rule.boolean(),
    });
    const data = { foo: 'foo', bar: 123, baz: true, test: '456' };
    const result = await validator['validate'](data);
    expect(result).toStrictEqual(ValidateResult.accept({ baz: true }));
  });
});

test('获取文档', () => {
  expect(new ObjectValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "additionalProperties": true,
      "properties": undefined,
      "required": undefined,
      "type": "object",
    }
  `);

  expect(
    new ObjectValidator({
      my_key1: new ObjectValidator(),
      my_key2: new ObjectValidator().optional(),
    })
      .additional()
      ['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "additionalProperties": true,
      "properties": {
        "my_key1": {
          "additionalProperties": true,
          "type": "object",
        },
        "my_key2": {
          "additionalProperties": true,
          "type": "object",
        },
      },
      "required": [
        "my_key1",
      ],
      "type": "object",
    }
  `);

  expect(
    new ObjectValidator({
      my_key1: new ObjectValidator(),
    })
      .additional({ value: rule.int().max(1200) })
      ['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "additionalProperties": {
        "exclusiveMaximum": false,
        "maximum": 1200,
        "type": "integer",
      },
      "properties": {
        "my_key1": {
          "additionalProperties": true,
          "type": "object",
        },
      },
      "required": [
        "my_key1",
      ],
      "type": "object",
    }
  `);
});
