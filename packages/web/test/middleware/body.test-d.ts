import { type TypeEqual, expectType } from 'ts-expect';
import { WebMiddleware, body, FileValidator } from '../../src';
import { Validator, rule, schema, type ValidatorToken } from '@aomex/common';

// 字段表：必填 + optional
{
  const mdw = body({
    test: rule.string(),
    test1: rule.number().optional(),
  });

  expectType<
    TypeEqual<
      WebMiddleware<{ readonly body: { test: string } & { test1?: number | undefined } }>,
      typeof mdw
    >
  >(true);

  expectType<
    TypeEqual<
      WebMiddleware<{ readonly body: { test: string; test1: number | undefined } }>,
      typeof mdw
    >
  >(false);
}

// schema 直传
{
  const userSchema = schema({
    id: rule.int(),
    name: rule.string().optional(),
  });
  const mdw = body(userSchema);
  expectType<
    TypeEqual<
      WebMiddleware<{ readonly body: { id: number } & { name?: string | undefined } }>,
      typeof mdw
    >
  >(true);
}

// schema 派生后再传
{
  const base = schema({
    id: rule.int(),
    name: rule.string(),
    email: rule.email(),
    age: rule.int().optional(),
  });
  const mdw = body(base.omit('id').partial('email'));
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: { name: string } & {
          email?: string | undefined;
          age?: number | undefined;
        };
      }>,
      typeof mdw
    >
  >(true);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: {
          id: number;
          name: string;
          email?: string | undefined;
          age?: number | undefined;
        };
      }>,
      typeof mdw
    >
  >(false);
}

// 空对象
{
  const mdw = body({});
  expectType<TypeEqual<WebMiddleware<{ readonly body: {} }>, typeof mdw>>(true);
}

// default：Infer 为必有值
{
  const mdw = body({
    page: rule.int().default(1),
    keyword: rule.string().optional(),
  });
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: { page: number } & { keyword?: string | undefined };
      }>,
      typeof mdw
    >
  >(true);
}

// transform
{
  const mdw = body({
    name: rule.string().transform((s) => s.length),
  });
  expectType<TypeEqual<WebMiddleware<{ readonly body: { name: number } }>, typeof mdw>>(
    true,
  );
}

// enum / nullable
{
  const mdw = body({
    role: rule.enum(['admin', 'user']),
    note: rule.string().nullable(),
  });
  expectType<
    TypeEqual<
      WebMiddleware<{ readonly body: { role: 'admin' | 'user'; note: string | null } }>,
      typeof mdw
    >
  >(true);
}

// 嵌套 object
{
  const mdw = body({
    profile: rule.object({
      bio: rule.string(),
      age: rule.int().optional(),
    }),
  });
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: {
          profile: { bio: string } & { age?: number | undefined };
        };
      }>,
      typeof mdw
    >
  >(true);
}

// 嵌套裸对象：等价 rule.object；内外交叉，拒绝扁平必填形态
{
  const mdw = body({
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  });
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: {
          profile: { bio: string } & { age?: number | undefined };
        };
      }>,
      typeof mdw
    >
  >(true);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: { profile: { bio: string; age: number | undefined } };
      }>,
      typeof mdw
    >
  >(false);
}

// 外层交叉 + 嵌套交叉
{
  const mdw = body({
    id: rule.int(),
    remark: rule.string().optional(),
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  });
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: {
          id: number;
          profile: { bio: string } & { age?: number | undefined };
        } & {
          remark?: string | undefined;
        };
      }>,
      typeof mdw
    >
  >(true);
}

// rule.object(schema) 嵌套进字段表
{
  const profileSchema = schema({
    bio: rule.string(),
  });
  const mdw = body({
    profile: rule.object(profileSchema),
  });
  expectType<
    TypeEqual<WebMiddleware<{ readonly body: { profile: { bio: string } } }>, typeof mdw>
  >(true);
}

// 宽类型 Record：推断变宽
{
  const fields: Record<string, Validator> = {
    id: rule.int(),
  };
  const mdw = body(fields);
  expectType<
    TypeEqual<WebMiddleware<{ readonly body: { [x: string]: unknown } }>, typeof mdw>
  >(true);
  expectType<TypeEqual<WebMiddleware<{ readonly body: { id: number } }>, typeof mdw>>(
    false,
  );
}

// 非法：非 Validator 值
{
  // @ts-expect-error
  body({ id: 1 });
  // @ts-expect-error
  body({ name: 'x' });
  // @ts-expect-error
  body({ ok: true });
  // @ts-expect-error
  body({ fn: () => 1 });
}

// 裸 Validator（与 response content 对齐）
{
  const mdw = body(rule.string());
  expectType<TypeEqual<WebMiddleware<{ readonly body: string }>, typeof mdw>>(true);
}

{
  const mdw = body(rule.number());
  expectType<TypeEqual<WebMiddleware<{ readonly body: number }>, typeof mdw>>(true);
}

{
  const mdw = body(rule.boolean());
  expectType<TypeEqual<WebMiddleware<{ readonly body: boolean }>, typeof mdw>>(true);
}

{
  const mdw = body(rule.array(rule.int()));
  expectType<TypeEqual<WebMiddleware<{ readonly body: number[] }>, typeof mdw>>(true);
}

{
  const mdw = body(rule.object({ id: rule.int() }));
  expectType<TypeEqual<WebMiddleware<{ readonly body: { id: number } }>, typeof mdw>>(
    true,
  );
}

{
  const token: ValidatorToken = rule.string();
  const mdw = body(token);
  expectType<TypeEqual<WebMiddleware<{ readonly body: unknown }>, typeof mdw>>(true);
}

// 文件字段（web 扩展）
{
  const mdw = body({
    file: rule.file(),
    title: rule.string(),
  });
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly body: { file: FileValidator.FormidableFile; title: string };
      }>,
      typeof mdw
    >
  >(true);
}
