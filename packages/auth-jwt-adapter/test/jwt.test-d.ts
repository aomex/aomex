import { jwtAdapter } from '../src';
import { type TypeEqual, expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { authentication } from '@aomex/auth';

// 密码
{
  jwtAdapter({ secret: '' });
  jwtAdapter({ publicKey: '', privateKey: '' });

  // @ts-expect-error
  jwtAdapter();
  // @ts-expect-error
  jwtAdapter({});
  // @ts-expect-error
  jwtAdapter({ publicKey: '' });
  // @ts-expect-error
  jwtAdapter({ privateKey: '' });
}

// 泛型
{
  const jwt = jwtAdapter<{ userId: number }>({ secret: '' });
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
