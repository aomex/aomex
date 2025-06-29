import { expect, test } from 'vitest';
import { MongoObjectIdValidator } from '../../src';
import { ValidateResult } from '@aomex/common';
import { mongo } from 'mongoose';

test('检测objectid类型', async () => {
  const validator = new MongoObjectIdValidator();
  const value = mongo.ObjectId.createFromHexString('67e4c72dd163c5dbf922b752');
  await expect(validator['validate'](value)).resolves.toStrictEqual(
    ValidateResult.accept(value),
  );
});

test('非objectid类型', async () => {
  const validator = new MongoObjectIdValidator();
  await expect(validator['validate']('abc', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须是 ObjectId 类型",
      ],
    }
  `);
});

test('默认值传入字符串自动转为objectid', async () => {
  const defaultValue = new MongoObjectIdValidator().default('67e4c72dd163c5dbf922b752')[
    'config'
  ].defaultValue;
  expect(defaultValue).toBeInstanceOf(mongo.ObjectId);
  expect(defaultValue).toMatchInlineSnapshot(`"67e4c72dd163c5dbf922b752"`);
});

test('获取文档', () => {
  expect(new MongoObjectIdValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "type": "string",
    }
  `);
  expect(new MongoObjectIdValidator().default('67e4c72dd163c5dbf922b752')['toDocument']())
    .toMatchInlineSnapshot(`
      {
        "default": "67e4c72dd163c5dbf922b752",
        "type": "string",
      }
    `);
});
