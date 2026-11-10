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

// schema.object() 嵌套进字段表
{
  const profileSchema = schema({
    bio: rule.string(),
  });
  const mdw = body({
    profile: profileSchema.object(),
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
  // @ts-expect-error 嵌套裸对象，不是 rule.object
  body({ profile: { bio: rule.string() } });
  // @ts-expect-error
  body({ fn: () => 1 });
  // @ts-expect-error 裸校验器不是字段表/schema
  body(rule.string());
  // @ts-expect-error
  body(rule.object({ id: rule.int() }));
}

// ValidatorToken 比 body 更宽（含裸 Validator），不能直接塞
{
  const token: ValidatorToken = rule.string();
  // @ts-expect-error
  body(token);
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
