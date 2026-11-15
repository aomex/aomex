import {
  AllOfValidator,
  AnyOfValidator,
  AnyValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateValidator,
  DecimalValidator,
  EmailValidator,
  EnumValidator,
  HashValidator,
  IntValidator,
  IpValidator,
  LiteralValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StringValidator,
  UlidValidator,
  UrlValidator,
  UuidValidator,
  Validator,
  rule,
  schema,
} from '../../../src';
import { expectType, type TypeEqual } from 'ts-expect';
import type Decimal from 'decimal.js';

// any：宽联合 Infer
{
  const v = rule.any();
  expectType<TypeEqual<AnyValidator<AnyValidator.Type>, typeof v>>(true);
  expectType<
    TypeEqual<
      number | string | boolean | any[] | { [K: string]: unknown } | bigint | Buffer,
      Validator.Infer<typeof v>
    >
  >(true);
}

// allOf：交叉推断；nullable 在字段级 / 验证器级的差异
{
  const v1 = rule.allOf([
    rule.object({ foo: rule.string() }),
    rule.object({ bar: rule.number() }),
  ]);
  expectType<TypeEqual<AllOfValidator<{ foo: string } & { bar: number }>, typeof v1>>(
    true,
  );

  // 字段 nullable → 交叉结果带 null
  const v2 = rule.allOf([
    rule.object({ foo: rule.string() }),
    rule.object({ bar: rule.number().nullable() }),
  ]);
  expectType<
    TypeEqual<AllOfValidator<{ foo: string } & { bar: number | null }>, typeof v2>
  >(true);

  // 仅一侧验证器 nullable，交叉对象本身仍非 null（ConvertOptional 行为）
  const v3 = rule.allOf([
    rule.object({ foo: rule.string() }),
    rule.object({ bar: rule.number() }).nullable(),
  ]);
  expectType<TypeEqual<AllOfValidator<{ foo: string } & { bar: number }>, typeof v3>>(
    true,
  );

  // 两侧验证器都 nullable → 整体可为 null
  const v4 = rule.allOf([
    rule.object({ foo: rule.string() }).nullable(),
    rule.object({ bar: rule.number() }).nullable(),
  ]);
  expectType<
    TypeEqual<AllOfValidator<({ foo: string } & { bar: number }) | null>, typeof v4>
  >(true);

  // Token：schema + 字段表，Infer 为交叉
  {
    const user = schema({ id: rule.int(), name: rule.string() });
    const v = rule.allOf([user, { active: rule.boolean() }]);
    expectType<
      TypeEqual<
        AllOfValidator<{ id: number; name: string } & { active: boolean }>,
        typeof v
      >
    >(true);
    expectType<
      TypeEqual<
        { id: number; name: string } & { active: boolean },
        Validator.Infer<typeof v>
      >
    >(true);
  }

  // Token：两侧都是字段表
  {
    const v = rule.allOf([{ foo: rule.string() }, { bar: rule.number() }]);
    expectType<TypeEqual<AllOfValidator<{ foo: string } & { bar: number }>, typeof v>>(
      true,
    );
  }

  // Token：嵌套裸对象字段表；同键交叉 + 内层可选交叉
  {
    const v = rule.allOf([
      { profile: { bio: rule.string() } },
      { profile: { age: rule.int() } },
    ]);
    expectType<
      TypeEqual<
        AllOfValidator<{ profile: { bio: string } } & { profile: { age: number } }>,
        typeof v
      >
    >(true);

    const withOptional = rule.allOf([
      {
        user: {
          id: rule.int(),
          name: rule.string().optional(),
        },
      },
      { active: rule.boolean() },
    ]);
    expectType<
      TypeEqual<
        AllOfValidator<
          { user: { id: number } & { name?: string | undefined } } & { active: boolean }
        >,
        typeof withOptional
      >
    >(true);
    expectType<
      TypeEqual<
        { user: { id: number; name: string | undefined }; active: boolean },
        Validator.Infer<typeof withOptional>
      >
    >(false);
  }

  // 非法：至少两个分支
  // @ts-expect-error 至少两个规则
  rule.allOf([rule.string()]);
  // @ts-expect-error
  rule.allOf([]);
}

