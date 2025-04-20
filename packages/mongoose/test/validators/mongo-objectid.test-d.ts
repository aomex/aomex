import { type TypeEqual, expectType } from 'ts-expect';
import { MongoObjectIdValidator as TargetValidator } from '../../src';
import type { TransformedValidator, Validator } from '@aomex/common';
import { mongo } from 'mongoose';

type DefaultType = mongo.ObjectId;
const validator = new TargetValidator();

// 可选
{
  const v = validator.optional();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | undefined, Validator.Infer<typeof v>>>(true);
}

// nullable
{
  const v = validator.nullable();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | null, Validator.Infer<typeof v>>>(true);
}

// 默认值 string
{
  const v = validator.optional().default('123');
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 默认值 decimal
{
  const v = validator.optional().default(mongo.ObjectId.createFromHexString('123'));
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 转换函数
{
  const v = validator.transform(async (data) => {
    expectType<TypeEqual<DefaultType, typeof data>>(true);
    return '';
  });
  expectType<TransformedValidator<string>>(v);
  expectType<TypeEqual<string, Validator.Infer<typeof v>>>(true);
}

// 文档
{
  const v = validator.docs({ title: '' });
  expectType<TargetValidator<DefaultType>>(v);
}
