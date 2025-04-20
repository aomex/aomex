import { expect, test } from 'vitest';
import { MongoDecimal128Validator } from '../../src';
import { ValidateResult } from '@aomex/common';
import { mongo } from 'mongoose';

test('检测decimal类型', async () => {
  const validator = new MongoDecimal128Validator();
  const value = mongo.Decimal128.fromString('123');
  await expect(validator['validate'](value)).resolves.toStrictEqual(
    ValidateResult.accept(value),
  );
});

test('非decimal类型', async () => {
  const validator = new MongoDecimal128Validator();
  await expect(validator['validate']('abc')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是 Decimal128 类型",
      ],
    }
  `);
});

test('默认值传入数字或者字符串自动转为decimal', async () => {
  expect(new MongoDecimal128Validator().default('0')['config'].defaultValue)
    .toMatchInlineSnapshot(`
    {
      "$numberDecimal": "0",
    }
  `);

  expect(new MongoDecimal128Validator().default(123)['config'].defaultValue)
    .toMatchInlineSnapshot(`
    {
      "$numberDecimal": "123",
    }
  `);
});

test('获取文档', () => {
  expect(new MongoDecimal128Validator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "type": "string",
    }
  `);
  expect(new MongoDecimal128Validator().default('0')['toDocument']())
    .toMatchInlineSnapshot(`
      {
        "default": "0",
        "type": "string",
      }
    `);
});