// anyOf：联合推断；nullable / Token 混合
{
  const v1 = rule.anyOf([
    rule.object({ foo: rule.string() }),
    rule.object({ bar: rule.number() }),
  ]);
  expectType<TypeEqual<AnyOfValidator<{ foo: string } | { bar: number }>, typeof v1>>(
    true,
  );

  const v2 = rule.anyOf([
    rule.object({ foo: rule.string() }),
    rule.object({ bar: rule.number() }).nullable(),
  ]);
  expectType<
    TypeEqual<AnyOfValidator<{ foo: string } | { bar: number } | null>, typeof v2>
  >(true);

  // Token：schema + Validator + 字段表 → 三元联合
  {
    const user = schema({ id: rule.int() });
    const v = rule.anyOf([user, rule.string(), { code: rule.int() }]);
    expectType<
      TypeEqual<AnyOfValidator<{ id: number } | string | { code: number }>, typeof v>
    >(true);
    expectType<
      TypeEqual<{ id: number } | string | { code: number }, Validator.Infer<typeof v>>
    >(true);
  }

  // Token：字段表里 optional 保持可选
  {
    const v = rule.anyOf([{ foo: rule.string() }, { bar: rule.number().optional() }]);
    expectType<
      TypeEqual<AnyOfValidator<{ foo: string } | { bar?: number | undefined }>, typeof v>
    >(true);
  }

  // 非法：至少两个分支
  // @ts-expect-error 至少两个规则
  rule.anyOf([rule.string()]);
  // @ts-expect-error
  rule.anyOf([]);
}

// array：无参 / 嵌套 / optional 元素；字段表与 schema Token
{
  const empty = rule.array();
  expectType<TypeEqual<ArrayValidator<unknown[]>, typeof empty>>(true);

  const nested = rule.array(rule.array(rule.string()));
  expectType<TypeEqual<ArrayValidator<string[][]>, typeof nested>>(true);

  // 元素 optional → 元素类型含 undefined
  const optionalItem = rule.array(rule.string().optional());
  expectType<TypeEqual<ArrayValidator<(string | undefined)[]>, typeof optionalItem>>(
    true,
  );
  expectType<TypeEqual<ArrayValidator<string[]>, typeof optionalItem>>(false);

  // Token：字段表快捷写法，等价 object 元素；可选键不能写成必填
  {
    const v = rule.array({
      foo: rule.string(),
      bar: rule.string().optional(),
    });
    expectType<
      TypeEqual<
        ArrayValidator<({ foo: string } & { bar?: string | undefined })[]>,
        typeof v
      >
    >(true);
    expectType<
      TypeEqual<ArrayValidator<{ foo: string; bar: string | undefined }[]>, typeof v>
    >(false);
    expectType<
      TypeEqual<
        ({ foo: string } & { bar?: string | undefined })[],
        Validator.Infer<typeof v>
      >
    >(true);
  }

  // Token：schema；与 array(rule.object(schema)) Infer 一致；可选字段交叉形态
  {
    const user = schema({
      id: rule.int(),
      name: rule.string().optional(),
    });
    const v = rule.array(user);
    const viaObject = rule.array(rule.object(user));
    expectType<TypeEqual<Validator.Infer<typeof v>, Validator.Infer<typeof viaObject>>>(
      true,
    );
    expectType<
      TypeEqual<
        ({ id: number } & { name?: string | undefined })[],
        Validator.Infer<typeof v>
      >
    >(true);
    expectType<TypeEqual<ArrayValidator<{ id: number; name: string }[]>, typeof v>>(
      false,
    );
  }

  // 空字段表 → {}[]
  {
    const v = rule.array({});
    expectType<TypeEqual<ArrayValidator<{}[]>, typeof v>>(true);
  }

  // 嵌套裸对象元素字段
  {
    const v = rule.array({
      profile: {
        bio: rule.string(),
      },
    });
    expectType<TypeEqual<ArrayValidator<{ profile: { bio: string } }[]>, typeof v>>(true);
  }

  // 数组元素：嵌套交叉，不能收成扁平必填
  {
    const v = rule.array({
      bio: rule.string(),
      age: rule.int().optional(),
    });
    expectType<
      TypeEqual<
        ArrayValidator<({ bio: string } & { age?: number | undefined })[]>,
        typeof v
      >
    >(true);
    expectType<
      TypeEqual<ArrayValidator<{ bio: string; age: number | undefined }[]>, typeof v>
    >(false);
  }

  // 对象→数组→对象；以及再套一层数组→对象
  {
    const v = rule.object({
      list: rule.array({
        profile: {
          bio: rule.string(),
          meta: { level: rule.int().optional() },
        },
      }),
    });
    expectType<
      TypeEqual<
        {
          list: {
            profile: {
              bio: string;
              meta: { level?: number | undefined };
            };
          }[];
        },
        Validator.Infer<typeof v>
      >
    >(true);

    const deep = rule.object({
      groups: rule.array({
        members: rule.array({
          tag: { name: rule.string() },
        }),
      }),
    });
    expectType<
      TypeEqual<
        { groups: { members: { tag: { name: string } }[] }[] },
        Validator.Infer<typeof deep>
      >
    >(true);
  }
}

