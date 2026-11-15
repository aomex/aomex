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

// 嵌套裸对象入库后 Infer / 实例类型与 rule.object 一致
{
  const viaLiteral = schema({
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  });
  const viaObject = schema({
    profile: rule.object({
      bio: rule.string(),
      age: rule.int().optional(),
    }),
  });
  expectType<
    TypeEqual<Validator.Infer<typeof viaLiteral>, Validator.Infer<typeof viaObject>>
  >(true);
  expectType<
    TypeEqual<
      { profile: { bio: string } & { age?: number | undefined } },
      Validator.Infer<typeof viaLiteral>
    >
  >(true);
  expectType<
    TypeEqual<
      { profile: { bio: string; age: number | undefined } },
      Validator.Infer<typeof viaLiteral>
    >
  >(false);
  expectType<
    TypeEqual<
      ValidatorSchema<{
        profile: ObjectValidator<{ bio: string } & { age?: number | undefined }>;
      }>,
      typeof viaLiteral
    >
  >(true);
}

// 外层交叉 + 嵌套交叉；extend 追加嵌套裸对象仍保持交叉
{
  const base = schema({
    id: rule.int(),
    name: rule.string().optional(),
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  });
  expectType<
    TypeEqual<
      { id: number; profile: { bio: string } & { age?: number | undefined } } & {
        name?: string | undefined;
      },
      Validator.Infer<typeof base>
    >
  >(true);

  const extended = base.extend({
    address: {
      city: rule.string(),
      zip: rule.string().optional(),
    },
  });
  expectType<
    TypeEqual<
      {
        id: number;
        profile: { bio: string } & { age?: number | undefined };
        address: { city: string } & { zip?: string | undefined };
      } & { name?: string | undefined },
      Validator.Infer<typeof extended>
    >
  >(true);
  expectType<
    TypeEqual<
      {
        id: number;
        name?: string;
        profile: { bio: string; age?: number };
        address: { city: string; zip?: string };
      },
      Validator.Infer<typeof extended>
    >
  >(false);
}

// schema 内对象→数组→对象（元素含交叉）
{
  const s = schema({
    list: rule.array({
      profile: {
        bio: rule.string(),
        age: rule.int().optional(),
      },
    }),
  });
  expectType<
    TypeEqual<
      { list: { profile: { bio: string } & { age?: number | undefined } }[] },
      Validator.Infer<typeof s>
    >
  >(true);
}

// asName：不改变 Infer；name 为 protected，对外用索引读取；仅支持具名 string
{
  const named = userSchema.asName('User');
  expectType<TypeEqual<string | undefined, (typeof named)['name']>>(true);
  // @ts-expect-error name 为 protected，点访问不可用
  named.name;
  // @ts-expect-error schema 不支持 asName(true)
  userSchema.asName(true);
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

// extend(schema)：与字段表形态 Infer 一致
{
  const extraSchema = schema({
    role: rule.enum(['admin', 'user']),
    name: rule.string().optional(),
  });
  const extended = userSchema.extend(extraSchema);
  const extendedByFields = userSchema.extend({
    role: rule.enum(['admin', 'user']),
    name: rule.string().optional(),
  });
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
      Validator.Infer<typeof extended>
    >
  >(true);
  expectType<
    TypeEqual<Validator.Infer<typeof extended>, Validator.Infer<typeof extendedByFields>>
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

// required：全部字段（含已是必填的字段，等价收紧 optional）
{
  const allRequired = userSchema.required();
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        age: number;
        email: string;
        profile: { bio: string };
      },
      Validator.Infer<typeof allRequired>
    >
  >(true);
  // 错误形状
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        email: string;
        profile: { bio: string };
      } & { age?: number | undefined },
      Validator.Infer<typeof allRequired>
    >
  >(false);
  // 实例类型：age 去掉 TOptional
  expectType<
    TypeEqual<
      ValidatorSchema<{
        id: IntValidator;
        name: StringValidator;
        age: IntValidator;
        email: EmailValidator;
        profile: ObjectValidator<{ bio: string }>;
      }>,
      typeof allRequired
    >
  >(true);
}

// required：空 schema
{
  const empty = schema({}).required();
  expectType<TypeEqual<{}, Validator.Infer<typeof empty>>>(true);
}

// required：指定字段（rest / 数组等价；可指定已是必填的键）
{
  const requireAge = userSchema.required('age');
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        age: number;
        email: string;
        profile: { bio: string };
      },
      Validator.Infer<typeof requireAge>
    >
  >(true);

  const requireAgeArr = userSchema.required(['age']);
  expectType<
    TypeEqual<Validator.Infer<typeof requireAgeArr>, Validator.Infer<typeof requireAge>>
  >(true);

  const requireName = userSchema.required('name');
  expectType<
    TypeEqual<Validator.Infer<typeof requireName>, Validator.Infer<typeof userSchema>>
  >(true);

  const requireMulti = userSchema.required('age', 'name');
  const requireMultiArr = userSchema.required(['age', 'name']);
  expectType<
    TypeEqual<
      Validator.Infer<typeof requireMulti>,
      Validator.Infer<typeof requireMultiArr>
    >
  >(true);
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        age: number;
        email: string;
        profile: { bio: string };
      },
      Validator.Infer<typeof requireMulti>
    >
  >(true);

  // @ts-expect-error
  userSchema.required('missing');
  // @ts-expect-error
  userSchema.required(['missing']);
  // @ts-expect-error 空元组不满足至少一键
  userSchema.required([]);
}

