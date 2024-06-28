import { JWT } from '../src';
import { type TypeEqual, expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';

// 密码
{
  new JWT({ secret: '' });
  new JWT({ publicKey: '', privateKey: '' });

  // @ts-expect-error
  new JWT();
  // @ts-expect-error
  new JWT({});
  // @ts-expect-error
  new JWT({ publicKey: '' });
  // @ts-expect-error
  new JWT({ privateKey: '' });
}

// 泛型
{
  const jwt = new JWT<{ userId: number }>({ secret: '' });
  const md = jwt.middleware;
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly jwt: {
          user: { userId: number };
          token: string;
        };
      }>,
      typeof md
    >
  >(true);
}
