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

// schema：返回类型放宽为 Validator；精确 ObjectValidator 请用 schema.object()
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

  const precise = userSchema.object();
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
