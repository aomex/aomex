import { Caching } from '@aomex/cache';
import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { expectType, type TypeEqual } from 'ts-expect';
import { WebMiddleware } from '@aomex/web';
import { Auth } from '../src';
import { AuthSessionStrategy } from '../src/strategies/auth-session-strategy';

function cache() {
  return new Caching(new CacheMemoryAdapter());
}

// 由 onLoaded 形参/返回值推导 Stored 与 Loaded
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return { userId: data.userId, name: 'a' };
    },
  });
  const md = new Auth({ strategies: { session } }).authenticate('session');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly auth: {
          readonly session: {
            readonly sessionId: string;
            readonly data: {
              userId: number;
              name: string;
            };
          };
        };
      },
      T
    >
  >(true);

  // login 只接受 Stored
  void session.login;
  type LoginData = Parameters<typeof session.login>[1];
  expectType<TypeEqual<LoginData, { userId: number }>>(true);
}

// 存储与加载同形时也可恒等返回
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return data;
    },
  });
  const md = new Auth({ strategies: { session } }).authenticate('session');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly auth: {
          readonly session: {
            readonly sessionId: string;
            readonly data: {
              userId: number;
            };
          };
        };
      },
      T
    >
  >(true);
}

// 认证加授权（Loaded 贯通 getIdentity）
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return { userId: data.userId, role: 1 as 0 | 1 };
    },
    onAuthorize(_role: 0 | 1, _test: 'yes' | 'no') {
      const data = this.getIdentity();
      expectType<TypeEqual<typeof data.role, 0 | 1>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { session } });
  // @ts-expect-error
  auth.authenticate('session').authorize(0);
  // @ts-expect-error
  auth.authenticate('session').authorize(0, 'noo');
  // @ts-expect-error
  auth.authenticate('session').authorize(0, 'no', 'y');
  const md = auth.authenticate('session').authorize(0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly auth: {
          readonly session: {
            readonly sessionId: string;
            readonly data: {
              userId: number;
              role: 0 | 1;
            };
          };
        };
      },
      T
    >
  >(true);
}

// 授权
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return data;
    },
    onAuthorize: (_role: 0 | 1, _test: 'yes' | 'no') => (data) => {
      expectType<TypeEqual<typeof data.userId, number>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { session } });
  // @ts-expect-error
  auth.authorize('session', 0);
  // @ts-expect-error
  auth.authorize('session', 0, 'noo');
  // @ts-expect-error
  auth.authorize('session', 0, 'no', 'y');
  // @ts-expect-error
  auth.authorize('session1', 0, 'no');
  const md = auth.authorize('session', 0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<TypeEqual<object, T>>(true);
}

// 无授权参数
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return data;
    },
  });
  const auth = new Auth({ strategies: { session } });
  auth.authorize('session');
  // @ts-expect-error
  auth.authorize('session', 0);
}

// 扩展数组授权
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return data;
    },
    onAuthorize: (...roles: number[]) => {
      return roles.length > 1;
    },
  });
  const auth = new Auth({ strategies: { session } });
  auth.authorize('session');
  auth.authorize('session', 0);
  auth.authorize('session', 0, 1, 3);
}

// cookie.maxAge 必填
{
  new AuthSessionStrategy({
    store: cache(),
    // @ts-expect-error
    cookie: {},
    onLoaded(data: { userId: number }) {
      return data;
    },
  });
}

// cookie 复用 web 的 CookieSerializeOptions 字段
{
  new AuthSessionStrategy({
    store: cache(),
    cookie: {
      maxAge: 3600,
      path: '/',
      domain: 'example.com',
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
      partitioned: true,
    },
    onLoaded(data: { userId: number }) {
      return data;
    },
  });
}

// store 必填
{
  // @ts-expect-error
  new AuthSessionStrategy({
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return data;
    },
  });
}

// onLoaded 必填
{
  // @ts-expect-error
  new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
  });
}

// store 必须是 Caching，不能传适配器
{
  new AuthSessionStrategy({
    // @ts-expect-error
    store: new CacheMemoryAdapter(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return data;
    },
  });
}

// login 不得传入 Loaded 专有字段（仅 Stored）
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return { userId: data.userId, name: 'x' };
    },
  });
  // @ts-expect-error
  session.login(null as any, { userId: 1, name: 'x' });
}

// regenerateSessionId：data 可选；返回 string | false；不得传 Loaded 专有字段
{
  const session = new AuthSessionStrategy({
    store: cache(),
    cookie: { maxAge: 3600 },
    onLoaded(data: { userId: number }) {
      return { userId: data.userId, name: 'x' };
    },
  });
  type Rotate = ReturnType<typeof session.regenerateSessionId>;
  expectType<TypeEqual<Rotate, Promise<string | false>>>(true);
  void session.regenerateSessionId(null as any);
  void session.regenerateSessionId(null as any, { userId: 1 });
  // @ts-expect-error
  session.regenerateSessionId(null as any, { userId: 1, name: 'x' });
}
