import { type TypeEqual, expectType } from 'ts-expect';
import {
  LiteralValidator as TargetValidator,
  Validator,
  type TransformedValidator,
  rule,
} from '../../../src';

// 字面量 Infer 收窄（含 0 / false / '' / null）
{
  const s = rule.literal('ok');
  expectType<TypeEqual<TargetValidator<'ok'>, typeof s>>(true);
  expectType<TypeEqual<'ok', Validator.Infer<typeof s>>>(true);

  const n = rule.literal(1);
  expectType<TypeEqual<TargetValidator<1>, typeof n>>(true);
  expectType<TypeEqual<1, Validator.Infer<typeof n>>>(true);

  const zero = rule.literal(0);
  expectType<TypeEqual<0, Validator.Infer<typeof zero>>>(true);
  expectType<TypeEqual<number, Validator.Infer<typeof zero>>>(false);

  const b = rule.literal(true);
  expectType<TypeEqual<TargetValidator<true>, typeof b>>(true);
  expectType<TypeEqual<true, Validator.Infer<typeof b>>>(true);

  const f = rule.literal(false);
  expectType<TypeEqual<false, Validator.Infer<typeof f>>>(true);
  expectType<TypeEqual<boolean, Validator.Infer<typeof f>>>(false);

  const nul = rule.literal(null);
  expectType<TypeEqual<TargetValidator<null>, typeof nul>>(true);
  expectType<TypeEqual<null, Validator.Infer<typeof nul>>>(true);

  const empty = rule.literal('');
  expectType<TypeEqual<'', Validator.Infer<typeof empty>>>(true);
  expectType<TypeEqual<string, Validator.Infer<typeof empty>>>(false);
}

// 可选
{
  const v = rule.literal('a').optional();
  expectType<TypeEqual<'a' | undefined, Validator.Infer<typeof v>>>(true);

  const nullOptional = rule.literal(null).optional();
  expectType<TypeEqual<null | undefined, Validator.Infer<typeof nullOptional>>>(true);
}

// 必填（optional 的反向）
{
  const v = rule.literal('a').optional().required();
  expectType<TypeEqual<'a', Validator.Infer<typeof v>>>(true);
}

// nullable
{
  const v = rule.literal('a').nullable();
  expectType<TypeEqual<'a' | null, Validator.Infer<typeof v>>>(true);

  // literal(null) 本身已是 null
  const nul = rule.literal(null).nullable();
  expectType<TypeEqual<null, Validator.Infer<typeof nul>>>(true);
}

// optional + nullable
{
  const v = rule.literal(0).optional().nullable();
  expectType<TypeEqual<0 | undefined | null, Validator.Infer<typeof v>>>(true);
}

// 默认值
{
  const v = rule.literal('a').default('a');
  expectType<TypeEqual<'a', Validator.Infer<typeof v>>>(true);
  // @ts-expect-error
  rule.literal('a').default('b');
  // @ts-expect-error
  rule.literal(0).default(1);
  const withFn = rule.literal(false).default(() => false as const);
  expectType<TypeEqual<false, Validator.Infer<typeof withFn>>>(true);
}

// 转换函数
{
  const v = rule.literal(1).transform(async (data) => {
    expectType<TypeEqual<1, typeof data>>(true);
    return String(data);
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
  const v = rule.literal(false).docs({ title: '' });
  expectType<TargetValidator<any>>(v);
}

// 非法入参
{
  // @ts-expect-error
  rule.literal(undefined);
  // @ts-expect-error
  rule.literal({});
  // @ts-expect-error
  rule.literal([]);
  // @ts-expect-error
  rule.literal(1n);
  // @ts-expect-error
  rule.literal(Symbol('x'));
  // @ts-expect-error 不接受多值数组（请用 enum）
  rule.literal(['a', 'b']);
}
