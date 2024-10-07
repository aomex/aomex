import { expectType, type TypeEqual } from 'ts-expect';
import { Authentication, Strategy } from '../src';
import { Middleware } from '@aomex/core';
import { Router } from '@aomex/web';

// 策略
{
  let strategy1!: Strategy<'foo'>;
  let strategy2!: Strategy<'bar'>;
  const auth = new Authentication({
    strategies: { foo: strategy1, bar: strategy2 },
  });

  auth.strategy('foo');
  auth.strategy('bar');
  // @ts-expect-error
  auth.strategy('fooo');

  new Authentication({
    strategies: {
      foo: strategy1,
      // @ts-expect-error
      bar: {},
    },
  });
}

// 中间件：字符串
{
  let strategy!: Strategy<'foo'>;
  const auth = new Authentication({
    strategies: { foo: strategy },
  }).authenticate('foo');
  expectType<TypeEqual<Middleware.Infer<typeof auth>, { readonly foo: 'foo' }>>(true);
}

// 中间件：对象
{
  let strategy!: Strategy<{ foo: 'bar' }>;
  const auth = new Authentication({
    strategies: { foo: strategy },
  }).authenticate('foo');
  expectType<TypeEqual<Middleware.Infer<typeof auth>, { readonly foo: { foo: 'bar' } }>>(
    true,
  );
}

// 在路由组使用
{
  let strategy!: Strategy<{ foo: 'bar' }>;
  const auth = new Authentication({
    strategies: { authFoo: strategy },
  });

  new Router({ mount: [auth.authenticate('authFoo')] }).get('test-auth', {
    action: (ctx) => {
      const data = ctx.authFoo;
      expectType<TypeEqual<{ foo: 'bar' }, typeof data>>(true);
    },
  });

  new Router().get('test-auth', {
    mount: [auth.authenticate('authFoo')],
    action: (ctx) => {
      const data = ctx.authFoo;
      expectType<TypeEqual<{ foo: 'bar' }, typeof data>>(true);
    },
  });
}
