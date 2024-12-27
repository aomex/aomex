import { type TypeEqual, expectType } from 'ts-expect';
import {
  OneOfValidator as TargetValidator,
  Validator,
  type TransformedValidator,
  StringValidator,
  NumberValidator,
} from '../../../src';

type DefaultType = bigint;
const validator = new TargetValidator<DefaultType>([
  new StringValidator(),
  new NumberValidator(),
]);

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
