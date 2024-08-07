import { type TypeEqual, expectType } from 'ts-expect';
import {
  UuidValidator as TargetValidator,
  Validator,
  type TransformedValidator,
  UuidValidator,
} from '../../../src';

type DefaultType = string;
const validator = new TargetValidator(['v4']);

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

// 版本
{
  new UuidValidator(['v1']);
  new UuidValidator(['v2']);
  new UuidValidator(['v3']);
  new UuidValidator(['v4']);
  new UuidValidator(['v5']);
  new UuidValidator(['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8']);
  // @ts-expect-error
  new UuidValidator(['v16']);
  // @ts-expect-error
  new UuidValidator(['1']);
  // @ts-expect-error
  new UuidValidator(1);
}