// bigint
{
  const v = rule.bigint();
  expectType<TypeEqual<BigIntValidator<bigint>, typeof v>>(true);
}

// decimal
{
  const v = rule.decimal();
  expectType<TypeEqual<DecimalValidator<Decimal>, typeof v>>(true);
  expectType<TypeEqual<Decimal, Validator.Infer<typeof v>>>(true);
}

// boolean
{
  const v = rule.boolean();
  expectType<TypeEqual<BooleanValidator<boolean>, typeof v>>(true);
}

// buffer
{
  const v = rule.buffer();
  expectType<TypeEqual<BufferValidator<Buffer>, typeof v>>(true);
}

// date：格式参数宽松；返回类型固定 Date
{
  rule.date('yy-mm-dd');
  rule.date('abc', 'yyy-mm-dd');
  const v = rule.date();
  expectType<TypeEqual<DateValidator<Date>, typeof v>>(true);
  expectType<TypeEqual<DateValidator<object>, typeof v>>(false);
}

// email
{
  const v = rule.email();
  expectType<TypeEqual<EmailValidator<string>, typeof v>>(true);
}

// enum：字面量联合，不能宽化成 string；支持 TS enum / 枚举对象
{
  const mixed = rule.enum(['a', 'b', 1]);
  expectType<TypeEqual<EnumValidator<'a' | 'b' | 1>, typeof mixed>>(true);

  const strings = rule.enum(['a', 'b', 'c']);
  expectType<TypeEqual<EnumValidator<'a' | 'b' | 'c'>, typeof strings>>(true);
  expectType<TypeEqual<EnumValidator<string>, typeof strings>>(false);

  const numbers = rule.enum([1, 2, 3]);
  expectType<TypeEqual<EnumValidator<1 | 2 | 3>, typeof numbers>>(true);

  enum Color {
    Red = 'red',
    Blue = 'blue',
  }
  const fromStringEnum = rule.enum(Color);
  type ColorInf = Validator.Infer<typeof fromStringEnum>;
  // TypeEqual 对 enum 品牌过严，用双向赋值断言
  const colorInf: ColorInf = Color.Red;
  const colorBack: Color = colorInf;
  expectType<ColorInf>(Color.Blue);
  expectType<Color>(colorBack);
  // @ts-expect-error 裸字符串不能赋给字符串 enum Infer
  const _colorWrong: ColorInf = 'red';
  expectType<TypeEqual<EnumValidator<string>, typeof fromStringEnum>>(false);

  enum Status {
    Off = 0,
    On = 1,
  }
  const fromNumberEnum = rule.enum(Status);
  type StatusInf = Validator.Infer<typeof fromNumberEnum>;
  const statusInf: StatusInf = Status.Off;
  const statusBack: Status = statusInf;
  expectType<StatusInf>(Status.On);
  expectType<Status>(statusBack);

  const Role = { Admin: 'admin', User: 'user' } as const;
  const fromObject = rule.enum(Role);
  expectType<TypeEqual<EnumValidator<'admin' | 'user'>, typeof fromObject>>(true);
  expectType<TypeEqual<'admin' | 'user', Validator.Infer<typeof fromObject>>>(true);

  // @ts-expect-error 不接受 boolean 值的枚举对象
  rule.enum({ ok: true });
  // @ts-expect-error
  rule.enum({ nested: { a: 1 } });

  const picked = rule.enum(['a', 'b', 'c']).pick('a', 'b');
  expectType<TypeEqual<EnumValidator<'a' | 'b'>, typeof picked>>(true);
  const omitted = rule.enum(['a', 'b', 'c']).omit('c');
  expectType<TypeEqual<EnumValidator<'a' | 'b'>, typeof omitted>>(true);
  // @ts-expect-error
  rule.enum(['a', 'b']).pick('c');
  // @ts-expect-error
  rule.enum(['a', 'b']).omit('c');
}

