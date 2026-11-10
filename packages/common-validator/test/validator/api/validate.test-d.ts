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
}

// 泛型
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
}
