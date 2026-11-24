import {
  rule,
  schema,
  Decimal,
  type Validator,
  type ValidatorToken,
} from '@aomex/common';
import { expectType, type TypeEqual } from 'ts-expect';
import {
  envelope,
  EnvelopeBuiltinSlot,
  EnvelopeCustomSlot,
  type EnvelopeContent,
  type EnvelopeOptions,
  type EnvelopeSlotContext,
  type EnvelopeVars,
  type WebApp,
  type WebContext,
} from '../../src';

// 内置槽位
{
  expectType<EnvelopeBuiltinSlot<'success'>>(envelope.success);
  expectType<EnvelopeBuiltinSlot<'payload'>>(envelope.payload);
  expectType<EnvelopeBuiltinSlot<'statusCode'>>(envelope.statusCode);
  expectType<TypeEqual<'success', (typeof envelope.success)['kind']>>(true);
  expectType<TypeEqual<'payload', (typeof envelope.payload)['kind']>>(true);
  expectType<TypeEqual<'statusCode', (typeof envelope.statusCode)['kind']>>(true);
}

// slot：get 入参为 EnvelopeVars + EnvelopeSlotContext，返回值对齐 schema
{
  const s = envelope.slot(rule.string(), (vars, ctx) => {
    expectType<EnvelopeVars>(vars);
    expectType<boolean>(vars.success);
    expectType<object | string | null>(vars.payload);
    expectType<number>(vars.statusCode);
    expectType<EnvelopeSlotContext>(ctx);
    expectType<WebContext & WebApp.Props>(ctx);
    expectType<string>(ctx.request.pathname);
    return '1.0';
  });
  expectType<EnvelopeCustomSlot<ReturnType<typeof rule.string>>>(s);

  // 可省略第二参
  envelope.slot(rule.string(), (vars) => String(vars.statusCode));

  // @ts-expect-error 返回值必须是 number
  envelope.slot(rule.number(), (vars) => String(vars.statusCode));
}

// content 声明树 / WebApp.envelope 配置
{
  const content: EnvelopeContent = {
    success: envelope.success,
    data: envelope.payload,
    meta: {
      code: envelope.statusCode,
      version: envelope.slot(rule.string(), () => '1'),
    },
  };
  const options: EnvelopeOptions = { content };
  void options;

  const badOptions: EnvelopeOptions = {
    content: {
      // @ts-expect-error 禁止直接塞 rule（无运行时取值）
      bad: rule.string(),
    },
  };
  void badOptions;

  // @ts-expect-error content 必填
  const missing: EnvelopeOptions = {
    description: 'x',
  };
  void missing;
}

// envelope 不再是可调用中间件工厂
{
  // @ts-expect-error 非中间件，不可调用
  envelope({
    content: {
      success: envelope.success,
      data: envelope.payload,
    },
  });
}

// —— 标量 / 特殊值 ——
{
  envelope.slot(rule.string(), () => '1.0');
  envelope.slot(rule.string(), () => '' as string);
  // @ts-expect-error
  envelope.slot(rule.string(), () => 1);

  envelope.slot(rule.number(), () => 1);
  envelope.slot(rule.number(), () => 0 as number);
  // @ts-expect-error
  envelope.slot(rule.number(), () => '1');

  envelope.slot(rule.int(), () => 1);
  // @ts-expect-error
  envelope.slot(rule.int(), () => '1');

  envelope.slot(rule.boolean(), () => true);
  envelope.slot(rule.boolean(), () => false);
  // @ts-expect-error
  envelope.slot(rule.boolean(), () => 1);

  envelope.slot(rule.bigint(), () => 1n);
  // @ts-expect-error
  envelope.slot(rule.bigint(), () => 1);

  envelope.slot(rule.date(), () => new Date());
  // @ts-expect-error
  envelope.slot(rule.date(), () => '2020-01-01');

  envelope.slot(rule.literal('ok'), () => 'ok' as const);
  // @ts-expect-error
  envelope.slot(rule.literal('ok'), () => 'no');

  envelope.slot(rule.literal(null), () => null);
  // @ts-expect-error
  envelope.slot(rule.literal(null), () => undefined);

  envelope.slot(rule.enum(['a', 'b', 1] as const), () => 'a' as const);
  envelope.slot(rule.enum(['a', 'b', 1] as const), () => 1 as const);
  // @ts-expect-error
  envelope.slot(rule.enum(['a', 'b', 1] as const), () => 'c');

  envelope.slot(rule.email(), () => 'a@b.c');
  envelope.slot(rule.uuid(), () => '00000000-0000-0000-0000-000000000000');
  envelope.slot(rule.url(), () => 'https://example.com');
}

// —— 数组 ——
{
  envelope.slot(rule.array(rule.number()), () => [1, 2]);
  envelope.slot(rule.array(rule.number()), () => [] as number[]);
  // @ts-expect-error
  envelope.slot(rule.array(rule.number()), () => ['a']);

  envelope.slot(rule.array({ id: rule.number() }), () => [{ id: 1 }]);
  // @ts-expect-error 数组元素对象缺字段
  envelope.slot(rule.array({ id: rule.number() }), () => [{}]);
  envelope.slot(rule.array({ id: rule.number() }), () => [
    {
      id: 1,
      // @ts-expect-error 数组元素多余键
      extra: true,
    },
  ]);
}

