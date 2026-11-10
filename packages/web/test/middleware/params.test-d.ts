import { type TypeEqual, expectType } from 'ts-expect';
import { WebMiddleware, params } from '../../src';
import { Validator, rule, schema } from '@aomex/common';

// 字段表：必填 + optional
{
  const mdw = params({
    test: rule.string(),
    test1: rule.number().optional(),
  });

  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly params: { test: string } & { test1?: number | undefined };
      }>,
      typeof mdw
    >
  >(true);

  expectType<
    TypeEqual<
      WebMiddleware<{ readonly params: { test: string; test1: number | undefined } }>,
      typeof mdw
    >
  >(false);
}

// schema 直传
{
  const idSchema = schema({
    id: rule.int(),
    slug: rule.string(),
  });
  const mdw = params(idSchema);
  expectType<
    TypeEqual<
      WebMiddleware<{ readonly params: { id: number; slug: string } }>,
      typeof mdw
    >
  >(true);
}

// schema pick
{
  const base = schema({
    id: rule.int(),
    name: rule.string(),
  });
  const mdw = params(base.pick('id'));
  expectType<TypeEqual<WebMiddleware<{ readonly params: { id: number } }>, typeof mdw>>(
    true,
  );
  expectType<
    TypeEqual<
      WebMiddleware<{ readonly params: { id: number; name: string } }>,
      typeof mdw
    >
  >(false);
}

// 空对象
{
  const mdw = params({});
  expectType<TypeEqual<WebMiddleware<{ readonly params: {} }>, typeof mdw>>(true);
}

// uuid / enum
{
  const mdw = params({
    id: rule.uuid(),
    type: rule.enum(['a', 'b']),
  });
  expectType<
    TypeEqual<
      WebMiddleware<{ readonly params: { id: string; type: 'a' | 'b' } }>,
      typeof mdw
    >
  >(true);
}

// 宽类型 Record
{
  const fields: Record<string, Validator> = { id: rule.int() };
  const mdw = params(fields);
  expectType<
    TypeEqual<WebMiddleware<{ readonly params: { [x: string]: unknown } }>, typeof mdw>
  >(true);
  expectType<TypeEqual<WebMiddleware<{ readonly params: { id: number } }>, typeof mdw>>(
    false,
  );
}

// 非法
{
  // @ts-expect-error
  params({ id: 1 });
  // @ts-expect-error
  params({ nested: { id: rule.int() } });
  // @ts-expect-error 裸校验器
  params(rule.int());
  // @ts-expect-error
  params(rule.object({ id: rule.int() }));
}
