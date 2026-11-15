import { type TypeEqual, expectType } from 'ts-expect';
import { ValidateResult, rule, schema, validate } from '../../../src';

// 传参
{
  validate({}, {});
  validate(
    {},
    {
      test: rule.string(),
    },
  );
  validate({}, rule.number());
  validate({}, schema({ test: rule.string() }));
  validate(
    {},
    {},
    {
      errorFormatter(errors) {
        expectType<ValidateResult.Denied['errors']>(errors);
        return '';
      },
    },
  );
  validate({}, rule.string(), { throwOnError: true });
  validate({}, rule.string(), { throwOnError: false });
  validate({}, rule.string(), {
    throwOnError: false,
    // @ts-expect-error throwOnError: false 时不应传 errorFormatter
    errorFormatter: () => '',
  });
  const flag = false as boolean;
  // @ts-expect-error 须为字面量 true/false，不能是宽泛 boolean
  validate({}, rule.string(), { throwOnError: flag });
}

// 默认 / throwOnError: true → Infer
{
  const result1 = await validate(
    {},
    {
      test: rule.string().optional(),
    },
  );
  expectType<TypeEqual<{ test?: string | undefined }, typeof result1>>(true);
  expectType<TypeEqual<{ test: string | undefined }, typeof result1>>(false);
  expectType<TypeEqual<{ test: string }, typeof result1>>(false);

  const result2 = await validate({}, rule.number());
  expectType<TypeEqual<number, typeof result2>>(true);
  expectType<TypeEqual<string, typeof result2>>(false);

  const userSchema = schema({
    id: rule.int(),
    name: rule.string().optional(),
  });
  const result3 = await validate({}, userSchema);
  expectType<TypeEqual<{ id: number } & { name?: string | undefined }, typeof result3>>(
    true,
  );
  expectType<TypeEqual<{ id: number; name: string | undefined }, typeof result3>>(false);

  const result4 = await validate({}, rule.number(), { throwOnError: true });
  expectType<TypeEqual<number, typeof result4>>(true);
}

// throwOnError: false → Safe
{
  const result = await validate({}, rule.number(), { throwOnError: false });
  expectType<TypeEqual<ValidateResult.Safe<number>, typeof result>>(true);

  if (result.errors === null) {
    expectType<TypeEqual<number, typeof result.data>>(true);
  } else {
    expectType<TypeEqual<null, typeof result.data>>(true);
    expectType<TypeEqual<string[], typeof result.errors>>(true);
  }
}

// throwOnError: false + nullable：成功 data 可为 null，靠 errors 收窄
{
  const result = await validate(null, rule.string().nullable(), {
    throwOnError: false,
  });
  expectType<TypeEqual<ValidateResult.Safe<string | null>, typeof result>>(true);

  if (result.errors === null) {
    expectType<TypeEqual<string | null, typeof result.data>>(true);
  } else {
    expectType<TypeEqual<null, typeof result.data>>(true);
  }
}

// throwOnError: false + 字段表 / schema
{
  const viaFields = await validate(
    {},
    { id: rule.int(), name: rule.string().optional() },
    { throwOnError: false },
  );
  type FieldsInfer = { id: number } & { name?: string | undefined };
  expectType<TypeEqual<ValidateResult.Safe<FieldsInfer>, typeof viaFields>>(true);

  const viaSchema = await validate({}, schema({ id: rule.int() }), {
    throwOnError: false,
  });
  expectType<TypeEqual<ValidateResult.Safe<{ id: number }>, typeof viaSchema>>(true);
}