// —— 字段表 / rule.object / 嵌套 ——
{
  const schemaObj = { id: rule.number() } satisfies ValidatorToken;
  envelope.slot(schemaObj, () => ({ id: 1 }));
  // @ts-expect-error 缺少 id
  envelope.slot(schemaObj, () => ({}));
  // @ts-expect-error 禁止多余字段
  envelope.slot(schemaObj, () => ({ id: 1, extra: true }));

  const wider = { id: 1, extra: true as boolean };
  // @ts-expect-error 变量带回的多余字段也应报错
  envelope.slot(schemaObj, () => wider);

  envelope.slot(rule.object({ id: rule.number() }), () => ({ id: 1 }));
  // @ts-expect-error
  envelope.slot(rule.object({ id: rule.number() }), () => ({ id: 1, x: 1 }));

  const nested = {
    user: { id: rule.number(), name: rule.string() },
  } satisfies ValidatorToken;
  envelope.slot(nested, () => ({ user: { id: 1, name: 'a' } }));
  // @ts-expect-error 嵌套缺字段
  envelope.slot(nested, () => ({ user: { id: 1 } }));
  // @ts-expect-error 嵌套多余字段
  envelope.slot(nested, () => ({ user: { id: 1, name: 'a', extra: true } }));
  // @ts-expect-error 顶层多余
  envelope.slot(nested, () => ({ user: { id: 1, name: 'a' }, extra: 1 }));

  const deep = {
    a: { b: { c: rule.number() } },
  } satisfies ValidatorToken;
  envelope.slot(deep, () => ({ a: { b: { c: 1 } } }));
  // @ts-expect-error 深层多余
  envelope.slot(deep, () => ({ a: { b: { c: 1, d: 2 } } }));
}

// —— null / undefined：顶层标量 ——
{
  envelope.slot(rule.literal(null), () => null);
  // @ts-expect-error literal(null) 不能返回 undefined
  envelope.slot(rule.literal(null), () => undefined);
  // @ts-expect-error
  envelope.slot(rule.literal(null), () => 'null');

  envelope.slot(rule.string().nullable(), () => 'x');
  envelope.slot(rule.string().nullable(), () => null);
  // @ts-expect-error nullable 不含 undefined
  envelope.slot(rule.string().nullable(), () => undefined);

  envelope.slot(rule.string().optional(), () => 'x');
  envelope.slot(rule.string().optional(), () => undefined);
  // @ts-expect-error optional 不含 null
  envelope.slot(rule.string().optional(), () => null);

  envelope.slot(rule.string().optional().nullable(), () => 'x');
  envelope.slot(rule.string().optional().nullable(), () => null);
  envelope.slot(rule.string().optional().nullable(), () => undefined);

  // optional().nullable().required() → 去掉 undefined，保留 null
  envelope.slot(rule.string().optional().nullable().required(), () => 'x');
  envelope.slot(rule.string().optional().nullable().required(), () => null);
  // @ts-expect-error required 后不再接受 undefined
  envelope.slot(rule.string().optional().nullable().required(), () => undefined);

  envelope.slot(rule.number().nullable(), () => 1);
  envelope.slot(rule.number().nullable(), () => null);
  // @ts-expect-error
  envelope.slot(rule.number().nullable(), () => undefined);

  envelope.slot(rule.boolean().optional(), () => true);
  envelope.slot(rule.boolean().optional(), () => undefined);
  // @ts-expect-error
  envelope.slot(rule.boolean().optional(), () => null);

  // 必填标量不得返回 null / undefined
  // @ts-expect-error
  envelope.slot(rule.string(), () => null);
  // @ts-expect-error
  envelope.slot(rule.string(), () => undefined);
  // @ts-expect-error
  envelope.slot(rule.number(), () => null);
  // @ts-expect-error
  envelope.slot(rule.object({ id: rule.number() }), () => null);
}

