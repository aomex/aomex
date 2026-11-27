import { expectType, type TypeEqual } from 'ts-expect';
import { TupleValidator, Validator, rule, schema } from '../../../src';

// 固定 tuple 保留元素顺序与长度，并拒绝错误位置类型和非法规则 token。
{
  const tuple = rule.tuple([rule.string(), rule.number()]);
  expectType<TypeEqual<TupleValidator<[string, number]>, typeof tuple>>(true);
  expectType<TypeEqual<[string, number], Validator.Infer<typeof tuple>>>(true);

  const valid: Validator.Infer<typeof tuple> = ['value', 1];
  // @ts-expect-error 元素位置类型不匹配
  const invalid: Validator.Infer<typeof tuple> = [1, 'value'];
  // @ts-expect-error 元组长度固定
  const tooShort: Validator.Infer<typeof tuple> = ['value'];
  // @ts-expect-error 元组只能接收数组
  rule.tuple([1]);
  void valid;
  void invalid;
  void tooShort;
}

// rest tuple 推导固定前缀与可重复尾项，并检查缺少前缀或尾项类型错误。
{
  const tuple = rule.tuple([rule.string(), rule.number()]).rest(rule.boolean());
  expectType<TypeEqual<[string, number, ...boolean[]], Validator.Infer<typeof tuple>>>(
    true,
  );

  const valid: Validator.Infer<typeof tuple> = ['value', 1, true, false];
  // @ts-expect-error 固定前缀不能缺少
  const tooShort: Validator.Infer<typeof tuple> = ['value'];
  // @ts-expect-error rest 项类型固定为 boolean
  const invalidRest: Validator.Infer<typeof tuple> = ['value', 1, 'true'];
  const replaced = tuple.rest(rule.string());
  expectType<TypeEqual<[string, number, ...string[]], Validator.Infer<typeof replaced>>>(
    true,
  );
  void valid;
  void tooShort;
  void invalidRest;
}

// rest 可以覆盖已设尾项，也能在整个 tuple optional 前后设置并保留可缺省类型。
{
  const optionalFirst = rule.tuple([rule.string()]).optional().rest(rule.number());
  expectType<
    TypeEqual<[string, ...number[]] | undefined, Validator.Infer<typeof optionalFirst>>
  >(true);

  const optionalLast = rule.tuple([rule.string()]).rest(rule.number()).optional();
  expectType<
    TypeEqual<[string, ...number[]] | undefined, Validator.Infer<typeof optionalLast>>
  >(true);

  const replaced = optionalLast.rest(rule.boolean());
  expectType<
    TypeEqual<[string, ...boolean[]] | undefined, Validator.Infer<typeof replaced>>
  >(true);
}

// rest 支持字段表，并在 nullable/default 包装前后保持 Infer 语义。
{
  const objectRest = rule.tuple([rule.string()]).rest({ id: rule.int() });
  type ObjectRest = [string, ...{ id: number }[]];
  const objectRestValue: Validator.Infer<typeof objectRest> = ['head', { id: 1 }];
  const expectedObjectRest: ObjectRest = objectRestValue;
  const reverseObjectRest: Validator.Infer<typeof objectRest> = expectedObjectRest;
  // @ts-expect-error rest 字段表仍校验嵌套属性
  const invalidObjectRest: Validator.Infer<typeof objectRest> = ['head', { id: '1' }];
  void reverseObjectRest;
  void invalidObjectRest;

  const nullable = rule.tuple([rule.string()]).nullable().rest(rule.number());
  type NullableTuple = [string, ...number[]] | null;
  const nullableValue: Validator.Infer<typeof nullable> = ['value', 1];
  const expectedNullable: NullableTuple = nullableValue;
  const reverseNullable: Validator.Infer<typeof nullable> = expectedNullable;
  // @ts-expect-error nullable rest 项仍必须是 number
  const invalidNullable: Validator.Infer<typeof nullable> = ['value', '1'];
  void reverseNullable;
  void invalidNullable;

  const defaulted = rule.tuple([rule.string()]).rest(rule.number()).default(['value']);
  expectType<TypeEqual<[string, ...number[]], Validator.Infer<typeof defaulted>>>(true);
}

// tuple 元素可以是 optional validator 或裸对象字段表，并保留各自的推导类型。
{
  const tuple = rule.tuple([rule.string().optional(), { id: rule.int() }]);
  const inferred: Validator.Infer<typeof tuple> = [undefined, { id: 1 }];
  const expected: [string | undefined, { id: number }] = inferred;
  const reverse: Validator.Infer<typeof tuple> = expected;
  // @ts-expect-error 元组位置类型不匹配
  const invalid: Validator.Infer<typeof tuple> = [undefined, { id: '1' }];
  void reverse;
  void invalid;
}

// tuple 元素支持 ValidatorSchema token，并按位置推导 schema 输出类型。
{
  const user = schema({ id: rule.int() });
  const tuple = rule.tuple([user, rule.boolean()]);
  expectType<TypeEqual<[{ id: number }, boolean], Validator.Infer<typeof tuple>>>(true);
}

// 空 tuple 推导为空的固定长度 tuple。
{
  const empty = rule.tuple([]);
  expectType<TypeEqual<[], Validator.Infer<typeof empty>>>(true);
}

// optional() 使整个 tuple 可缺省，而不是改变其元素数量。
{
  const tuple = rule.tuple([rule.string(), rule.number()]).optional();
  expectType<TypeEqual<[string, number] | undefined, Validator.Infer<typeof tuple>>>(
    true,
  );
}

// schema 字段、extend、partial/required 都保留 tuple rest 元组类型。
{
  const base = schema({
    args: rule.tuple([rule.string(), rule.number()]).rest(rule.boolean()),
    profile: {
      coords: rule.tuple([rule.number()]).rest(rule.string()),
    },
    label: rule.string().optional(),
  });
  type Base = {
    args: [string, number, ...boolean[]];
    profile: { coords: [number, ...string[]] };
  } & { label?: string | undefined };
  expectType<TypeEqual<Base, Validator.Infer<typeof base>>>(true);

  const extended = base.extend(
    schema({
      result: rule.tuple([rule.boolean()]).rest(rule.int()),
    }),
  );
  type Extended = Base & { result: [boolean, ...number[]] };
  const extendedValue: Validator.Infer<typeof extended> = {
    args: ['value', 1, true],
    profile: { coords: [1, 'x'] },
    result: [true, 1, 2],
  };
  const expectedExtended: Extended = extendedValue;
  const reverseExtended: Validator.Infer<typeof extended> = expectedExtended;
  const invalidExtended: Validator.Infer<typeof extended> = {
    args: ['value', 1],
    profile: { coords: [1] },
    // @ts-expect-error schema extend 后 rest 元素类型仍受约束
    result: [true, '1'],
  };
  void reverseExtended;
  void invalidExtended;

  const partial = base.partial('args');
  const partialValue: Validator.Infer<typeof partial> = {
    profile: { coords: [1, 'x'] },
    label: 'optional',
  };
  void partialValue;

  const required = partial.required('args');
  expectType<TypeEqual<Base, Validator.Infer<typeof required>>>(true);
}
