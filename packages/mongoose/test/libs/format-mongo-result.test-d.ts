import { mongo } from 'mongoose';
import { expectType, type TypeEqual } from 'ts-expect';
import { defineMongooseModel, formatMongoResult } from '../../src';
import { rule } from '@aomex/common';

// 数组对象
{
  const result = formatMongoResult([
    { _id: '1', name: 'foo', bar: mongo.Decimal128.fromString('123') },
  ]);
  expectType<string>(result[0]!.id);
  expectType<string>(result[0]!.bar);
  expectType<string>(result[0]!.name);
  // @ts-expect-error
  result[0]!._id;
  // @ts-expect-error
  result[0]!.__v;
}

// 对象
{
  const result = formatMongoResult({
    _id: '1',
    name: 'foo',
    bar: mongo.Decimal128.fromString('123'),
  });
  expectType<string>(result.id);
  expectType<string>(result.bar);
  expectType<string>(result.name);
  // @ts-expect-error
  result._id;
  // @ts-expect-error
  result.__v;
}

// nullable对象
{
  let data!: object | null;
  const result = formatMongoResult(data);
  expectType<object | null>(result);
}

// nullable
{
  const result = formatMongoResult(null);
  expectType<null>(result);
}

// 文档
{
  const model = defineMongooseModel('foo', {
    schemas: {
      hello: rule.string(),
    },
    timestamps: true,
  });
  const result = formatMongoResult((await model.findOne())!);
  result.hello;
}

// 数组文档
{
  const model = defineMongooseModel('foo', {
    schemas: {
      hello: rule.string(),
    },
    timestamps: true,
  });
  const result = formatMongoResult(await model.find());
  type ID = (typeof result)[number]['id'];
  expectType<TypeEqual<string, ID>>(true);
  result[0]!.hello;
}

// 查询对象lean()
{
  const model = defineMongooseModel('foo', {
    schemas: {
      hello: rule.string(),
    },
    timestamps: true,
  });
  const result = formatMongoResult((await model.findOne().lean())!);
  type ID = (typeof result)['id'];
  expectType<TypeEqual<string, ID>>(true);
  result.hello;
}

// 默认不删除多余属性
{
  const result = formatMongoResult({
    _id: '1',
    name: 'foo',
    bar: mongo.Decimal128.fromString('123'),
    createdAt: new Date(),
    updatedAt: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    __v: 1,
  });

  expectType<
    TypeEqual<
      typeof result,
      {
        name: string;
        bar: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        created_at: Date;
        updated_at: Date;
      }
    >
  >(true);
}

// 删除多余属性
{
  const result = formatMongoResult(
    {
      _id: '1',
      name: 'foo',
      bar: mongo.Decimal128.fromString('123'),
      createdAt: new Date(),
      updatedAt: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      __v: 1,
    },
    true,
  );

  expectType<TypeEqual<typeof result, { name: string; bar: string }>>(true);
}
