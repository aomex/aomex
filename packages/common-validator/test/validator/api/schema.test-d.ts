import { expectType, type TypeEqual } from 'ts-expect';
import {
  schema,
  ValidatorSchema,
  rule,
  ObjectValidator,
  Validator,
  IntValidator,
  StringValidator,
  EmailValidator,
  BufferValidator,
} from '../../../src';

const userSchema = schema({
  id: rule.int(),
  name: rule.string(),
  age: rule.int().optional(),
  email: rule.email(),
  profile: rule.object({
    bio: rule.string(),
  }),
});

// Infer
{
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        email: string;
        profile: { bio: string };
      } & {
        age?: number | undefined;
      },
      Validator.Infer<typeof userSchema>
    >
  >(true);
}

// asName：不改变 Infer；name 为 protected，对外用索引读取
{
  const named = userSchema.asName('User');
  expectType<TypeEqual<string | undefined, (typeof named)['name']>>(true);
  // @ts-expect-error name 为 protected，点访问不可用
  named.name;
  expectType<
    TypeEqual<Validator.Infer<typeof named>, Validator.Infer<typeof userSchema>>
  >(true);
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        email: string;
        profile: { bio: string };
      } & {
        age?: number | undefined;
      },
      Validator.Infer<typeof named>
    >
  >(true);
}

// pick
{
  const picked = userSchema.pick('id', 'name');
  expectType<TypeEqual<{ id: number; name: string }, Validator.Infer<typeof picked>>>(
    true,
  );

  const pickedArr = userSchema.pick(['id', 'name']);
  expectType<
    TypeEqual<Validator.Infer<typeof pickedArr>, Validator.Infer<typeof picked>>
  >(true);

  // @ts-expect-error 不能 pick 不存在的键
  userSchema.pick('missing');
  // @ts-expect-error
  userSchema.pick(['missing']);
}

// omit
{
  const omitted = userSchema.omit('id', 'profile');
  expectType<
    TypeEqual<
      { name: string; email: string } & { age?: number | undefined },
      Validator.Infer<typeof omitted>
    >
  >(true);

  const omittedArr = userSchema.omit(['id', 'profile']);
  expectType<
    TypeEqual<Validator.Infer<typeof omittedArr>, Validator.Infer<typeof omitted>>
  >(true);

  // @ts-expect-error
  userSchema.omit('missing');
  // @ts-expect-error
  userSchema.omit(['missing']);
}

// extend：追加字段
{
  const extended = userSchema.extend({
    phone: rule.string(),
    remark: rule.string().optional(),
  });
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        email: string;
        profile: { bio: string };
        phone: string;
      } & {
        age?: number | undefined;
        remark?: string | undefined;
      },
      Validator.Infer<typeof extended>
    >
  >(true);
}

// extend：同名键覆盖
{
  const overridden = userSchema.extend({
    name: rule.string().optional(),
  });
  expectType<
    TypeEqual<
      {
        id: number;
        email: string;
        profile: { bio: string };
      } & {
        age?: number | undefined;
        name?: string | undefined;
      },
      Validator.Infer<typeof overridden>
    >
  >(true);
}

// merge
{
  const extraSchema = schema({
    role: rule.enum(['admin', 'user']),
    name: rule.string().optional(),
  });
  const merged = userSchema.merge(extraSchema);
  expectType<
    TypeEqual<
      {
        id: number;
        email: string;
        profile: { bio: string };
        role: 'admin' | 'user';
      } & {
        age?: number | undefined;
        name?: string | undefined;
      },
      Validator.Infer<typeof merged>
    >
  >(true);
}

// partial：全部字段
{
  const patched = userSchema.partial();
  expectType<
    TypeEqual<
      {
        id?: number | undefined;
        name?: string | undefined;
        age?: number | undefined;
        email?: string | undefined;
        profile?: { bio: string } | undefined;
      },
      Validator.Infer<typeof patched>
    >
  >(true);
}

// partial：指定字段
{
  const partialName = userSchema.partial('name', 'email');
  expectType<
    TypeEqual<
      {
        id: number;
        profile: { bio: string };
      } & {
        age?: number | undefined;
        name?: string | undefined;
        email?: string | undefined;
      },
      Validator.Infer<typeof partialName>
    >
  >(true);

  const partialNameArr = userSchema.partial(['name', 'email']);
  expectType<
    TypeEqual<Validator.Infer<typeof partialNameArr>, Validator.Infer<typeof partialName>>
  >(true);

  // @ts-expect-error
  userSchema.partial('missing');
  // @ts-expect-error
  userSchema.partial(['missing']);
}

// partial：含 transform 时不可用
{
  const withTransform = schema({
    id: rule.int(),
    name: rule.string().transform((s) => s.length),
  });
  // @ts-expect-error 部分字段带 transform 时，无参 partial 不可用（可指定不含 transform 的字段）
  withTransform.partial();
  // @ts-expect-error 只能指定不含 transform 的字段
  withTransform.partial('name');
  // 指定不含 transform 的字段可以（补全也只会给出这类 key）
  const onlyId = withTransform.partial('id');
  expectType<
    TypeEqual<
      { name: number } & { id?: number | undefined },
      Validator.Infer<typeof onlyId>
    >
  >(true);
}