// required：只收紧顶层，不深入嵌套 object 字段
{
  const nested = schema({
    profile: rule.object({
      bio: rule.string().optional(),
    }),
  });
  const topRequired = nested.partial().required();
  expectType<
    TypeEqual<
      { profile: { bio?: string | undefined } },
      Validator.Infer<typeof topRequired>
    >
  >(true);
  expectType<
    TypeEqual<{ profile: { bio: string } }, Validator.Infer<typeof topRequired>>
  >(false);
}

// required：含 transform 时不可用；含 default 可调用（default 字段 Infer 仍必有值）
{
  const withTransform = schema({
    id: rule.int(),
    name: rule.string().transform((s) => s.length),
  });
  // @ts-expect-error 部分字段带 transform 时，无参 required 不可用
  withTransform.required();
  // @ts-expect-error 只能指定不含 transform 的字段
  withTransform.required('name');
  const onlyId = withTransform.required('id');
  expectType<TypeEqual<{ id: number; name: number }, Validator.Infer<typeof onlyId>>>(
    true,
  );

  const withDefault = schema({
    id: rule.int().optional(),
    page: rule.int().default(1),
  });
  const requiredWithDefault = withDefault.required();
  expectType<
    TypeEqual<{ id: number; page: number }, Validator.Infer<typeof requiredWithDefault>>
  >(true);
  const onlyPage = withDefault.required('page');
  expectType<
    TypeEqual<
      { page: number } & { id?: number | undefined },
      Validator.Infer<typeof onlyPage>
    >
  >(true);
  const onlyIdKeepDefault = withDefault.required('id');
  expectType<
    TypeEqual<{ id: number; page: number }, Validator.Infer<typeof onlyIdKeepDefault>>
  >(true);
}

// required：nullable + optional → 去掉 undefined，保留 null
{
  const withNull = schema({
    note: rule.string().optional().nullable(),
  });
  expectType<
    TypeEqual<{ note?: string | null | undefined }, Validator.Infer<typeof withNull>>
  >(true);
  const noteRequired = withNull.required();
  expectType<TypeEqual<{ note: string | null }, Validator.Infer<typeof noteRequired>>>(
    true,
  );
  expectType<
    TypeEqual<{ note?: string | null | undefined }, Validator.Infer<typeof noteRequired>>
  >(false);
}

// required：与 partial 互逆；required 后再 partial 指定键
{
  const roundtrip = userSchema.partial().required();
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        age: number;
        email: string;
        profile: { bio: string };
      },
      Validator.Infer<typeof roundtrip>
    >
  >(true);

  const againPartial = roundtrip.partial('age', 'email');
  expectType<
    TypeEqual<
      {
        id: number;
        name: string;
        profile: { bio: string };
      } & {
        age?: number | undefined;
        email?: string | undefined;
      },
      Validator.Infer<typeof againPartial>
    >
  >(true);
}

// required：pick / omit / extend 后收紧
{
  const fromPatch = userSchema.pick('name', 'email', 'age').partial().required('name');
  expectType<
    TypeEqual<
      { name: string } & {
        email?: string | undefined;
        age?: number | undefined;
      },
      Validator.Infer<typeof fromPatch>
    >
  >(true);

  const createThenRequireAge = userSchema
    .omit('id')
    .extend({ password: rule.string() })
    .required('age');
  expectType<
    TypeEqual<
      {
        name: string;
        email: string;
        profile: { bio: string };
        password: string;
        age: number;
      },
      Validator.Infer<typeof createThenRequireAge>
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

// rule.object(schema)：必须是带 Infer 泛型的 ObjectValidator
{
  const obj = rule.object(userSchema);
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
    user: rule.object(userSchema.pick('id', 'name')),
  });
  expectType<
    TypeEqual<Validator.Infer<typeof nested>, { user: { id: number; name: string } }>
  >(true);

  const list = rule.array(userSchema.pick('id'));
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

  const extendedBySchema = withBuffer.extend(
    schema({
      extra: rule.buffer(),
    }),
  );
  type ExtendedBySchemaRules =
    typeof extendedBySchema extends ValidatorSchema<infer R> ? R : never;
  expectType<TypeEqual<BufferValidator<Buffer>, ExtendedBySchemaRules['byt']>>(true);
  expectType<TypeEqual<BufferValidator<Buffer>, ExtendedBySchemaRules['extra']>>(true);
  expectType<TypeEqual<BufferValidator<any>, ExtendedBySchemaRules['byt']>>(false);
  expectType<TypeEqual<BufferValidator<any>, ExtendedBySchemaRules['extra']>>(false);
  expectType<
    TypeEqual<{ byt: Buffer; extra: Buffer }, Validator.Infer<typeof extendedBySchema>>
  >(true);
}

// pick -> omit -> extend(字段表) -> extend(schema) -> partial -> required 串联后仍可 Infer
{
  const pipeline = userSchema
    .pick('id', 'name', 'email', 'age')
    .omit('id')
    .extend({ tag: rule.string() })
    .extend(schema({ active: rule.boolean() }))
    .partial('name', 'tag')
    .required('age', 'name');

  expectType<
    TypeEqual<
      {
        email: string;
        active: boolean;
        age: number;
        name: string;
      } & {
        tag?: string | undefined;
      },
      Validator.Infer<typeof pipeline>
    >
  >(true);
}