// —— null / undefined：对象字段 ——
{
  const opt = {
    id: rule.number(),
    name: rule.string().optional(),
  } satisfies ValidatorToken;
  envelope.slot(opt, () => ({ id: 1 }));
  envelope.slot(opt, () => ({ id: 1, name: 'a' }));
  envelope.slot(opt, () => ({ id: 1, name: undefined }));
  // @ts-expect-error optional 字段不能是 null
  envelope.slot(opt, () => ({ id: 1, name: null }));
  // @ts-expect-error
  envelope.slot(opt, () => ({ id: 1, name: 1 }));
  // @ts-expect-error
  envelope.slot(opt, () => ({ id: 1, extra: true }));

  const nullable = {
    note: rule.string().nullable(),
  } satisfies ValidatorToken;
  envelope.slot(nullable, () => ({ note: 'x' }));
  envelope.slot(nullable, () => ({ note: null }));
  // @ts-expect-error nullable 字段不能是 undefined
  envelope.slot(nullable, () => ({ note: undefined }));
  // @ts-expect-error 缺必填 nullable 字段（null 也必须显式给出）
  envelope.slot(nullable, () => ({}));

  const mixed = {
    id: rule.number(),
    tag: rule.string().optional().nullable(),
  } satisfies ValidatorToken;
  envelope.slot(mixed, () => ({ id: 1 }));
  envelope.slot(mixed, () => ({ id: 1, tag: null }));
  envelope.slot(mixed, () => ({ id: 1, tag: undefined }));
  envelope.slot(mixed, () => ({ id: 1, tag: 't' }));
  // @ts-expect-error
  envelope.slot(mixed, () => ({ id: 1, tag: 1 }));

  // 多个可空字段组合
  const multi = {
    a: rule.string().nullable(),
    b: rule.number().optional(),
    c: rule.boolean().optional().nullable(),
  } satisfies ValidatorToken;
  envelope.slot(multi, () => ({ a: null }));
  envelope.slot(multi, () => ({ a: 'x', b: undefined, c: null }));
  envelope.slot(multi, () => ({ a: 'x', b: 1, c: true }));
  envelope.slot(multi, () => ({ a: 'x', b: 1, c: undefined }));
  // @ts-expect-error a 不能是 undefined
  envelope.slot(multi, () => ({ a: undefined }));
  // @ts-expect-error b 不能是 null
  envelope.slot(multi, () => ({ a: 'x', b: null }));
  // @ts-expect-error 缺必填 a
  envelope.slot(multi, () => ({ b: 1 }));

  // 嵌套对象可空
  const nestedNull = {
    user: rule
      .object({
        bio: rule.string(),
      })
      .nullable(),
  } satisfies ValidatorToken;
  envelope.slot(nestedNull, () => ({ user: null }));
  envelope.slot(nestedNull, () => ({ user: { bio: 'x' } }));
  // @ts-expect-error nullable 对象字段不能是 undefined
  envelope.slot(nestedNull, () => ({ user: undefined }));
  envelope.slot(nestedNull, () => ({
    user: {
      bio: 'x',
      // @ts-expect-error 非 null 时仍禁多余键
      extra: 1,
    },
  }));
  // @ts-expect-error 嵌套缺 bio
  envelope.slot(nestedNull, () => ({ user: {} }));

  // schema omit/pick 后的 null 字段
  const user = schema({
    id: rule.int(),
    note: rule.string().nullable(),
    memo: rule.string().optional(),
  });
  const withNote = user.omit('memo');
  envelope.slot(withNote, () => ({ id: 1, note: null }));
  envelope.slot(withNote, () => ({ id: 1, note: 'x' }));
  // @ts-expect-error
  envelope.slot(withNote, () => ({ id: 1, note: undefined }));
  envelope.slot(withNote, () => ({
    id: 1,
    note: null,
    // @ts-expect-error omit 后 memo 不得出现（含 undefined）
    memo: undefined,
  }));

  const withMemo = user.omit('note');
  envelope.slot(withMemo, () => ({ id: 1 }));
  envelope.slot(withMemo, () => ({ id: 1, memo: undefined }));
  envelope.slot(withMemo, () => ({
    id: 1,
    // @ts-expect-error omit 掉的 note 不得以 null 塞回
    note: null,
  }));
}

