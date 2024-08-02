import { JWTAdapter } from '../src';
import { type TypeEqual, expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { authentication } from '@aomex/auth';

// 密码
{
  new JWTAdapter({ secret: '' });
  new JWTAdapter({ publicKey: '', privateKey: '' });

  // @ts-expect-error
  new JWTAdapter();
  // @ts-expect-error
  new JWTAdapter({});
  // @ts-expect-error
  new JWTAdapter({ publicKey: '' });
  // @ts-expect-error
  new JWTAdapter({ privateKey: '' });
}

// 泛型
{
  const jwt = new JWTAdapter<{ userId: number }>({ secret: '' });
  const md = authentication(jwt);
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly auth: { userId: number };
      }>,
      typeof md
    >
  >(true);
}
