import { type TypeEqual, expectType } from 'ts-expect';
import {
  StreamValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';
import type { Stream } from 'node:stream';

type DefaultType = Stream;
const validator = new TargetValidator();

// 可选
{
  const v = validator.optional();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | undefined, Validator.Infer<typeof v>>>(true);
}

// 必填（optional 的反向）
{
  const v = validator.optional().required();
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// nullable
{
  const v = validator.nullable();
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType | null, Validator.Infer<typeof v>>>(true);
}

// optional + nullable → required
{
  const v = validator.optional().nullable().required();
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
  // @ts-expect-error
  v.required();
  // @ts-expect-error
  v.optional();
}

// 文档
{
  const v = validator.docs({ title: '' });
  expectType<TargetValidator<DefaultType>>(v);
}
