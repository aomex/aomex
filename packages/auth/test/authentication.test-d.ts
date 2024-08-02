import { expectType, type TypeEqual } from 'ts-expect';
import { authentication, AuthenticationAdapter } from '../src';
import { Middleware } from '@aomex/core';

// 字符串
{
  let adapter!: AuthenticationAdapter<'foo'>;
  const auth = authentication(adapter);
  expectType<TypeEqual<Middleware.Infer<typeof auth>, { readonly auth: 'foo' }>>(true);
}

// 对象
{
  let adapter!: AuthenticationAdapter<{ foo: 'bar' }>;
  const auth = authentication(adapter);
  expectType<TypeEqual<Middleware.Infer<typeof auth>, { readonly auth: { foo: 'bar' } }>>(
    true,
  );
}

// 自定义authKey
{
  let adapter!: AuthenticationAdapter<{ foo: 'bar' }>;
  const auth = authentication(adapter, 'admin');
  expectType<
    TypeEqual<Middleware.Infer<typeof auth>, { readonly admin: { foo: 'bar' } }>
  >(true);
}
