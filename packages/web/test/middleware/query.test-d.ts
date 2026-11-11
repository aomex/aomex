import { type TypeEqual, expectType } from 'ts-expect';
import { WebMiddleware, query } from '../../src';
import { Validator, rule, schema } from '@aomex/common';

// 字段表：必填 + optional
{
  const mdw = query({
    test: rule.string(),
    test1: rule.number().optional(),
  });

  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly query: { test: string } & { test1?: number | undefined };
      }>,
      typeof mdw
    >
  >(true);

  expectType<
    TypeEqual<
      WebMiddleware<{ readonly query: { test: string; test1: number | undefined } }>,
      typeof mdw
    >
  >(false);
}

// schema 直传
{
  const filterSchema = schema({
    keyword: rule.string().optional(),
    page: rule.int().default(1),
  });
  const mdw = query(filterSchema);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly query: { keyword?: string | undefined } & { page: number };
      }>,
      typeof mdw
    >
  >(true);
}

// schema 派生
{
  const base = schema({
    name: rule.string(),
    status: rule.enum(['on', 'off']),
    page: rule.int(),
  });
  const mdw = query(base.pick('name', 'status').partial());
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly query: {
          name?: string | undefined;
          status?: 'on' | 'off' | undefined;
        };
      }>,
      typeof mdw
    >
  >(true);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly query: {
          name?: string | undefined;
          status?: 'on' | 'off' | undefined;
          page?: number | undefined;
        };
      }>,
      typeof mdw
    >
  >(false);
}

// 空对象
{
  const mdw = query({});
  expectType<TypeEqual<WebMiddleware<{ readonly query: {} }>, typeof mdw>>(true);
}

// transform
{
  const mdw = query({
    q: rule.string().transform((s) => s.trim()),
  });
  expectType<TypeEqual<WebMiddleware<{ readonly query: { q: string } }>, typeof mdw>>(
    true,
  );
}

// 宽类型 Record
{
  const fields: Record<string, Validator> = { q: rule.string() };
  const mdw = query(fields);
  expectType<
    TypeEqual<WebMiddleware<{ readonly query: { [x: string]: unknown } }>, typeof mdw>
  >(true);
  expectType<TypeEqual<WebMiddleware<{ readonly query: { q: string } }>, typeof mdw>>(
    false,
  );
}

// 嵌套裸对象：内层交叉
{
  const mdw = query({
    filter: {
      keyword: rule.string(),
      page: rule.int().optional(),
    },
  });
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly query: {
          filter: { keyword: string } & { page?: number | undefined };
        };
      }>,
      typeof mdw
    >
  >(true);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly query: { filter: { keyword: string; page: number | undefined } };
      }>,
      typeof mdw
    >
  >(false);
}

// 非法
{
  // @ts-expect-error
  query({ id: 1 });
  // @ts-expect-error 裸校验器
  query(rule.string());
  // @ts-expect-error
  query(rule.object({ q: rule.string() }));
}
