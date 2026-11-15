import { type TypeEqual, expectType } from 'ts-expect';
import {
  EnumValidator as TargetValidator,
  Validator,
  type TransformedValidator,
  type EnumLikeValues,
  enumLikeToRanges,
  rule,
} from '../../../src';

type DefaultType = 'a' | 1 | 2 | true | false;
const validator = new TargetValidator(['a', 1, 2, true, false]);

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
  const withRequired = v.required();
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof withRequired>>>(true);
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

// EnumLikeValues：TS enum 与枚举成员双向兼容；普通对象为字面量联合
{
  enum Color {
    Red = 'red',
    Blue = 'blue',
  }
  type ColorVals = EnumLikeValues<typeof Color>;
  const colorVal: ColorVals = Color.Red;
  const colorBack: Color = colorVal;
  expectType<ColorVals>(Color.Blue);
  expectType<Color>(colorBack);
  // @ts-expect-error
  const _colorWrong: ColorVals = 'red';

  enum Status {
    Off = 0,
    On = 1,
  }
  type StatusVals = EnumLikeValues<typeof Status>;
  const statusVal: StatusVals = Status.On;
  const statusBack: Status = statusVal;
  expectType<StatusVals>(Status.Off);
  expectType<Status>(statusBack);

  const Role = { Admin: 'admin', User: 'user' } as const;
  expectType<TypeEqual<'admin' | 'user', EnumLikeValues<typeof Role>>>(true);

  expectType<TypeEqual<(string | number)[], ReturnType<typeof enumLikeToRanges>>>(true);
}

// pick：白名单收窄（rest / 数组）；非法值应报错；保留 optional / nullable
{
  const base = new TargetValidator(['a', 'b', 'c', 1]);
  const byRest = base.pick('a', 1);
  expectType<TypeEqual<TargetValidator<'a' | 1>, typeof byRest>>(true);
  expectType<TypeEqual<'a' | 1, Validator.Infer<typeof byRest>>>(true);

  const byArr = base.pick(['b', 'c']);
  expectType<TypeEqual<TargetValidator<'b' | 'c'>, typeof byArr>>(true);

  // @ts-expect-error 不在枚举内
  base.pick('z');
  // @ts-expect-error
  base.pick(true);
  // @ts-expect-error
  base.pick(['z']);

  const optionalPicked = base.optional().pick('a');
  expectType<TypeEqual<'a' | undefined, Validator.Infer<typeof optionalPicked>>>(true);

  const nullablePicked = base.nullable().pick('b', 'c');
  expectType<TypeEqual<'b' | 'c' | null, Validator.Infer<typeof nullablePicked>>>(true);
}

// omit：黑名单收窄（rest / 数组）；非法值应报错；保留 optional / nullable
{
  const base = new TargetValidator(['a', 'b', 'c', 1]);
  const byRest = base.omit('c', 1);
  expectType<TypeEqual<TargetValidator<'a' | 'b'>, typeof byRest>>(true);
  expectType<TypeEqual<'a' | 'b', Validator.Infer<typeof byRest>>>(true);

  const byArr = base.omit(['a']);
  expectType<TypeEqual<TargetValidator<'b' | 'c' | 1>, typeof byArr>>(true);

  // @ts-expect-error 不在枚举内
  base.omit('z');
  // @ts-expect-error
  base.omit(['z']);

  const optionalOmitted = base.optional().omit('c');
  expectType<
    TypeEqual<'a' | 'b' | 1 | undefined, Validator.Infer<typeof optionalOmitted>>
  >(true);

  const nullableOmitted = base.nullable().omit('a', 'b');
  expectType<TypeEqual<'c' | 1 | null, Validator.Infer<typeof nullableOmitted>>>(true);
}

// pick/omit：枚举风格对象（as const）经 rule.enum 再收窄
{
  const Role = { Admin: 'admin', User: 'user', Guest: 'guest' } as const;
  const picked = rule.enum(Role).pick(Role.Admin, Role.User);
  expectType<TypeEqual<'admin' | 'user', Validator.Infer<typeof picked>>>(true);
  const omitted = rule.enum(Role).omit(Role.Guest);
  expectType<TypeEqual<'admin' | 'user', Validator.Infer<typeof omitted>>>(true);
}
