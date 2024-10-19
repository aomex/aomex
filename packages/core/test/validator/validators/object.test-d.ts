import { type TypeEqual, expectType } from 'ts-expect';
import {
  rule,
  ObjectValidator as TargetValidator,
  Validator,
  type TransformedValidator,
} from '../../../src';

type DefaultType = { [K: string]: unknown };
const validator = new TargetValidator();

// 可选
{
  const v = validator.optional();
  expectType<TargetValidator<Validator.TObject | Validator.TOptional>>(v);
  expectType<TypeEqual<DefaultType | undefined, Validator.Infer<typeof v>>>(true);
}

// nullable
{
  const v = validator.nullable();
  expectType<TargetValidator<Validator.TObject | null>>(v);
  expectType<TypeEqual<DefaultType | null, Validator.Infer<typeof v>>>(true);
}

// 默认值
{
  const v = validator.optional().default({});
  expectType<
    TargetValidator<Validator.TObject | Validator.TOptional | Validator.TDefault>
  >(v);
  expectType<TypeEqual<DefaultType, Validator.Infer<typeof v>>>(true);
}

// 严格模式
{
  const v = validator.strict();
  expectType<TargetValidator<Validator.TObject>>(v);
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
  expectType<TargetValidator<Validator.TObject>>(v);
}

// parseFromString
{
  const v = validator.parseFromString();
  expectType<TargetValidator<Validator.TObject>>(v);
}

// additional
{
  const v1 = validator.additional();
  expectType<TypeEqual<TargetValidator<{ [K: string]: unknown }>, typeof v1>>(true);
  expectType<TypeEqual<{ [K: string]: unknown }, Validator.Infer<typeof v1>>>(true);

  const v2 = validator.additional({
    value: rule.anyOf([rule.string(), rule.number()]),
  });
  expectType<TypeEqual<{ [K: string]: string | number }, Validator.Infer<typeof v2>>>(
    true,
  );

  const v3 = validator.additional({
    key: /x/,
    value: rule.anyOf([rule.string(), rule.number()]),
  });
  expectType<TypeEqual<{ [K: string]: string | number }, Validator.Infer<typeof v3>>>(
    true,
  );

  const v4 = validator.additional({ key: /x/ });
  expectType<TypeEqual<{ [K: string]: unknown }, Validator.Infer<typeof v4>>>(true);

  const v5 = new TargetValidator<{ foo: string }>({ foo: rule.string() }).additional({
    value: rule.array(rule.number()),
  });
  expectType<
    TypeEqual<{ foo: string } & { [K: string]: number[] }, Validator.Infer<typeof v5>>
  >(true);

  const v6 = new TargetValidator<{ foo: string }>({ foo: rule.string() })
    .optional()
    .additional({ value: rule.boolean() });
  expectType<
    TypeEqual<
      ({ foo: string } & { [K: string]: boolean }) | undefined,
      Validator.Infer<typeof v6>
    >
  >(true);

  const v7 = new TargetValidator<{ foo: string }>({ foo: rule.string() })
    .nullable()
    .additional({ value: rule.boolean() });
  expectType<
    TypeEqual<
      ({ foo: string } & { [K: string]: boolean }) | null,
      Validator.Infer<typeof v7>
    >
  >(true);

  const v8 = new TargetValidator().nullable().additional();
  expectType<TypeEqual<{ [K: string]: unknown } | null, Validator.Infer<typeof v8>>>(
    true,
  );

  const v9 = new TargetValidator().additional().nullable();
  expectType<TypeEqual<{ [K: string]: unknown } | null, Validator.Infer<typeof v9>>>(
    true,
  );

  const v10 = new TargetValidator().additional({ value: rule.string() }).nullable();
  expectType<TypeEqual<{ [K: string]: string } | null, Validator.Infer<typeof v10>>>(
    true,
  );
}