// hash：算法字面量约束
{
  const v = rule.hash('md5');
  expectType<TypeEqual<HashValidator<string>, typeof v>>(true);
  rule.hash('sha1');
  rule.hash('sha256');
  // @ts-expect-error
  rule.hash('xx');
}

// int
{
  const v = rule.int();
  expectType<TypeEqual<IntValidator<number>, typeof v>>(true);
}

// ip：版本用单值或数组，禁止多参数 / 非法版本
{
  const v = rule.ip('v4');
  expectType<TypeEqual<IpValidator<string>, typeof v>>(true);
  rule.ip('v4');
  rule.ip('v6');
  rule.ip(['v4', 'v6']);
  // @ts-expect-error
  rule.ip('v4', 'v6');
  // @ts-expect-error
  rule.ip('v5');
}

// literal：单值字面量收窄；拒绝非法类型
{
  const s = rule.literal('ok');
  expectType<TypeEqual<LiteralValidator<'ok'>, typeof s>>(true);
  expectType<TypeEqual<'ok', Validator.Infer<typeof s>>>(true);

  const n = rule.literal(0);
  expectType<TypeEqual<LiteralValidator<0>, typeof n>>(true);

  const b = rule.literal(false);
  expectType<TypeEqual<LiteralValidator<false>, typeof b>>(true);

  const nul = rule.literal(null);
  expectType<TypeEqual<LiteralValidator<null>, typeof nul>>(true);
  expectType<TypeEqual<null, Validator.Infer<typeof nul>>>(true);

  // @ts-expect-error
  rule.literal(undefined);
  // @ts-expect-error
  rule.literal({});
  // @ts-expect-error
  rule.literal(1n);
}

// number
{
  const v = rule.number();
  expectType<TypeEqual<NumberValidator<number>, typeof v>>(true);
}

