import type { Middleware } from '@aomex/core';
import { expectType, TypeEqual } from 'ts-expect';
import { describe } from 'vitest';
import { jwt, JWTOptions } from '../src';

describe('normal', () => {
  const plugin = jwt({ secret: '' });
  expectType<
    TypeEqual<
      Middleware.Infer<typeof plugin>,
      { readonly jwt: { user: object; token: string } }
    >
  >(true);
});

describe('user interface', () => {
  {
    const plugin = jwt<{ hello: 'x' }>({ secret: '' });
    expectType<
      TypeEqual<
        Middleware.Infer<typeof plugin>,
        { readonly jwt: { user: { hello: 'x' }; token: string } }
      >
    >(true);
  }

  {
    const plugin = jwt<string>({ secret: '' });
    expectType<
      TypeEqual<
        Middleware.Infer<typeof plugin>,
        { readonly jwt: { user: string; token: string } }
      >
    >(true);
  }
});

describe('invalid usage', () => {
  jwt<JWTOptions['algorithms']>({ secret: '' });
  // @ts-expect-error
  jwt<JWTOptions['complete']>({ secret: '' });
  // @ts-expect-error
  jwt();
  // @ts-expect-error
  jwt({});
});
