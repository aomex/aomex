import { CacheMemoryAdapter } from '@aomex/cache/memory';
import type { WebContext } from '@aomex/web';
import { expectType, type TypeEqual } from 'ts-expect';
import { OAuth2Client } from '../src';

const store = new CacheMemoryAdapter();

const client = new OAuth2Client({
  authorizationEndpoint: 'https://example.com/oauth/authorize',
  tokenEndpoint: 'https://example.com/oauth/token',
  clientId: 'cid',
  clientSecret: 'secret',
  redirectUri: 'http://localhost/callback',
  store,
  onProfile({ token, ctx }) {
    expectType<TypeEqual<OAuth2Client.TokenSet, typeof token>>(true);
    expectType<TypeEqual<WebContext, typeof ctx>>(true);
    return { userId: 1 as const, name: 'a' as const };
  },
});

{
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: async () => 'jwt-secret',
    redirectUri: 'http://localhost/cb',
    store,
    onProfile: async () => ({}),
  });
}

declare const ctx: WebContext;

{
  const profile = await client.callback(ctx);
  expectType<TypeEqual<{ userId: 1; name: 'a' }, typeof profile>>(true);
}

{
  const url = await client.getAuthorizationUrl(ctx);
  expectType<TypeEqual<string, typeof url>>(true);
}

{
  const result = client.redirect(ctx);
  expectType<TypeEqual<Promise<void>, typeof result>>(true);
}

{
  const refreshed = await client.refresh('rt');
  expectType<TypeEqual<OAuth2Client.TokenSet, typeof refreshed>>(true);
  expectType<TypeEqual<'bearer' | 'dpop', typeof refreshed.token_type>>(true);

  const withScope = await client.refresh('rt', { scope: ['a', 'b'] });
  expectType<TypeEqual<OAuth2Client.TokenSet, typeof withScope>>(true);

  const withScopeStr = await client.refresh('rt', { scope: 'a b' });
  expectType<TypeEqual<OAuth2Client.TokenSet, typeof withScopeStr>>(true);

  const revoked = client.revoke('tok');
  expectType<TypeEqual<Promise<void>, typeof revoked>>(true);

  const revokedHint = client.revoke('tok', { tokenTypeHint: 'refresh_token' });
  expectType<TypeEqual<Promise<void>, typeof revokedHint>>(true);

  // @ts-expect-error tokenTypeHint 非法
  client.revoke('tok', { tokenTypeHint: 'id_token' });
}

{
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: (c) => {
      expectType<TypeEqual<WebContext, typeof c>>(true);
      return 'http://localhost/cb';
    },
    store,
    scopes: ['openid'],
    pkce: false,
    tokenAuth: 'basic',
    stateTtl: '10 minutes',
    authorizationParams: { prompt: 'login' },
    async onProfile() {
      return 42;
    },
  });
}

{
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    // @ts-expect-error 无单位的数字字符串不是 DurationInput
    stateTtl: '1000',
    onProfile: async () => ({}),
  });
}

{
  // @ts-expect-error 缺少 store
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    onProfile: async () => ({}),
  });
}

{
  // @ts-expect-error 缺少 onProfile
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
  });
}

{
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    // @ts-expect-error tokenAuth 非法
    tokenAuth: 'query',
    onProfile: async () => ({}),
  });
}

// —— OIDC：第三参 claims 类型贯通 ——
{
  const oidcClient = new OAuth2Client({
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: 'https://accounts.google.com' },
    onProfile({ token, oidc, ctx }) {
      expectType<TypeEqual<OAuth2Client.TokenSet, typeof token>>(true);
      expectType<TypeEqual<WebContext, typeof ctx>>(true);
      expectType<TypeEqual<OAuth2Client.IdTokenClaims, typeof oidc.claims>>(true);
      expectType<TypeEqual<string, typeof oidc.claims.sub>>(true);
      expectType<TypeEqual<string | undefined, typeof oidc.claims.at_hash>>(true);
      // @ts-expect-error 标准声明无 hd
      oidc.claims.hd;
      return { sub: oidc.claims.sub, email: oidc.claims.email };
    },
  });

  const profile = await oidcClient.callback(ctx);
  expectType<TypeEqual<{ sub: string; email: string | undefined }, typeof profile>>(true);
}

// —— OIDC：省略 onProfile 时默认返回 claims ——
{
  const oidcClient = new OAuth2Client({
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: 'https://accounts.google.com' },
  });

  const profile = await oidcClient.callback(ctx);
  expectType<TypeEqual<OAuth2Client.IdTokenClaims, typeof profile>>(true);
  expectType<TypeEqual<string, typeof profile.sub>>(true);
}

// —— OIDC：省略 onProfile + 扩展 Claims ——
{
  type GoogleClaims = OAuth2Client.IdTokenClaims & { readonly hd?: string };
  const google = new OAuth2Client<GoogleClaims, GoogleClaims>({
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: 'https://accounts.google.com' },
  });

  const p = await google.callback(ctx);
  expectType<TypeEqual<GoogleClaims, typeof p>>(true);
  expectType<TypeEqual<string | undefined, typeof p.hd>>(true);
}

// —— OIDC：扩展 Claims 泛型 ——
{
  type GoogleClaims = OAuth2Client.IdTokenClaims & { readonly hd?: string };
  const google = new OAuth2Client<{ sub: string; hd?: string }, GoogleClaims>({
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: 'https://accounts.google.com' },
    onProfile({ oidc }) {
      expectType<TypeEqual<GoogleClaims, typeof oidc.claims>>(true);
      expectType<TypeEqual<string | undefined, typeof oidc.claims.hd>>(true);
      return { sub: oidc.claims.sub, hd: oidc.claims.hd };
    },
  });

  const p = await google.callback(ctx);
  expectType<TypeEqual<{ sub: string; hd?: string }, typeof p>>(true);
}

// —— OIDC：可省略手写 endpoint ——
{
  new OAuth2Client({
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: {
      issuer: 'https://accounts.google.com',
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      expectedIssuer: 'https://accounts.google.com',
    },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
}

{
  // @ts-expect-error 无 oidc 时缺少 authorizationEndpoint
  new OAuth2Client({
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    onProfile: async () =>
      ({
        iss: '',
        sub: '',
        aud: '',
        exp: 0,
        iat: 0,
      }) satisfies OAuth2Client.IdTokenClaims,
  });
}

{
  // @ts-expect-error 无 oidc 时缺少 tokenEndpoint
  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    onProfile: async () =>
      ({
        iss: '',
        sub: '',
        aud: '',
        exp: 0,
        iat: 0,
      }) satisfies OAuth2Client.IdTokenClaims,
  });
}

{
  new OAuth2Client({
    clientId: 'cid',
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    // @ts-expect-error oidc 启用时缺少 oidc.issuer
    oidc: {},
    // @ts-expect-error 过载回落到 OAuth2 时 Profile 默认与返回值冲突
    onProfile: async () => 'x',
  });
}
