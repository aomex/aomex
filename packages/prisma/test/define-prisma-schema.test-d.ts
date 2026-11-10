import { type TypeEqual, expectType } from 'ts-expect';
import { rule, schema, Validator } from '@aomex/common';
import { definePrismaSchema } from '../src';
import { asPrismaGenerated } from '../src/define-prisma-schema';

const prismaInput = {
  user: schema({
    id: rule.int().optional(),
    name: rule.string(),
    password: rule.string(),
  }),
  post: schema({
    title: rule.string(),
  }),
};

const prismaOutput = {
  user: schema({
    id: rule.int(),
    name: rule.string(),
    password: rule.string(),
  }),
  post: schema({
    title: rule.string(),
  }),
};

const LanguageEnum = <const>['Typescript', 'Javascript'];

const prismaEnum = {
  language: LanguageEnum,
};

const generated = asPrismaGenerated({ prismaInput, prismaOutput, prismaEnum });

// ---------- 封送：不可直接读取 ----------
{
  // @ts-expect-error 生成物不能直接读取 prismaInput
  generated.prismaInput;
  // @ts-expect-error 生成物不能直接读取 prismaOutput
  generated.prismaOutput;
  // @ts-expect-error 生成物不能直接读取 prismaEnum
  generated.prismaEnum;
}

{
  // @ts-expect-error overrides 必填
  definePrismaSchema(generated);
}

{
  definePrismaSchema(
    {
      // @ts-expect-error 未封送的普通对象不能传入
      prismaInput,
      prismaOutput,
      prismaEnum,
    },
    {},
  );
}

// ---------- asPrismaGenerated 入参形状 ----------
{
  // @ts-expect-error 缺少 prismaEnum
  asPrismaGenerated({ prismaInput, prismaOutput });
  // @ts-expect-error 缺少 prismaOutput
  asPrismaGenerated({ prismaInput, prismaEnum });
  // @ts-expect-error 缺少 prismaInput
  asPrismaGenerated({ prismaOutput, prismaEnum });
}

// ---------- 无覆盖：Infer / enum 字面量 ----------
{
  const {
    prismaInput: input,
    prismaOutput: output,
    prismaEnum: enums,
  } = definePrismaSchema(generated, {});

  expectType<
    TypeEqual<
      { name: string; password: string } & { id?: number | undefined },
      Validator.Infer<typeof input.user>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; password: string },
      Validator.Infer<typeof output.user>
    >
  >(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof input.post>>>(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof output.post>>>(true);
  expectType<TypeEqual<readonly ['Typescript', 'Javascript'], typeof enums.language>>(
    true,
  );
  expectType<TypeEqual<'language', keyof typeof enums>>(true);
}

// ---------- 空 overrides ----------
{
  const {
    prismaInput: input,
    prismaOutput: output,
    prismaEnum: enums,
  } = definePrismaSchema(generated, {});

  expectType<
    TypeEqual<
      { name: string; password: string } & { id?: number | undefined },
      Validator.Infer<typeof input.user>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; password: string },
      Validator.Infer<typeof output.user>
    >
  >(true);
  expectType<TypeEqual<readonly ['Typescript', 'Javascript'], typeof enums.language>>(
    true,
  );
}

// ---------- 只覆盖 input ----------
{
  const {
    prismaInput: input,
    prismaOutput: output,
    prismaEnum: enums,
  } = definePrismaSchema(generated, {
    user: {
      input: (s) =>
        s.extend({
          password: rule.string().transform((v) => v.length),
        }),
    },
  });

  expectType<
    TypeEqual<
      { name: string; password: number } & { id?: number | undefined },
      Validator.Infer<typeof input.user>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; password: string },
      Validator.Infer<typeof output.user>
    >
  >(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof input.post>>>(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof output.post>>>(true);
  expectType<TypeEqual<readonly ['Typescript', 'Javascript'], typeof enums.language>>(
    true,
  );
}

// ---------- 只覆盖 output ----------
{
  const { prismaInput: input, prismaOutput: output } = definePrismaSchema(generated, {
    user: {
      output: (s) => s.omit('password'),
    },
  });

  expectType<
    TypeEqual<
      { name: string; password: string } & { id?: number | undefined },
      Validator.Infer<typeof input.user>
    >
  >(true);
  expectType<
    TypeEqual<{ id: number; name: string }, Validator.Infer<typeof output.user>>
  >(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof input.post>>>(true);
}

// ---------- 同时覆盖 + 未覆盖模型保持原 Infer ----------
{
  const {
    prismaInput: input,
    prismaOutput: output,
    prismaEnum: enums,
  } = definePrismaSchema(generated, {
    user: {
      input: (s) =>
        s.extend({
          password: rule.string().transform((v) => v.length),
        }),
      output: (s) => s.omit('password'),
    },
  });

  expectType<
    TypeEqual<
      { name: string; password: number } & { id?: number | undefined },
      Validator.Infer<typeof input.user>
    >
  >(true);
  expectType<
    TypeEqual<{ id: number; name: string }, Validator.Infer<typeof output.user>>
  >(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof input.post>>>(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof output.post>>>(true);
  expectType<TypeEqual<readonly ['Typescript', 'Javascript'], typeof enums.language>>(
    true,
  );
}

// ---------- 多模型覆盖 ----------
{
  const { prismaInput: input, prismaOutput: output } = definePrismaSchema(generated, {
    user: {
      output: (s) => s.omit('password'),
    },
    post: {
      input: (s) => s.extend({ draft: rule.boolean() }),
    },
  });

  expectType<
    TypeEqual<{ id: number; name: string }, Validator.Infer<typeof output.user>>
  >(true);
  expectType<
    TypeEqual<{ title: string; draft: boolean }, Validator.Infer<typeof input.post>>
  >(true);
  expectType<TypeEqual<{ title: string }, Validator.Infer<typeof output.post>>>(true);
  expectType<
    TypeEqual<
      { name: string; password: string } & { id?: number | undefined },
      Validator.Infer<typeof input.user>
    >
  >(true);
}

// ---------- 非法 override ----------
{
  definePrismaSchema(generated, {
    // @ts-expect-error 未知模型名
    missing: {},
  });
}

{
  definePrismaSchema(generated, {
    user: {
      // @ts-expect-error omit 不存在的字段
      output: (s) => s.omit('missing'),
    },
  });
}

{
  definePrismaSchema(generated, {
    user: {
      // @ts-expect-error pick 不存在的字段
      input: (s) => s.pick('missing'),
    },
  });
}

{
  definePrismaSchema(generated, {
    user: {
      // @ts-expect-error 多余键
      foo: (s: never) => s,
    },
  });
}

{
  definePrismaSchema(generated, {
    user: {
      // @ts-expect-error input 必须返回 ValidatorSchema
      input: () => 123,
    },
  });
}

{
  definePrismaSchema(generated, {
    user: {
      // @ts-expect-error output 必须返回 ValidatorSchema
      output: () => 'nope',
    },
  });
}

// ---------- 空 enum 生成物 ----------
{
  const emptyEnumGenerated = asPrismaGenerated({
    prismaInput: { post: prismaInput.post },
    prismaOutput: { post: prismaOutput.post },
    prismaEnum: {},
  });
  const { prismaEnum: enums } = definePrismaSchema(emptyEnumGenerated, {});
  expectType<TypeEqual<{}, typeof enums>>(true);
}
