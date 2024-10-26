import { type TypeEqual, expectType } from 'ts-expect';
import {
  StringValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = string;
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
  const v = validator.optional().default('abc');
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

// 长度
{
  const v1 = validator.length(2);
  expectType<TargetValidator<DefaultType>>(v1);
  const v2 = validator.length({ min: 2 });
  expectType<TargetValidator<DefaultType>>(v2);
  const v3 = validator.length({ max: 3, min: 2 });
  expectType<TargetValidator<DefaultType>>(v3);
}

// 修剪空格
{
  const v1 = validator.trim();
  expectType<TargetValidator<DefaultType>>(v1);
}

// 匹配正则
{
  const v1 = validator.match(/x/);
  expectType<TargetValidator<DefaultType>>(v1);
}

// 允许空字符串
{
  const v1 = validator.allowEmptyString();
  expectType<TargetValidator<DefaultType>>(v1);
}
