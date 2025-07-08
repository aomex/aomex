import { Auth } from '@aomex/auth';
import { BearerStrategy } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';
import { WebMiddleware } from '@aomex/web';

// 身份信息自动推导
{
  const bearer = new BearerStrategy({
    async onLoaded(_token) {
      return { userId: 1 };
    },
  });
  const md = new Auth({ strategies: { bearer } }).authenticate('bearer');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly bearer: {
          readonly token: string;
          readonly data: {
            userId: number;
          };
        };
      },
      T
    >
  >(true);
}

// 认证加授权
{
  const bearer = new BearerStrategy({
    async onLoaded(_token) {
      return { userId: 1 };
    },
    onAuthorize(_role: 0 | 1, _test: 'yes' | 'no') {
      const data = this.getIdentity();
      expectType<TypeEqual<typeof data.userId, number>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { bearer } });
  // @ts-expect-error
  auth.authenticate('bearer').authorize(0);
  // @ts-expect-error
  auth.authenticate('bearer').authorize(0, 'noo');
  // @ts-expect-error
  auth.authenticate('bearer').authorize(0, 'no', 'y');
  const md = auth.authenticate('bearer').authorize(0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly bearer: {
          readonly token: string;
          readonly data: {
            userId: number;
          };
        };
      },
      T
    >
  >(true);
}

// 授权
{
  const bearer = new BearerStrategy({
    async onLoaded(_token) {
      return { userId: 1 };
    },
    onAuthorize: (_role: 0 | 1, _test: 'yes' | 'no') => (data) => {
      expectType<TypeEqual<typeof data.userId, number>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { bearer } });
  // @ts-expect-error
  auth.authorize('bearer', 0);
  // @ts-expect-error
  auth.authorize('bearer', 0, 'noo');
  // @ts-expect-error
  auth.authorize('bearer', 0, 'no', 'y');
  // @ts-expect-error
  auth.authorize('bearer1', 0, 'no');
  const md = auth.authorize('bearer', 0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<TypeEqual<object, T>>(true);
}

// 自循环
{
  new BearerStrategy({
    onLoaded(_token) {
      return { userId: 1 };
    },
    onAuthorize(role: 0 | 1) {
      const identity = this.getIdentity();
      return identity.userId === role;
    },
  });

  new BearerStrategy({
    onLoaded(_token) {
      return { userId: 1 };
    },
    onAuthorize: (role: 0 | 1) => (identity) => {
      return identity.userId === role;
    },
  });
}
