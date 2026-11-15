import { Auth } from '../src';
import {
  AuthApiKeyStrategy,
  type AuthApiKeyLoaderItem,
} from '../src/strategies/auth-api-key-strategy';
import { expectType, type TypeEqual } from 'ts-expect';
import { WebMiddleware } from '@aomex/web';

// 身份信息自动推导
{
  const apiKey = new AuthApiKeyStrategy({
    async onLoaded(_apiKey) {
      return { appId: 1 };
    },
  });
  const md = new Auth({ strategies: { apiKey } }).authenticate('apiKey');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly auth: {
          readonly apiKey: {
            readonly key: string;
            readonly data: {
              appId: number;
            };
          };
        };
      },
      T
    >
  >(true);
}

// loader 形态
{
  const loaders: AuthApiKeyLoaderItem[] = [
    { type: 'header', key: 'x-api-key' },
    { type: 'query', key: 'api_key' },
    { type: 'cookie', key: 'api_key' },
  ];
  void loaders;

  // @ts-expect-error 不支持 body，避免密钥进入请求体日志
  const bad: AuthApiKeyLoaderItem = { type: 'body', key: 'api_key' };
  void bad;

  new AuthApiKeyStrategy({
    // @ts-expect-error 不支持 body
    keyLoaders: [{ type: 'body', key: 'api_key' }],
    onLoaded() {
      return {};
    },
  });
}

// 必填 onLoaded
{
  // @ts-expect-error
  new AuthApiKeyStrategy();
  // @ts-expect-error
  new AuthApiKeyStrategy({});
}

// 认证加授权
{
  const apiKey = new AuthApiKeyStrategy({
    async onLoaded(_apiKey) {
      return { appId: 1 };
    },
    onAuthorize(_role: 0 | 1, _test: 'yes' | 'no') {
      const data = this.getIdentity();
      expectType<TypeEqual<typeof data.appId, number>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { apiKey } });
  // @ts-expect-error
  auth.authenticate('apiKey').authorize(0);
  // @ts-expect-error
  auth.authenticate('apiKey').authorize(0, 'noo');
  // @ts-expect-error
  auth.authenticate('apiKey').authorize(0, 'no', 'y');
  const md = auth.authenticate('apiKey').authorize(0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<
    TypeEqual<
      {
        readonly auth: {
          readonly apiKey: {
            readonly key: string;
            readonly data: {
              appId: number;
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
  const apiKey = new AuthApiKeyStrategy({
    async onLoaded(_apiKey) {
      return { appId: 1 };
    },
    onAuthorize: (_role: 0 | 1, _test: 'yes' | 'no') => (data) => {
      expectType<TypeEqual<typeof data.appId, number>>(true);
      return true;
    },
  });
  const auth = new Auth({ strategies: { apiKey } });
  // @ts-expect-error
  auth.authorize('apiKey', 0);
  // @ts-expect-error
  auth.authorize('apiKey', 0, 'noo');
  // @ts-expect-error
  auth.authorize('apiKey', 0, 'no', 'y');
  // @ts-expect-error
  auth.authorize('apiKey1', 0, 'no');
  const md = auth.authorize('apiKey', 0, 'no');
  type T = typeof md extends WebMiddleware<infer U> ? U : never;
  expectType<TypeEqual<object, T>>(true);
}

// 无授权
{
  const apiKey = new AuthApiKeyStrategy({
    async onLoaded(_apiKey) {
      return { appId: 1 };
    },
  });
  const auth = new Auth({ strategies: { apiKey } });
  auth.authorize('apiKey');
  // @ts-expect-error
  auth.authorize('apiKey', 0);
  // @ts-expect-error
  auth.authorize('apiKey1', 0, 'no');
  // @ts-expect-error
  auth.authorize('apiKey', 0, 1, 3);
}

// 扩展数组
{
  const apiKey = new AuthApiKeyStrategy({
    async onLoaded(_apiKey) {
      return { appId: 1 };
    },
    onAuthorize: (...roles: number[]) => {
      return roles.length > 1;
    },
  });
  const auth = new Auth({ strategies: { apiKey } });
  auth.authorize('apiKey');
  auth.authorize('apiKey', 0);
  // @ts-expect-error
  auth.authorize('apiKey1', 0, 'no');
  auth.authorize('apiKey', 0, 1, 3);
}

// 自循环
{
  new AuthApiKeyStrategy({
    onLoaded(_apiKey) {
      return { appId: 1 };
    },
    onAuthorize(role: 0 | 1) {
      const identity = this.getIdentity();
      return identity.appId === role;
    },
  });

  new AuthApiKeyStrategy({
    onLoaded(_apiKey) {
      return { appId: 1 };
    },
    onAuthorize: (role: 0 | 1) => (identity) => {
      return identity.appId === role;
    },
  });
}
