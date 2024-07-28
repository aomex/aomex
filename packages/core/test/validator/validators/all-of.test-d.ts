import { type TypeEqual, expectType } from 'ts-expect';
import {
  AllOfValidator as TargetValidator,
  Validator,
  type TransformedValidator,
  BigIntValidator,
} from '../../../src';

type DefaultType = bigint;
const validator = new TargetValidator<bigint>([
  new BigIntValidator(),
  new BigIntValidator(),
]);

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