// —— 边界组合：对象/数组 × optional/nullable；falsy 合法值 ——
{
  // falsy 但是合法（不得与 null/undefined 混淆）
  envelope.slot(rule.string(), () => '');
  envelope.slot(rule.number(), () => 0);
  envelope.slot(rule.boolean(), () => false);
  envelope.slot({ n: rule.number() }, () => ({ n: 0 }));
  envelope.slot({ s: rule.string() }, () => ({ s: '' }));
  envelope.slot({ ok: rule.boolean() }, () => ({ ok: false }));

  // 顶层：对象 optional / nullable / 组合
  const obj = rule.object({ id: rule.number() });
  envelope.slot(obj.nullable(), () => null);
  envelope.slot(obj.nullable(), () => ({ id: 1 }));
  // @ts-expect-error
  envelope.slot(obj.nullable(), () => undefined);
  envelope.slot(obj.nullable(), () => ({
    id: 1,
    // @ts-expect-error 非 null 时禁多余键
    x: 1,
  }));

  envelope.slot(obj.optional(), () => undefined);
  envelope.slot(obj.optional(), () => ({ id: 1 }));
  // @ts-expect-error
  envelope.slot(obj.optional(), () => null);

  envelope.slot(obj.optional().nullable(), () => null);
  envelope.slot(obj.optional().nullable(), () => undefined);
  envelope.slot(obj.optional().nullable(), () => ({ id: 1 }));

  // 顶层：数组 optional / nullable
  const arr = rule.array(rule.number());
  envelope.slot(arr, () => []);
  envelope.slot(arr.nullable(), () => null);
  envelope.slot(arr.nullable(), () => [1]);
  // @ts-expect-error
  envelope.slot(arr.nullable(), () => undefined);
  envelope.slot(arr.optional(), () => undefined);
  envelope.slot(arr.optional(), () => [1]);
  // @ts-expect-error
  envelope.slot(arr.optional(), () => null);

  // 数组元素 nullable
  envelope.slot(rule.array(rule.string().nullable()), () => ['a', null]);
  // @ts-expect-error 元素不能是 undefined
  envelope.slot(rule.array(rule.string().nullable()), () => [undefined]);
  envelope.slot(rule.array(rule.string().optional()), () => ['a', undefined]);
  // @ts-expect-error 元素不能是 null
  envelope.slot(rule.array(rule.string().optional()), () => [null]);

  // 嵌套：可选对象字段（缺键 / undefined / null / 多余键）
  const nestedOpt = {
    profile: rule
      .object({
        bio: rule.string().optional(),
        level: rule.int().nullable(),
      })
      .optional(),
  } satisfies ValidatorToken;
  envelope.slot(nestedOpt, () => ({}));
  envelope.slot(nestedOpt, () => ({ profile: undefined }));
  envelope.slot(nestedOpt, () => ({ profile: { level: null } }));
  envelope.slot(nestedOpt, () => ({ profile: { bio: 'x', level: 1 } }));
  envelope.slot(nestedOpt, () => ({ profile: { bio: undefined, level: null } }));
  // @ts-expect-error profile 不能是 null（仅 optional）
  envelope.slot(nestedOpt, () => ({ profile: null }));
  // @ts-expect-error bio 不能是 null
  envelope.slot(nestedOpt, () => ({ profile: { bio: null, level: 1 } }));
  // @ts-expect-error level 不能是 undefined
  envelope.slot(nestedOpt, () => ({ profile: { level: undefined } }));
  envelope.slot(nestedOpt, () => ({
    profile: {
      bio: 'x',
      level: 1,
      // @ts-expect-error
      extra: true,
    },
  }));

  // 嵌套：可空对象 + 内层 optional/nullable
  const nestedNullable = {
    profile: rule
      .object({
        bio: rule.string().optional(),
        level: rule.int().nullable(),
      })
      .nullable(),
  } satisfies ValidatorToken;
  envelope.slot(nestedNullable, () => ({ profile: null }));
  envelope.slot(nestedNullable, () => ({ profile: { level: null } }));
  envelope.slot(nestedNullable, () => ({ profile: { bio: 'x', level: null } }));
  // @ts-expect-error level 为必填 nullable，不能省略
  envelope.slot(nestedNullable, () => ({ profile: {} }));
  // @ts-expect-error
  envelope.slot(nestedNullable, () => ({ profile: undefined }));
  // @ts-expect-error 缺必填 profile（null 须显式）
  envelope.slot(nestedNullable, () => ({}));

  // default()：Infer 去掉 undefined，返回值须有具体值
  envelope.slot(rule.string().optional().default('x'), () => 'y');
  // @ts-expect-error default 后 Infer 不再含 undefined
  envelope.slot(rule.string().optional().default('x'), () => undefined);

  // anyOf / oneOf 与 null
  envelope.slot(rule.anyOf([rule.string(), rule.literal(null)]), () => 'a');
  envelope.slot(rule.anyOf([rule.string(), rule.literal(null)]), () => null);
  // @ts-expect-error
  envelope.slot(rule.anyOf([rule.string(), rule.literal(null)]), () => undefined);

  envelope.slot(
    rule.oneOf([rule.object({ id: rule.number() }), rule.literal(null)]),
    () => null,
  );
  envelope.slot(
    rule.oneOf([rule.object({ id: rule.number() }), rule.literal(null)]),
    () => ({ id: 1 }),
  );
  envelope.slot(
    rule.oneOf([rule.object({ id: rule.number() }), rule.literal(null)]),
    () => ({
      id: 1,
      // @ts-expect-error 命中对象支时仍禁多余键
      x: 1,
    }),
  );
}

// —— anyOf / oneOf / allOf / any ——
{
  envelope.slot(rule.anyOf([rule.number(), rule.string()]), () => 1);
  envelope.slot(rule.anyOf([rule.number(), rule.string()]), () => 'x');
  // @ts-expect-error
  envelope.slot(rule.anyOf([rule.number(), rule.string()]), () => true);
  // @ts-expect-error anyOf 默认不含 null
  envelope.slot(rule.anyOf([rule.number(), rule.string()]), () => null);

  envelope.slot(rule.oneOf([rule.literal('a'), rule.literal('b')]), () => 'a' as const);
  // @ts-expect-error
  envelope.slot(rule.oneOf([rule.literal('a'), rule.literal('b')]), () => 'c');

  envelope.slot(rule.any(), () => 1);
  envelope.slot(rule.any(), () => ({ x: 1 }));
  envelope.slot(rule.any(), () => [1]);
  // @ts-expect-error any 默认 Infer 不含 null
  envelope.slot(rule.any(), () => null);
  // @ts-expect-error any 默认 Infer 不含 undefined
  envelope.slot(rule.any(), () => undefined);
}

