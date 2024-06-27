import { type TypeEqual, expectType } from 'ts-expect';
import {
  DateTimeValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = Date;
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
  expectType<TargetValidator<DefaultType | null>>(v);
  expectType<TypeEqual<DefaultType | null, Validator.Infer<typeof v>>>(true);
}

// 默认值
{
  const v = validator.optional().default(new Date());
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

// 最小值
{
  const v = validator.min(() => new Date());
  expectType<TargetValidator<DefaultType>>(v);
}

// 最大值
{
  const v = validator.max(() => new Date());
  expectType<TargetValidator<DefaultType>>(v);
}

// 解析时间戳
{
  const v = validator.parseFromTimestamp();
  expectType<TargetValidator<DefaultType>>(v);
}
