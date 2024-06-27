import { expect, test } from 'vitest';
import { ObjectValidator, magistrate } from '../../../src';
import { describe } from 'node:test';

test('返回副本', async () => {
  const validator = new ObjectValidator();
  const data = { key: 'value' };
  const result = await validator['validate'](data);
  // @ts-expect-error
  expect(result['ok']).toStrictEqual(data);
  // @ts-expect-error
  expect(result['ok']).not.toBe(data);
});

test('提供属性验证器后，仅保留指定部分', async () => {
  const validator = new ObjectValidator({
    data: new ObjectValidator(),
  });
  const result = await validator['validate']({ data: {}, key: 'value' });
  expect(result).toStrictEqual(magistrate.ok({ data: {} }));
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
        "path_1.data：必须是对象类型",
      ],
    }
  `);
});

describe('解析字符串', () => {
  test('返回新的实例', () => {
    const validator = new ObjectValidator();
    const v1 = validator.parseFromString();
    expect(v1).toBeInstanceOf(ObjectValidator);
    expect(v1).not.toBe(validator);
  });

  test('非严格模式，自动从字符串中恢复', async () => {
    const validator = new ObjectValidator();
    const data = { key: 'value' };
    const result = await validator['validate'](JSON.stringify(data));
    expect(result).toStrictEqual(magistrate.ok(data));
  });

  test('非法字符串', async () => {
    const validator = new ObjectValidator();
    const result1 = await validator['validate']('abc');
    expect(result1).toMatchInlineSnapshot(`
      {
        "errors": [
          "：必须是对象类型",
        ],
      }
    `);
    const result2 = await validator['validate'](JSON.stringify('abc'));
    expect(result2).toMatchInlineSnapshot(`
      {
        "errors": [
          "：必须是对象类型",
        ],
      }
    `);
  });

  test('严格模式，默认不从字符串恢复', async () => {
    const validator = new ObjectValidator().strict();
    const data = { key: 'value' };
    const result = await validator['validate'](JSON.stringify(data));
    expect(result).toMatchInlineSnapshot(`
      {
        "errors": [
          "：必须是对象类型",
        ],
      }
    `);
  });

  test('严格模式，允许手动指定从字符串恢复', async () => {
    const validator = new ObjectValidator().strict().parseFromString();
    const data = { key: 'value' };
    const result = await validator['validate'](JSON.stringify(data));
    expect(result).toStrictEqual(magistrate.ok(data));
  });
});

test('获取文档', () => {
  expect(new ObjectValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "properties": undefined,
      "required": undefined,
      "type": "object",
    }
  `);

  expect(
    new ObjectValidator({
      my_key1: new ObjectValidator(),
      my_key2: new ObjectValidator().optional(),
    })['toDocument'](),
  ).toMatchInlineSnapshot(`
    {
      "properties": {
        "my_key1": {
          "type": "object",
        },
        "my_key2": {
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
