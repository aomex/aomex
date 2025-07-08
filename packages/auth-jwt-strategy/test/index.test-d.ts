import { JwtStrategy } from '../src';
import { type TypeEqual, expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { Auth } from '@aomex/auth';

// 密码
{
  new JwtStrategy({ secret: '', onVerified: (payload) => payload });
  new JwtStrategy({ publicKey: '', privateKey: '', onVerified: (payload) => payload });

  // @ts-expect-error
  new JwtStrategy();
  // @ts-expect-error
  new JwtStrategy({});
  // @ts-expect-error
  new JwtStrategy({ onVerified: (payload) => payload });
  // @ts-expect-error
  new JwtStrategy({ publicKey: '', onVerified: (payload) => payload });
  // @ts-expect-error
  new JwtStrategy({ privateKey: '', onVerified: (payload) => payload });
}

// 类型自动推导
{
  const jwt = new JwtStrategy({
    secret: '',
    onVerified(payload: { userId: number }, _ctx, _token) {
      return payload;
    },
  });
  const md = new Auth({ strategies: { jwt } }).authenticate('jwt');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<TypeEqual<{ readonly jwt: { userId: number } }, T>>(true);
}

// 返回处理过的值
{
  const jwt = new JwtStrategy({
    secret: '',
    async onVerified(_payload: { userId: number }) {
      return { hello: 'world' };
    },
  });
  const md = new Auth({ strategies: { jwt } }).authenticate('jwt');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<TypeEqual<{ readonly jwt: { hello: string } }, T>>(true);
}

// 认证加授权
{
  const jwt = new JwtStrategy({
    secret: '',
    onVerified(payload: { userId: number }, _ctx, _token) {
      return payload;
    },
    onAuthorize(_role: 0 | 1, _test: 'yes' | 'no') {
      const data = this.getIdentity();
      expectType<TypeEqual<typeof data.userId, number>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { jwt } });
  // @ts-expect-error
  auth.authenticate('jwt').authorize(0);
  // @ts-expect-error
  auth.authenticate('jwt').authorize(0, 'noo');
  // @ts-expect-error
  auth.authenticate('jwt').authorize(0, 'no', 'y');
  const md = auth.authenticate('jwt').authorize(0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly jwt: {
          userId: number;
        };
      },
      T
    >
  >(true);
}

// 授权
{
  const jwt = new JwtStrategy({
    secret: '',
    onVerified(payload: { userId: number }, _ctx, _token) {
      return payload;
    },
    onAuthorize(_role: 0 | 1, _test: 'yes' | 'no') {
      return true;
    },
  });
  const auth = new Auth({ strategies: { jwt } });
  // @ts-expect-error
  auth.authorize('jwt', 0);
  // @ts-expect-error
  auth.authorize('jwt', 0, 'noo');
  // @ts-expect-error
  auth.authorize('jwt', 0, 'no', 'y');
  // @ts-expect-error
  auth.authorize('jwt1', 0, 'no');
  const md = auth.authorize('jwt', 0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<TypeEqual<object, T>>(true);
}

// 无授权
{
  const bearer = new JwtStrategy({
    secret: '',
    onVerified(_token) {
      return { userId: 1 };
    },
  });
  const auth = new Auth({ strategies: { bearer } });
  auth.authorize('bearer');
  // @ts-expect-error
  auth.authorize('bearer', 0);
  // @ts-expect-error
  auth.authorize('bearer1', 0, 'no');
  // @ts-expect-error
  auth.authorize('bearer', 0, 1, 3);
}

// 扩展数组
{
  const bearer = new JwtStrategy({
    secret: '',
    onVerified(_token) {
      return { userId: 1 };
    },
    onAuthorize: (...roles: number[]) => {
      return roles.length > 1;
    },
  });
  const auth = new Auth({ strategies: { bearer } });
  auth.authorize('bearer');
  auth.authorize('bearer', 0);
  // @ts-expect-error
  auth.authorize('bearer1', 0, 'no');
  auth.authorize('bearer', 0, 1, 3);
}

// 自循环
{
  new JwtStrategy({
    secret: '',
    onVerified(_token) {
      return { userId: 1 };
    },
    onAuthorize(role: 0 | 1) {
      const identity = this.getIdentity();
      return identity.userId === role;
    },
  });

  new JwtStrategy({
    secret: '',
    onVerified(_token) {
      return { userId: 1 };
    },
    onAuthorize: (role: 0 | 1) => (identity) => {
      return identity.userId === role;
    },
  });
}
