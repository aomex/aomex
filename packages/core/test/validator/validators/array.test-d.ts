import { type TypeEqual, expectType } from 'ts-expect';
import {
  ArrayValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = unknown[];
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

// 默认值
{
  const v = validator.optional().default([]);
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

// 强制转换
{
  validator.forceToArray('separator');
  validator.forceToArray('block');
  // @ts-expect-error
  validator.forceToArray('block', '-');

  const v1 = validator.forceToArray('separator', '-');
  expectType<TargetValidator<DefaultType>>(v1);
  const v2 = validator.forceToArray('block');
  expectType<TargetValidator<DefaultType>>(v2);
}

// 长度
{
  const v1 = validator.length(2);
  expectType<TargetValidator<DefaultType>>(v1);
  const v2 = validator.length({ min: 2 });
  expectType<TargetValidator<DefaultType>>(v2);
  const v3 = validator.length({ max: 3, min: 2 });
  expectType<TargetValidator<DefaultType>>(v3);
}