// object：无参 TObject；字段表必填/可选；schema Token；拒绝裸 Validator
{
  const bare = rule.object();
  expectType<TypeEqual<ObjectValidator<object>, typeof bare>>(false);
  expectType<TypeEqual<ObjectValidator<Validator.TObject>, typeof bare>>(true);

  {
    const v = rule.object({ test: rule.string() });
    expectType<TypeEqual<ObjectValidator<{ test: string }>, typeof v>>(true);
    expectType<TypeEqual<ObjectValidator<{ test?: string }>, typeof v>>(false);
  }
  {
    const v = rule.object({ test: rule.string().optional(), test1: rule.number() });
    expectType<
      TypeEqual<
        ObjectValidator<{ test1: number } & { test?: string | undefined }>,
        typeof v
      >
    >(true);
    expectType<TypeEqual<ObjectValidator<{ test: string; test1: number }>, typeof v>>(
      false,
    );
    expectType<
      TypeEqual<ObjectValidator<{ test: string | undefined; test1: number }>, typeof v>
    >(false);
  }
  // Token：schema；Infer 与字段交叉形态一致
  {
    const user = schema({
      id: rule.int(),
      name: rule.string().optional(),
    });
    const v = rule.object(user);
    expectType<TypeEqual<Validator.Infer<typeof v>, Validator.Infer<typeof user>>>(true);
    expectType<
      TypeEqual<{ id: number } & { name?: string | undefined }, Validator.Infer<typeof v>>
    >(true);
    expectType<TypeEqual<ObjectValidator<string>, typeof v>>(false);
  }
  // 空字段表 → {}
  {
    const v = rule.object({});
    expectType<TypeEqual<ObjectValidator<{}>, typeof v>>(true);
  }
  // 嵌套裸对象 → 等价内层 rule.object；内层必填/可选为交叉，不能收成扁平必填
  {
    const v = rule.object({
      profile: {
        bio: rule.string(),
        age: rule.int().optional(),
      },
    });
    const viaObject = rule.object({
      profile: rule.object({
        bio: rule.string(),
        age: rule.int().optional(),
      }),
    });
    expectType<TypeEqual<Validator.Infer<typeof v>, Validator.Infer<typeof viaObject>>>(
      true,
    );
    expectType<
      TypeEqual<
        { profile: { bio: string } & { age?: number | undefined } },
        Validator.Infer<typeof v>
      >
    >(true);
    expectType<
      TypeEqual<
        { profile: { bio: string; age: number | undefined } },
        Validator.Infer<typeof v>
      >
    >(false);
    expectType<
      TypeEqual<{ profile: { bio: string; age?: number } }, Validator.Infer<typeof v>>
    >(false);
  }

  // 外层交叉 + 内层交叉
  {
    const v = rule.object({
      id: rule.int(),
      tag: rule.string().optional(),
      profile: {
        bio: rule.string(),
        age: rule.int().optional(),
      },
    });
    expectType<
      TypeEqual<
        { id: number; profile: { bio: string } & { age?: number | undefined } } & {
          tag?: string | undefined;
        },
        Validator.Infer<typeof v>
      >
    >(true);
    expectType<
      TypeEqual<
        {
          id: number;
          tag?: string | undefined;
          profile: { bio: string; age?: number | undefined };
        },
        Validator.Infer<typeof v>
      >
    >(false);
  }

  // 双层嵌套均含可选 → 每层独立交叉
  {
    const v = rule.object({
      user: {
        name: rule.string(),
        profile: {
          bio: rule.string(),
          level: rule.int().optional(),
        },
        nickname: rule.string().optional(),
      },
    });
    expectType<
      TypeEqual<
        {
          user: {
            name: string;
            profile: { bio: string } & { level?: number | undefined };
          } & { nickname?: string | undefined };
        },
        Validator.Infer<typeof v>
      >
    >(true);
  }

  // 嵌套全 optional：可选侧交叉（无必填键）
  {
    const v = rule.object({
      profile: {
        bio: rule.string().optional(),
        age: rule.int().optional(),
      },
    });
    expectType<
      TypeEqual<
        {
          profile: { bio?: string | undefined; age?: number | undefined };
        },
        Validator.Infer<typeof v>
      >
    >(true);
  }
  // 非法：不接受裸 Validator（应用 schema / 字段表）
  // @ts-expect-error 不接受裸 Validator
  rule.object(rule.string());
  // @ts-expect-error
  rule.object(rule.array());
  // @ts-expect-error
  rule.object(rule.number().optional());
}