// —— & / |：allOf / anyOf / oneOf 对象组合与嵌套 ——
{
  const shapeA = { a: rule.number() };
  const shapeB = { b: rule.string() };
  const shapeC = { c: rule.boolean() };

  // allOf → 交叉：须同时满足
  const allAB = rule.allOf([shapeA, shapeB]);
  envelope.slot(allAB, () => ({ a: 1, b: 'x' }));
  // @ts-expect-error 缺 b
  envelope.slot(allAB, () => ({ a: 1 }));
  // @ts-expect-error 缺 a
  envelope.slot(allAB, () => ({ b: 'x' }));
  envelope.slot(allAB, () => ({
    a: 1,
    b: 'x',
    // @ts-expect-error 交叉对象禁多余键
    x: 1,
  }));

  const allABC = rule.allOf([shapeA, shapeB, shapeC]);
  envelope.slot(allABC, () => ({ a: 1, b: 'x', c: true }));
  // @ts-expect-error
  envelope.slot(allABC, () => ({ a: 1, b: 'x' }));
  envelope.slot(allABC, () => ({
    a: 1,
    b: 'x',
    c: false,
    // @ts-expect-error
    z: 0,
  }));

  // allOf + nullable / optional
  envelope.slot(allAB.nullable(), () => null);
  envelope.slot(allAB.nullable(), () => ({ a: 1, b: 'x' }));
  // @ts-expect-error
  envelope.slot(allAB.nullable(), () => undefined);
  envelope.slot(allAB.optional(), () => undefined);
  // @ts-expect-error
  envelope.slot(allAB.optional(), () => null);
  envelope.slot(allAB.optional().nullable(), () => null);
  envelope.slot(allAB.optional().nullable(), () => undefined);

  // anyOf 两个对象 → 联合（Exact 对对象联合保守；成员完备性仍由 extends 约束）
  const anyAB = rule.anyOf([shapeA, shapeB]);
  envelope.slot(anyAB, () => ({ a: 1 }));
  envelope.slot(anyAB, () => ({ b: 'x' }));
  // @ts-expect-error 两支都不匹配
  envelope.slot(anyAB, () => ({ c: true }));
  // @ts-expect-error
  envelope.slot(anyAB, () => null);

  // oneOf 对象 | null
  const oneObjNull = rule.oneOf([rule.object(shapeA), rule.literal(null)]);
  envelope.slot(oneObjNull, () => null);
  envelope.slot(oneObjNull, () => ({ a: 1 }));
  // @ts-expect-error
  envelope.slot(oneObjNull, () => undefined);
  envelope.slot(oneObjNull, () => ({
    a: 1,
    // @ts-expect-error 命中对象支时禁多余键
    x: 1,
  }));

  // oneOf 两个对象支：各成员精确匹配，同时带上两边的键会失败
  const oneAB = rule.oneOf([rule.object(shapeA), rule.object(shapeB)]);
  envelope.slot(oneAB, () => ({ a: 1 }));
  envelope.slot(oneAB, () => ({ b: 'x' }));
  // @ts-expect-error 不能同时满足两个互斥成员
  envelope.slot(oneAB, () => ({ a: 1, b: 'x' }));
  // @ts-expect-error 空对象不匹配任一支
  envelope.slot(oneAB, () => ({}));

  // 字段级：交叉 / 联合嵌在 schema 字段里
  const nested = schema({
    both: rule.allOf([shapeA, shapeB]),
    either: rule.anyOf([shapeA, shapeB]),
    pickOne: rule.oneOf([rule.object(shapeA), rule.object(shapeB), rule.literal(null)]),
    andNull: rule.allOf([shapeA, shapeB]).nullable(),
    orUndef: rule.anyOf([shapeA, shapeB]).optional(),
  });

  envelope.slot(nested, () => ({
    both: { a: 1, b: 'x' },
    either: { a: 1 },
    pickOne: null,
    andNull: null,
  }));
  envelope.slot(nested, () => ({
    both: { a: 1, b: 'x' },
    either: { b: 'y' },
    pickOne: { a: 1 },
    andNull: { a: 1, b: 'x' },
    orUndef: undefined,
  }));
  envelope.slot(nested, () => ({
    both: {
      a: 1,
      b: 'x',
      // @ts-expect-error 交叉字段禁多余键
      z: 1,
    },
    either: { a: 1 },
    pickOne: null,
    andNull: null,
  }));
  envelope.slot(nested, () => ({
    // @ts-expect-error both 缺 b
    both: { a: 1 },
    either: { a: 1 },
    pickOne: null,
    andNull: null,
  }));
  envelope.slot(nested, () => ({
    both: { a: 1, b: 'x' },
    either: {
      // @ts-expect-error either 非法支
      c: true,
    },
    pickOne: null,
    andNull: null,
  }));
  envelope.slot(nested, () => ({
    both: { a: 1, b: 'x' },
    either: { a: 1 },
    pickOne: {
      a: 1,
      // @ts-expect-error 联合成员上的多余键
      x: 1,
    },
    andNull: null,
  }));
  envelope.slot(nested, () => ({
    both: { a: 1, b: 'x' },
    either: { a: 1 },
    pickOne: null,
    // @ts-expect-error andNull 不能 undefined
    andNull: undefined,
  }));
  envelope.slot(nested, () => ({
    both: { a: 1, b: 'x' },
    either: { a: 1 },
    pickOne: null,
    andNull: null,
    // @ts-expect-error orUndef 不能 null
    orUndef: null,
  }));

  // schema.extend 叠交叉感：pick 后 extend 另一组字段
  const left = schema(shapeA);
  const right = schema(shapeB);
  const merged = left.extend(right);
  envelope.slot(merged, () => ({ a: 1, b: 'x' }));
  // @ts-expect-error
  envelope.slot(merged, () => ({ a: 1 }));
  envelope.slot(merged, () => ({
    a: 1,
    b: 'x',
    // @ts-expect-error
    c: true,
  }));

  // TS 层 & / | 收窄后再喂给对应 schema
  type Both = Validator.Infer<typeof allAB>;
  type Either = Validator.Infer<typeof anyAB>;
  envelope.slot(allAB, (): Both => ({ a: 1, b: 'x' }));
  envelope.slot(anyAB, (): Either => ({ a: 1 }));
  envelope.slot(anyAB, (): Either => ({ b: 'x' }));
  // @ts-expect-error Both 缺字段
  envelope.slot(allAB, (): Both => ({ a: 1 }));
  // @ts-expect-error Either 不能同时瞎拼无关键当合法支（赋值阶段）
  envelope.slot(anyAB, (): Either => ({ c: 1 }));

  // Omit/Pick 作用在交叉 Infer 上
  type OnlyA = Pick<Both, 'a'>;
  type WithoutB = Omit<Both, 'b'>;
  const onlyASchema = schema(shapeA);
  envelope.slot(onlyASchema, (): OnlyA => ({ a: 1 }));
  envelope.slot(onlyASchema, (): WithoutB => ({ a: 1 }));
  envelope.slot(onlyASchema, () => {
    // @ts-expect-error
    const v: OnlyA = { a: 1, b: 'x' };
    return v;
  });
}

