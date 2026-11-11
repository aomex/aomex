import { type TypeEqual, expectType } from 'ts-expect';
import {
  ObjectValidator,
  Validator,
  toValidator,
  type ValidatorToken,
  schema,
  rule,
} from '../../../src';
import { MockValidator } from '../../mock/mock-validator';

// undefined
{
  const result = toValidator(undefined);
  expectType<TypeEqual<undefined, typeof result>>(true);

  // @ts-expect-error
  const token: ValidatorToken | undefined;
  toValidator(token);
}

// 验证器：返回类型放宽为 Validator
{
  const result = toValidator(new MockValidator());
  expectType<TypeEqual<Validator, typeof result>>(true);
  expectType<TypeEqual<MockValidator, typeof result>>(false);
}

// 字段表：返回类型放宽为 Validator（运行时是 ObjectValidator）
{
  const result = toValidator({
    key: rule.string(),
    count: rule.int().optional(),
  });
  expectType<TypeEqual<Validator, typeof result>>(true);
  expectType<
    TypeEqual<
      ObjectValidator<{ key: string } & { count?: number | undefined }>,
      typeof result
    >
  >(false);
}

// schema：toValidator 返回类型放宽为 Validator；精确 ObjectValidator 请用 rule.object(schema)
{
  const userSchema = schema({
    id: rule.int(),
    name: rule.string(),
  });
  const result = toValidator(userSchema);
  expectType<TypeEqual<Validator, typeof result>>(true);
  expectType<TypeEqual<ObjectValidator<{ id: number; name: string }>, typeof result>>(
    false,
  );

  const precise = rule.object(userSchema);
  expectType<TypeEqual<ObjectValidator<{ id: number; name: string }>, typeof precise>>(
    true,
  );
}

// ValidatorToken
{
  const userSchema = schema({
    id: rule.int(),
  });
  const result = toValidator(userSchema);
  expectType<TypeEqual<Validator, typeof result>>(true);
}

// 嵌套裸对象字段表：Infer 递归 + 交叉形态
{
  const token = {
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  };
  expectType<
    TypeEqual<
      { profile: { bio: string } & { age?: number | undefined } },
      Validator.Infer<typeof token>
    >
  >(true);
  expectType<
    TypeEqual<
      { profile: { bio: string; age: number | undefined } },
      Validator.Infer<typeof token>
    >
  >(false);

  const mixed = {
    id: rule.int(),
    name: rule.string().optional(),
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  };
  expectType<
    TypeEqual<
      { id: number; profile: { bio: string } & { age?: number | undefined } } & {
        name?: string | undefined;
      },
      Validator.Infer<typeof mixed>
    >
  >(true);

  // 赋值即断言嵌套字段表可作 ValidatorToken（递归类型不宜再用 TypeEqual 自比）
  const asToken: ValidatorToken = token;
  void asToken;
}

// 非法：类实例 / 内置对象 / 数组字面量不能当字段表或嵌套值
{
  class Foo {
    x = rule.string();
  }

  // @ts-expect-error Date
  const _date: ValidatorToken = { at: new Date() };
  // @ts-expect-error Map
  const _map: ValidatorToken = { m: new Map() };
  // @ts-expect-error RegExp
  const _re: ValidatorToken = { r: /x/ };
  // @ts-expect-error Buffer
  const _buf: ValidatorToken = { b: Buffer.alloc(0) };
  // @ts-expect-error 数组字面量
  const _arr: ValidatorToken = { list: [rule.string()] };
  // @ts-expect-error 类实例
  const _cls: ValidatorToken = { foo: new Foo() };

  // @ts-expect-error
  schema({ at: new Date() });
  // @ts-expect-error
  schema({ m: new Map() });
  // @ts-expect-error
  schema({ r: /x/ });
  // @ts-expect-error
  schema({ b: Buffer.alloc(0) });
  // @ts-expect-error
  schema({ list: [rule.string()] });
  // @ts-expect-error
  schema({ foo: new Foo() });

  // @ts-expect-error 嵌套位置同样拒绝
  rule.object({ profile: { at: new Date() } });
  // @ts-expect-error
  rule.array({ item: { m: new Map() } });
}