// 链式派生：CRUD 常见组合
{
  const createUser = userSchema.omit('id').extend({
    password: rule.string(),
  });
  expectType<
    TypeEqual<
      {
        name: string;
        email: string;
        profile: { bio: string };
        password: string;
      } & {
        age?: number | undefined;
      },
      Validator.Infer<typeof createUser>
    >
  >(true);

  const patchUser = userSchema.pick('name', 'email', 'age').partial();
  expectType<
    TypeEqual<
      {
        name?: string | undefined;
        email?: string | undefined;
        age?: number | undefined;
      },
      Validator.Infer<typeof patchUser>
    >
  >(true);

  // default 在 Infer 中表现为必有值（缺省由运行时补齐）
  const listQuery = userSchema
    .pick('name', 'email')
    .partial()
    .extend({
      page: rule.int().default(1),
      pageSize: rule.int().default(20),
    });
  expectType<
    TypeEqual<
      {
        page: number;
        pageSize: number;
      } & {
        name?: string | undefined;
        email?: string | undefined;
      },
      Validator.Infer<typeof listQuery>
    >
  >(true);
}

// object()：必须是带 Infer 泛型的 ObjectValidator
{
  const obj = userSchema.object();
  expectType<TypeEqual<ObjectValidator<Validator.Infer<typeof userSchema>>, typeof obj>>(
    true,
  );
  expectType<
    TypeEqual<
      ObjectValidator<
        {
          id: number;
          name: string;
          email: string;
          profile: { bio: string };
        } & {
          age?: number | undefined;
        }
      >,
      typeof obj
    >
  >(true);
  expectType<TypeEqual<ObjectValidator, typeof obj>>(false);
  expectType<TypeEqual<Validator, typeof obj>>(false);
  expectType<TypeEqual<Validator.Infer<typeof obj>, Validator.Infer<typeof userSchema>>>(
    true,
  );

  const nested = rule.object({
    user: userSchema.pick('id', 'name').object(),
  });
  expectType<
    TypeEqual<Validator.Infer<typeof nested>, { user: { id: number; name: string } }>
  >(true);

  const list = rule.array(userSchema.pick('id').object());
  expectType<TypeEqual<Validator.Infer<typeof list>, { id: number }[]>>(true);
}

// 实例类型与空 schema
{
  expectType<
    TypeEqual<
      ValidatorSchema<{
        id: IntValidator;
        name: StringValidator;
        age: IntValidator<number | Validator.TOptional>;
        email: EmailValidator;
        profile: ObjectValidator<{ bio: string }>;
      }>,
      typeof userSchema
    >
  >(true);
  expectType<TypeEqual<ValidatorSchema<any>, typeof userSchema>>(false);

  const empty = schema({});
  expectType<TypeEqual<Validator.Infer<typeof empty>, {}>>(true);
  expectType<TypeEqual<ValidatorSchema<{}>, typeof empty>>(true);
}

// schema / extend 不得把带入参泛型的 validator 收成 any（如 rule.buffer）
{
  const withBuffer = schema({
    byt: rule.buffer(),
  });
  type WithBufferRules = typeof withBuffer extends ValidatorSchema<infer R> ? R : never;
  expectType<TypeEqual<BufferValidator<Buffer>, WithBufferRules['byt']>>(true);
  expectType<TypeEqual<BufferValidator<any>, WithBufferRules['byt']>>(false);
  expectType<TypeEqual<{ byt: Buffer }, Validator.Infer<typeof withBuffer>>>(true);

  const extended = withBuffer.extend({
    extra: rule.buffer(),
  });
  type ExtendedRules = typeof extended extends ValidatorSchema<infer R> ? R : never;
  expectType<TypeEqual<BufferValidator<Buffer>, ExtendedRules['byt']>>(true);
  expectType<TypeEqual<BufferValidator<Buffer>, ExtendedRules['extra']>>(true);
  expectType<TypeEqual<BufferValidator<any>, ExtendedRules['byt']>>(false);
  expectType<TypeEqual<BufferValidator<any>, ExtendedRules['extra']>>(false);
  expectType<TypeEqual<{ byt: Buffer; extra: Buffer }, Validator.Infer<typeof extended>>>(
    true,
  );

  const merged = withBuffer.merge(
    schema({
      extra: rule.buffer(),
    }),
  );
  type MergedRules = typeof merged extends ValidatorSchema<infer R> ? R : never;
  expectType<TypeEqual<BufferValidator<Buffer>, MergedRules['byt']>>(true);
  expectType<TypeEqual<BufferValidator<Buffer>, MergedRules['extra']>>(true);
  expectType<TypeEqual<BufferValidator<any>, MergedRules['byt']>>(false);
  expectType<TypeEqual<BufferValidator<any>, MergedRules['extra']>>(false);
  expectType<TypeEqual<{ byt: Buffer; extra: Buffer }, Validator.Infer<typeof merged>>>(
    true,
  );
}

// pick -> omit -> extend -> merge -> partial 串联后仍可 Infer
{
  const pipeline = userSchema
    .pick('id', 'name', 'email', 'age')
    .omit('id')
    .extend({ tag: rule.string() })
    .merge(schema({ active: rule.boolean() }))
    .partial('name', 'tag');

  expectType<
    TypeEqual<
      {
        email: string;
        active: boolean;
      } & {
        age?: number | undefined;
        name?: string | undefined;
        tag?: string | undefined;
      },
      Validator.Infer<typeof pipeline>
    >
  >(true);
}