// —— record / additional（开放对象不拦多余键）——
{
  envelope.slot(rule.record(rule.number()), () => ({ a: 1, b: 2 }));
  envelope.slot(rule.object({}).additional({ value: rule.string() }), () => ({
    a: 'x',
    b: 'y',
  }));
}

// —— schema() + pick / omit / partial / extend / required ——
{
  const user = schema({
    id: rule.int(),
    name: rule.string(),
    email: rule.email(),
    age: rule.int().optional(),
    profile: {
      bio: rule.string(),
      level: rule.int(),
    },
  });

  envelope.slot(user, () => ({
    id: 1,
    name: 'a',
    email: 'a@b.c',
    profile: { bio: 'x', level: 1 },
  }));
  envelope.slot(user, () => ({
    id: 1,
    name: 'a',
    email: 'a@b.c',
    age: 18,
    profile: { bio: 'x', level: 1 },
  }));
  // @ts-expect-error 缺 email
  envelope.slot(user, () => ({
    id: 1,
    name: 'a',
    profile: { bio: 'x', level: 1 },
  }));
  envelope.slot(user, () => ({
    id: 1,
    name: 'a',
    email: 'a@b.c',
    profile: { bio: 'x', level: 1 },
    // @ts-expect-error 顶层多余
    extra: true,
  }));
  envelope.slot(user, () => ({
    id: 1,
    name: 'a',
    email: 'a@b.c',
    profile: {
      bio: 'x',
      level: 1,
      // @ts-expect-error 嵌套多余
      hobby: 'y',
    },
  }));

  const picked = user.pick('id', 'name');
  envelope.slot(picked, () => ({ id: 1, name: 'a' }));
  envelope.slot(picked, () => ({
    id: 1,
    name: 'a',
    // @ts-expect-error pick 后仍带 email
    email: 'a@b.c',
  }));
  // @ts-expect-error pick 后缺 name
  envelope.slot(picked, () => ({ id: 1 }));
  envelope.slot(picked, () => ({
    id: 1,
    name: 'a',
    // @ts-expect-error pick 后多余键
    x: 1,
  }));

  const omitted = user.omit('email', 'age');
  envelope.slot(omitted, () => ({
    id: 1,
    name: 'a',
    profile: { bio: 'x', level: 1 },
  }));
  envelope.slot(omitted, () => ({
    id: 1,
    name: 'a',
    // @ts-expect-error omit 掉的 email 不得再出现
    email: 'a@b.c',
    profile: { bio: 'x', level: 1 },
  }));
  envelope.slot(omitted, () => ({
    id: 1,
    name: 'a',
    profile: { bio: 'x', level: 1 },
    // @ts-expect-error omit 后多余键
    extra: 1,
  }));

  const partial = user.pick('name', 'email').partial();
  envelope.slot(partial, () => ({}));
  envelope.slot(partial, () => ({ name: 'a' }));
  envelope.slot(partial, () => ({ name: 'a', email: 'a@b.c' }));
  // @ts-expect-error partial 后仍禁止未 pick 的 id
  envelope.slot(partial, () => ({ id: 1 }));
  envelope.slot(partial, () => ({
    name: 'a',
    // @ts-expect-error partial 后多余键
    extra: true,
  }));

  const extended = user.pick('id').extend({ role: rule.string() });
  envelope.slot(extended, () => ({ id: 1, role: 'admin' }));
  // @ts-expect-error extend 后缺 role
  envelope.slot(extended, () => ({ id: 1 }));
  envelope.slot(extended, () => ({
    id: 1,
    role: 'admin',
    // @ts-expect-error extend 后多余
    x: 1,
  }));

  const requiredAge = user.pick('id', 'age').required();
  envelope.slot(requiredAge, () => ({ id: 1, age: 18 }));
  // @ts-expect-error required 后 age 必填
  envelope.slot(requiredAge, () => ({ id: 1 }));

  // 链式派生边界：omit→partial、pick→omit、extend 可空字段、partial→required
  const omitThenPartial = user.omit('id', 'profile').partial();
  envelope.slot(omitThenPartial, () => ({}));
  envelope.slot(omitThenPartial, () => ({ name: 'a', email: 'a@b.c', age: undefined }));
  // @ts-expect-error 已 omit 的 id 不得再出现
  envelope.slot(omitThenPartial, () => ({ id: 1 }));

  const pickThenOmit = user.pick('id', 'name', 'email').omit('email');
  envelope.slot(pickThenOmit, () => ({ id: 1, name: 'a' }));
  envelope.slot(pickThenOmit, () => ({
    id: 1,
    name: 'a',
    // @ts-expect-error
    email: 'a@b.c',
  }));

  const extendNullable = user.pick('id').extend({
    note: rule.string().nullable(),
    memo: rule.string().optional(),
  });
  envelope.slot(extendNullable, () => ({ id: 1, note: null }));
  envelope.slot(extendNullable, () => ({ id: 1, note: 'x', memo: undefined }));
  // @ts-expect-error 缺 note
  envelope.slot(extendNullable, () => ({ id: 1 }));
  // @ts-expect-error note 不能 undefined
  envelope.slot(extendNullable, () => ({ id: 1, note: undefined }));

  const partialThenRequired = user.pick('name', 'age').partial().required();
  envelope.slot(partialThenRequired, () => ({ name: 'a', age: 1 }));
  // @ts-expect-error required 后 name/age 都必填
  envelope.slot(partialThenRequired, () => ({ name: 'a' }));
  // @ts-expect-error
  envelope.slot(partialThenRequired, () => ({}));
}

