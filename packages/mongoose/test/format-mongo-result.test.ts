import { expect, test } from 'vitest';
import { defineMongooseModel, formatMongoResult } from '../src';
import { mongo } from 'mongoose';
import { rule } from '@aomex/common';

test('null', () => {
  const result = formatMongoResult(null);
  expect(result).toBeNull();
});

test('对象', () => {
  const result = formatMongoResult({ foo: '123', bar: 456 });
  expect(result).toMatchInlineSnapshot(`
    {
      "bar": 456,
      "foo": "123",
    }
  `);
});

test('数组', () => {
  const result = formatMongoResult([
    { foo: '123', bar: 456 },
    { foo: 'ijk', bar: 789 },
  ]);
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "bar": 456,
        "foo": "123",
      },
      {
        "bar": 789,
        "foo": "ijk",
      },
    ]
  `);
});

test('去掉时间戳和_id', () => {
  const schema = {
    _id: mongo.ObjectId.createFromHexString('67e4c72dd163c5dbf922b752'),
    createdAt: new Date('2025-04-05T14:48:37.381Z'),
    updatedAt: new Date('2025-04-05T14:48:37.381Z'),
    foo: 'abc',
    created_at: new Date('2025-04-05T14:48:37.381Z'),
    updated_at: new Date('2025-04-05T14:48:37.381Z'),
  };

  expect(formatMongoResult(schema, true)).toMatchInlineSnapshot(`
    {
      "foo": "abc",
    }
  `);

  expect(formatMongoResult(schema)).toMatchInlineSnapshot(`
    {
      "createdAt": 2025-04-05T14:48:37.381Z,
      "created_at": 2025-04-05T14:48:37.381Z,
      "foo": "abc",
      "id": "67e4c72dd163c5dbf922b752",
      "updatedAt": 2025-04-05T14:48:37.381Z,
      "updated_at": 2025-04-05T14:48:37.381Z,
    }
  `);
});

test('_id转id', () => {
  const result = formatMongoResult({
    _id: mongo.ObjectId.createFromHexString('67e4c72dd163c5dbf922b752'),
    foo: 'abc',
    created_at: new Date('2025-04-05T14:48:37.381Z'),
    updated_at: new Date('2025-04-05T14:48:37.381Z'),
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "created_at": 2025-04-05T14:48:37.381Z,
      "foo": "abc",
      "id": "67e4c72dd163c5dbf922b752",
      "updated_at": 2025-04-05T14:48:37.381Z,
    }
  `);
});

test('转换Decimal128', () => {
  const result = formatMongoResult({
    foo: 'abc',
    bar: mongo.Decimal128.fromString('1234'),
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "bar": "1234",
      "foo": "abc",
    }
  `);
});

test('转换ObjectId', () => {
  const result = formatMongoResult({
    foo: 'abc',
    bar: mongo.ObjectId.createFromHexString('67e4c72dd163c5dbf922b752'),
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "bar": "67e4c72dd163c5dbf922b752",
      "foo": "abc",
    }
  `);
});

test('可转换document文档', () => {
  const model = defineMongooseModel('user', {
    schemas: { nickname: rule.string(), age: rule.mongoDecimal128() },
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });
  const user = new model();
  user.nickname = 'foo';
  user.age = mongo.Decimal128.fromString('123');

  const result = formatMongoResult(user);
  expect(Object.keys(result)).toMatchInlineSnapshot(`
    [
      "id",
      "nickname",
      "age",
    ]
  `);
  Reflect.deleteProperty(result, 'id');
  expect(result).toMatchInlineSnapshot(`
    {
      "age": "123",
      "nickname": "foo",
    }
  `);
});
