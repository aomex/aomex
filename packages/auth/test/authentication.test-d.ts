import { expectType, type TypeEqual } from 'ts-expect';
import { Authentication, Strategy } from '../src';
import { Middleware } from '@aomex/core';

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

// 中间件：自定义contextKey
{
  let strategy!: Strategy<{ foo: 'bar' }>;
  const auth = new Authentication({
    strategies: { foo: strategy },
  }).authenticate('foo', { contextKey: 'foo-bar' });
  expectType<
    TypeEqual<Middleware.Infer<typeof auth>, { readonly 'foo-bar': { foo: 'bar' } }>
  >(true);
}
