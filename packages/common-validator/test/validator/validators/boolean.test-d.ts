import { type TypeEqual, expectType } from 'ts-expect';
import {
  BooleanValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = boolean;
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
  const v = validator.optional().default(false);
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
  expectType<TargetValidator<any>>(v);
}

// 设置真值
{
  const v = validator.setTruthyValues(['1', 'yes']);
  expectType<TargetValidator<DefaultType>>(v);
}

// 设置假值
{
  const v = validator.setFalsyValues(['1', 'yes']);
  expectType<TargetValidator<DefaultType>>(v);
}
