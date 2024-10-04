import { JwtStrategy } from '../src';
import { type TypeEqual, expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { Authentication } from '@aomex/auth';

// 密码
{
  new JwtStrategy({ secret: '' });
  new JwtStrategy({ publicKey: '', privateKey: '' });

  // @ts-expect-error
  new JwtStrategy();
  // @ts-expect-error
  new JwtStrategy({});
  // @ts-expect-error
  new JwtStrategy({ publicKey: '' });
  // @ts-expect-error
  new JwtStrategy({ privateKey: '' });
}

// 泛型
{
  const jwt = new JwtStrategy<{ userId: number }>({ secret: '' });
  const md = new Authentication({ strategies: { jwt } }).authenticate('jwt');
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly jwt: { userId: number };
      }>,
      typeof md
    >
  >(true);
}

// 返回处理过的值
{
  const jwt = new JwtStrategy<{ userId: number }, { hello: string }>({
    secret: '',
    async onVerified({ payload }) {
      expectType<{ userId: Number }>(payload);
      return { hello: 'world' };
    },
  });
  const md = new Authentication({ strategies: { jwt } }).authenticate('jwt');
  expectType<
    TypeEqual<
      WebMiddleware<{
        readonly jwt: { hello: string };
      }>,
      typeof md
    >
  >(true);
}