// record：等价 object().additional({ value })；值可以是 ValidatorToken
{
  const viaRecord = rule.record(rule.number());
  const viaAdditional = rule.object().additional({ value: rule.number() });
  expectType<
    TypeEqual<Validator.Infer<typeof viaRecord>, Validator.Infer<typeof viaAdditional>>
  >(true);
  expectType<TypeEqual<ObjectValidator<{ [K: string]: number }>, typeof viaRecord>>(true);
  expectType<TypeEqual<{ [K: string]: number }, Validator.Infer<typeof viaRecord>>>(true);

  const nested = rule.record({ id: rule.int(), name: rule.string().optional() });
  expectType<
    TypeEqual<
      { [K: string]: { id: number } & { name?: string | undefined } },
      Validator.Infer<typeof nested>
    >
  >(true);
  expectType<
    TypeEqual<
      { [K: string]: { id: number; name: string | undefined } },
      Validator.Infer<typeof nested>
    >
  >(false);

  // @ts-expect-error 必须提供 value schema
  rule.record();
  // @ts-expect-error
  rule.record(1);
}

// oneOf：联合推断；同类型收窄；Token 混合；至少两分支
{
  const v1 = rule.oneOf([rule.string(), rule.number()]);
  expectType<TypeEqual<OneOfValidator<number | string>, typeof v1>>(true);

  const v2 = rule.oneOf([rule.string(), rule.number().optional()]);
  expectType<TypeEqual<OneOfValidator<number | string | undefined>, typeof v2>>(true);

  // 两分支同为 string → 收窄为 string
  const v3 = rule.oneOf([rule.string(), rule.string()]);
  expectType<TypeEqual<OneOfValidator<string>, typeof v3>>(true);

  const v4 = rule.oneOf([rule.string(), rule.number()]);
  expectType<TypeEqual<OneOfValidator<string>, typeof v4>>(false);

  // Token：schema + Validator + 字段表
  {
    const user = schema({ id: rule.int() });
    const v = rule.oneOf([user, rule.string(), { code: rule.number() }]);
    expectType<
      TypeEqual<OneOfValidator<{ id: number } | string | { code: number }>, typeof v>
    >(true);
    expectType<
      TypeEqual<{ id: number } | string | { code: number }, Validator.Infer<typeof v>>
    >(true);
  }

  // Token：两侧字段表
  {
    const v = rule.oneOf([{ foo: rule.string() }, { bar: rule.boolean() }]);
    expectType<TypeEqual<OneOfValidator<{ foo: string } | { bar: boolean }>, typeof v>>(
      true,
    );
  }

  // 非法：至少两个分支
  // @ts-expect-error 至少两个规则
  rule.oneOf([rule.string()]);
  // @ts-expect-error
  rule.oneOf([]);
}

// string
{
  const v = rule.string();
  expectType<TypeEqual<StringValidator<string>, typeof v>>(true);
}

// ulid
{
  const v = rule.ulid();
  expectType<TypeEqual<UlidValidator<string>, typeof v>>(true);
}

// url
{
  const v = rule.url();
  expectType<TypeEqual<UrlValidator<string>, typeof v>>(true);
}

// uuid：单版本 / 数组版本；禁止多参数与非法版本字面量
{
  const v = rule.uuid('v4');
  expectType<TypeEqual<UuidValidator<string>, typeof v>>(true);
  rule.uuid();
  rule.uuid('v1');
  rule.uuid('v2');
  rule.uuid('v3');
  rule.uuid('v4');
  rule.uuid('v5');
  rule.uuid(['v1', 'v2']);
  // @ts-expect-error
  rule.uuid('v1', 'v2');
  // @ts-expect-error
  rule.uuid(['1']);
  // @ts-expect-error
  rule.uuid('1');
}
