import { type TypeEqual, expectType } from 'ts-expect';
import Decimal from 'decimal.js';
import {
  DecimalValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = Decimal;
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
  const v = validator.optional().default('10.5');
  expectType<TargetValidator<any>>(v);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 默认值：number
{
  const v = validator.optional().default(10.5);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 默认值：Decimal
{
  const v = validator.optional().default(new Decimal('10.5'));
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 严格模式
{
  const v = validator.strict();
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

// 最小值
{
  const v = validator.min(100);
  expectType<TargetValidator<any>>(v);
  const v2 = validator.min('100');
  expectType<TargetValidator<any>>(v2);
  const v3 = validator.min(new Decimal(100));
  expectType<TargetValidator<any>>(v3);
}

// 最大值
{
  const v = validator.max(100);
  expectType<TargetValidator<any>>(v);
  const v2 = validator.max('100');
  expectType<TargetValidator<any>>(v2);
  const v3 = validator.max(new Decimal(100));
  expectType<TargetValidator<any>>(v3);
}