// —— TS 工具类型 Omit/Pick 作用在 Infer 结果上再作为返回（经变量收窄）——
{
  const full = schema({
    id: rule.int(),
    name: rule.string(),
    email: rule.email(),
  });
  type Full = Validator.Infer<typeof full>;
  type Public = Omit<Full, 'email'>;
  type IdOnly = Pick<Full, 'id'>;

  const publicSchema = full.omit('email');
  envelope.slot(publicSchema, () => {
    const value: Public = { id: 1, name: 'a' };
    return value;
  });
  envelope.slot(publicSchema, () => {
    // @ts-expect-error Public 形状不得含 email
    const value: Public = { id: 1, name: 'a', email: 'a@b.c' };
    return value;
  });

  const idSchema = full.pick('id');
  envelope.slot(idSchema, () => {
    const value: IdOnly = { id: 1 };
    return value;
  });
  envelope.slot(idSchema, () => {
    // @ts-expect-error IdOnly 不得含 name
    const value: IdOnly = { id: 1, name: 'a' };
    return value;
  });

  // 直接用 Omit/Pick 收窄后的值喂给 omit/pick 后的 schema
  envelope.slot(publicSchema, (): Public => ({ id: 1, name: 'a' }));
  envelope.slot(idSchema, (): IdOnly => ({ id: 1 }));
  // @ts-expect-error 已收窄为 Public 后不得再展开多余键
  envelope.slot(publicSchema, () => {
    const slim: Public = { id: 1, name: 'a' };
    return { ...slim, email: 'a@b.c' };
  });
}

// —— 空对象 / 仅可选字段 ——
{
  envelope.slot(rule.object({}), () => ({}));
  // @ts-expect-error 空 object 仍禁止多余键
  envelope.slot(rule.object({}), () => ({ x: 1 }));

  const onlyOpt = { name: rule.string().optional() } satisfies ValidatorToken;
  envelope.slot(onlyOpt, () => ({}));
  envelope.slot(onlyOpt, () => ({ name: 'a' }));
  // @ts-expect-error
  envelope.slot(onlyOpt, () => ({ name: 'a', x: 1 }));
}

