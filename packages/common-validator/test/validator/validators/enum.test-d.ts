import { type TypeEqual, expectType } from 'ts-expect';
import {
  EnumValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = 'a' | 1 | 2 | true | false;
const validator = new TargetValidator(['a', 1, 2, true, false]);

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
  const v = validator.optional().default(2);
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);

  validator.default(true);
  validator.default(false);
  validator.default(1);
  validator.default(2);
  validator.default('a');
  // @ts-expect-error
  validator.default(5);
  // @ts-expect-error
  validator.default('b');
  // @ts-expect-error
  validator.default({});
}

// 严格模式
{
  const v = validator.strict();
  expectType<TargetValidator<DefaultType>>(v);
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