// —— 大杂烩对象：各种奇怪组合压进同一个 schema ——
{
  const kitchenSink = schema({
    id: rule.int(),
    score: rule.number(),
    flag: rule.boolean(),
    big: rule.bigint(),
    when: rule.date(),
    title: rule.string(),
    mail: rule.email(),
    site: rule.url(),
    uid: rule.uuid(),
    ulid: rule.ulid(),
    ip: rule.ip('v4'),
    digest: rule.hash('md5'),
    amount: rule.decimal(),
    status: rule.enum(['draft', 'published', 'archived'] as const),
    lit: rule.literal('fixed'),
    maybeNull: rule.literal(null),

    nick: rule.string().optional(),
    remark: rule.string().nullable(),
    tag: rule.string().optional().nullable(),
    code: rule.string().optional().nullable().required(),
    label: rule.string().optional().default('n/a'),

    payload: rule.anyOf([rule.string(), rule.number(), rule.literal(null)]),
    mode: rule.oneOf([rule.literal('a'), rule.literal('b')]),

    tags: rule.array(rule.string()),
    nums: rule.array(rule.number().nullable()),
    softTags: rule.array(rule.string().optional()),
    items: rule.array({
      sku: rule.string(),
      qty: rule.int().optional(),
      meta: rule.object({ color: rule.string().nullable() }).optional(),
    }),
    maybeList: rule.array(rule.int()).nullable(),
    softList: rule.array(rule.int()).optional(),

    profile: {
      bio: rule.string().optional(),
      level: rule.int().nullable(),
      prefs: rule
        .object({
          theme: rule.enum(['light', 'dark'] as const),
          lang: rule.string().optional(),
        })
        .optional(),
    },
    address: rule
      .object({
        city: rule.string(),
        zip: rule.string().nullable(),
        geo: rule
          .object({
            lat: rule.number(),
            lng: rule.number(),
          })
          .nullable(),
      })
      .nullable(),
    settings: rule
      .object({
        open: rule.boolean(),
        limit: rule.int().optional(),
      })
      .optional(),

    bag: rule.record(rule.number()),
    closed: rule.object({ only: rule.string() }),
    empty: rule.object({}),
  });

  type Sink = Validator.Infer<typeof kitchenSink>;

  /** 合法最小完备值（可选字段尽量省略，falsy / null 用满） */
  const baseMinimal = (): Sink => ({
    id: 0,
    score: 0,
    flag: false,
    big: 0n,
    when: new Date(0),
    title: '',
    mail: 'a@b.c',
    site: 'https://a.b',
    uid: '00000000-0000-0000-0000-000000000000',
    ulid: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
    ip: '127.0.0.1',
    digest: 'd41d8cd98f00b204e9800998ecf8427e',
    amount: new Decimal(0),
    status: 'draft',
    lit: 'fixed',
    maybeNull: null,
    remark: null,
    code: null,
    label: 'n/a',
    payload: null,
    mode: 'a',
    tags: [],
    nums: [1, null, 0],
    softTags: ['x', undefined],
    items: [{ sku: '' }],
    maybeList: null,
    profile: { level: null },
    address: null,
    bag: {},
    closed: { only: '' },
    empty: {},
  });

  /** 合法最大完备值（可选/嵌套全展开） */
  const baseFull = (): Sink => ({
    id: 1,
    score: 1.5,
    flag: true,
    big: 1n,
    when: new Date(),
    title: 't',
    mail: 'a@b.c',
    site: 'https://a.b',
    uid: '00000000-0000-0000-0000-000000000000',
    ulid: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
    ip: '127.0.0.1',
    digest: 'd41d8cd98f00b204e9800998ecf8427e',
    amount: new Decimal('1.23'),
    status: 'published',
    lit: 'fixed',
    maybeNull: null,
    nick: 'n',
    remark: null,
    tag: undefined,
    code: 'c',
    label: 'l',
    payload: 1,
    mode: 'b',
    tags: ['a', 'b'],
    nums: [null],
    softTags: [undefined],
    items: [
      { sku: 's', qty: 1, meta: { color: null } },
      { sku: 's2', qty: undefined, meta: undefined },
    ],
    maybeList: [1, 2],
    softList: undefined,
    profile: {
      bio: 'x',
      level: 1,
      prefs: { theme: 'dark', lang: 'zh' },
    },
    address: {
      city: 'SH',
      zip: null,
      geo: { lat: 0, lng: 0 },
    },
    settings: { open: false, limit: 0 },
    bag: { a: 1, b: 2 },
    closed: { only: 'x' },
    empty: {},
  });

  envelope.slot(kitchenSink, () => baseMinimal());
  envelope.slot(kitchenSink, () => baseFull());

  // @ts-expect-error 缺大量必填
  envelope.slot(kitchenSink, () => ({ id: 1 }));

  // 顶层多余键
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    __extra: true,
  }));

  // null / undefined 互斥与 required/default
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    maybeNull: undefined,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    nick: null,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    remark: undefined,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    code: undefined,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    label: undefined,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    payload: undefined,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    mode: 'c',
  }));

  // 数组元素 null/undefined 互斥
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    nums: [undefined],
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    softTags: [null],
  }));

  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    items: [
      {
        sku: 's',
        meta: {
          color: null,
          // @ts-expect-error 数组元素内多余键
          x: 1,
        },
      },
    ],
  }));

  // profile.level 必填 nullable；prefs.lang 不能 null；theme 字面量
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error profile.level 必填
    profile: {},
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    profile: {
      level: null,
      prefs: {
        theme: 'light' as const,
        // @ts-expect-error
        lang: null,
      },
    },
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    profile: {
      level: null,
      prefs: {
        // @ts-expect-error
        theme: 'blue' as 'blue',
      },
    },
  }));

  // address / geo / settings
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    address: {
      city: 'SH',
      zip: null,
      geo: {
        lat: 1,
        lng: 2,
        // @ts-expect-error
        alt: 3,
      },
    },
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    address: undefined,
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    // @ts-expect-error
    settings: null,
  }));

  // closed / empty 禁多余键；bag record 允许多余动态键
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    closed: {
      only: 'x',
      // @ts-expect-error
      more: 1,
    },
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    empty: {
      // @ts-expect-error
      x: 1,
    },
  }));
  envelope.slot(kitchenSink, () => ({
    ...baseMinimal(),
    bag: { any: 1, key: 2, works: 3 },
  }));

  // 派生：omit / pick 后再验
  const publicSink = kitchenSink.omit('digest', 'ip', 'bag');
  type PublicSink = Validator.Infer<typeof publicSink>;
  const publicBase = (): PublicSink => {
    const { digest: _d, ip: _i, bag: _b, ...rest } = baseMinimal();
    return rest;
  };
  envelope.slot(publicSink, () => publicBase());
  envelope.slot(publicSink, () => ({
    ...publicBase(),
    // @ts-expect-error
    digest: 'x',
  }));

  const tiny = kitchenSink.pick('id', 'tag', 'address');
  envelope.slot(tiny, () => ({ id: 1, address: null }));
  envelope.slot(tiny, () => ({ id: 1, tag: null, address: null }));
  envelope.slot(tiny, () => ({ id: 1, tag: undefined, address: null }));
  envelope.slot(tiny, () => ({
    id: 1,
    address: null,
    // @ts-expect-error
    title: 't',
  }));

  // omit→partial 链式：大杂烩裁一刀后再变全可选
  const slimPartial = kitchenSink
    .pick('id', 'nick', 'remark', 'tag', 'code')
    .omit('id')
    .partial();
  envelope.slot(slimPartial, () => ({}));
  envelope.slot(slimPartial, () => ({
    nick: 'n',
    remark: null,
    tag: undefined,
    code: 'c',
  }));
  // @ts-expect-error 已 omit 的 id
  envelope.slot(slimPartial, () => ({ id: 1 }));
  // @ts-expect-error nick 不能 null
  envelope.slot(slimPartial, () => ({ nick: null }));
  // partial 后 remark 可为 undefined（合法）
  envelope.slot(slimPartial, () => ({ remark: undefined }));
}
