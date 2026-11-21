import { createHash } from 'node:crypto';
import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { Caching } from '@aomex/cache';
import { internalDestroyServices, middleware } from '@aomex/common';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import supertest from 'supertest';
import { afterEach, beforeAll, expect, test, vi } from 'vitest';
import { TestWebApp } from '../../web/src/testing';
import { OAuth2Client } from '../src';
import { i18n } from '../src/i18n';

const ISSUER = 'https://idp.example';
const CLIENT_ID = 'cid';
const KID = 'test-key';

type PrivateKey = Awaited<ReturnType<typeof generateKeyPair>>['privateKey'];

let privateKey: PrivateKey;
let publicJwk: Record<string, unknown>;

beforeAll(async () => {
  const pair = await generateKeyPair('RS256');
  privateKey = pair.privateKey;
  publicJwk = {
    ...(await exportJWK(pair.publicKey)),
    kid: KID,
    alg: 'RS256',
    use: 'sig',
  };
});

afterEach(async () => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  await internalDestroyServices([]);
});

/** OIDC Core：access_token ASCII 哈希左半段的 base64url（按 id_token alg） */
function computeAtHash(accessToken: string, alg: 'RS256' | 'RS384' | 'RS512' = 'RS256') {
  const hashName = alg.endsWith('256')
    ? 'sha256'
    : alg.endsWith('384')
      ? 'sha384'
      : 'sha512';
  const digest = createHash(hashName).update(accessToken, 'ascii').digest();
  return digest.subarray(0, digest.byteLength / 2).toString('base64url');
}

async function signIdToken(claims: {
  nonce: string;
  sub?: string;
  aud?: string | string[];
  iss?: string;
  exp?: number;
  email?: string;
  at_hash?: string;
  azp?: string;
}) {
  return new SignJWT({
    nonce: claims.nonce,
    ...(claims.email !== undefined ? { email: claims.email } : {}),
    ...(claims.at_hash !== undefined ? { at_hash: claims.at_hash } : {}),
    ...(claims.azp !== undefined ? { azp: claims.azp } : {}),
  })
    .setProtectedHeader({ alg: 'RS256', kid: KID })
    .setSubject(claims.sub ?? 'user-1')
    .setIssuer(claims.iss ?? ISSUER)
    .setAudience(claims.aud ?? CLIENT_ID)
    .setIssuedAt()
    .setExpirationTime(claims.exp ?? '2h')
    .sign(privateKey);
}

function stubOidcFetch(handlers: {
  token?: (init?: RequestInit) => Promise<Response> | Response;
  discovery?: () => Promise<Response> | Response;
  jwks?: () => Promise<Response> | Response;
  revoke?: (init?: RequestInit) => Promise<Response> | Response;
}) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/.well-known/openid-configuration')) {
        return (
          handlers.discovery?.() ??
          Response.json({
            issuer: ISSUER,
            authorization_endpoint: `${ISSUER}/authorize`,
            token_endpoint: `${ISSUER}/token`,
            jwks_uri: `${ISSUER}/jwks`,
            revocation_endpoint: `${ISSUER}/revoke`,
          })
        );
      }
      if (url.includes('/jwks')) {
        return handlers.jwks?.() ?? Response.json({ keys: [publicJwk] });
      }
      if (url.includes('/revoke')) {
        return handlers.revoke?.(init) ?? new Response(null, { status: 200 });
      }
      if (url.includes('/token') || url.endsWith('/oauth/token')) {
        return (
          handlers.token?.(init) ??
          Response.json({ access_token: 'at', token_type: 'bearer' })
        );
      }
      throw new Error(`unexpected fetch: ${url}`);
    }),
  );
}

test('构造：oidc.issuer 为空抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        clientId: CLIENT_ID,
        clientSecret: 's',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        oidc: { issuer: '' },
        onProfile: async ({ oidc }) => oidc.claims.sub,
      }),
  ).toThrow(i18n.t('oidc_issuer_empty'));
});

test('OIDC：discovery 补齐端点，授权 URL 含 openid 与 nonce', async () => {
  stubOidcFetch({
    token: () => Response.json({ access_token: 'x', token_type: 'bearer' }),
  });

  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => ({ sub: oidc.claims.sub }),
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  const url = new URL(res.text);
  expect(url.origin + url.pathname).toBe(`${ISSUER}/authorize`);
  expect(url.searchParams.get('scope')).toBe('openid');
  expect(url.searchParams.get('nonce')).toMatch(/^[A-Za-z0-9_-]+$/);

  const state = url.searchParams.get('state')!;
  const saved = await caching.get<{ verifier: string; nonce: string }>(
    `oauth2:state:${CLIENT_ID}:${state}`,
  );
  expect(saved?.nonce).toBe(url.searchParams.get('nonce'));
});

test('OIDC：callback 验签 id_token 并传入 claims', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce, sub: 'user-42' });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ token, oidc }) => ({
      access: token.access_token,
      sub: oidc.claims.sub,
      email: oidc.claims.email,
    }),
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get(`/?code=auth&state=${state}`).expect(200);
  expect(res.body).toEqual({ access: 'at', sub: 'user-42' });
});

test('OIDC：id_token 含正确 at_hash 时通过', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const accessToken = 'access-token-with-at-hash';
  const idToken = await signIdToken({
    nonce,
    sub: 'user-at-hash',
    at_hash: computeAtHash(accessToken),
  });
  stubOidcFetch({
    token: () =>
      Response.json({
        access_token: accessToken,
        token_type: 'bearer',
        id_token: idToken,
      }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ token, oidc }) => ({
      access: token.access_token,
      sub: oidc.claims.sub,
      at_hash: oidc.claims.at_hash,
    }),
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get(`/?code=auth&state=${state}`).expect(200);
  expect(res.body).toEqual({
    access: accessToken,
    sub: 'user-at-hash',
    at_hash: computeAtHash(accessToken),
  });
});

test('OIDC：at_hash 与 access_token 不匹配时拒绝', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({
    nonce,
    at_hash: computeAtHash('expected-access-token'),
  });
  stubOidcFetch({
    token: () =>
      Response.json({
        access_token: 'tampered-access-token',
        token_type: 'bearer',
        id_token: idToken,
      }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(401, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=auth&state=${state}`)
    .expect(401, i18n.t('oidc_at_hash_mismatch'));
});

test('OIDC：at_hash 为空字符串时拒绝', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce, at_hash: '' });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(401, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=auth&state=${state}`)
    .expect(401, i18n.t('oidc_at_hash_mismatch'));
});

test('OIDC：省略 onProfile 时 callback 直接返回 claims', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({
    nonce,
    sub: 'user-default',
    email: 'u@example.com',
  });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get(`/?code=auth&state=${state}`).expect(200);
  expect(res.body.sub).toBe('user-default');
  expect(res.body.email).toBe('u@example.com');
  expect(res.body.iss).toBe(ISSUER);
  expect(res.body.aud).toBe(CLIENT_ID);
});

test('OIDC：可手写端点并覆盖 jwksUri', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'nonce-manual-123456789012345678901234567';
  const state = 'state-manual-12345678901234567890123456';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'ver', nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    authorizationEndpoint: `${ISSUER}/authorize`,
    tokenEndpoint: `${ISSUER}/token`,
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    scopes: ['openid', 'email'],
    oidc: {
      issuer: ISSUER,
      jwksUri: `${ISSUER}/jwks`,
    },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  // 不触发 discovery：首次 callback 只打 token + jwks
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
});

test('OIDC：手写端点时配置 issuer 尾斜杠与 id_token.iss 仍匹配', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'nonce-trail-slash-1234567890123456789012';
  const state = 'state-trail-slash-123456789012345678901';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'ver', nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce, iss: ISSUER });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    authorizationEndpoint: `${ISSUER}/authorize`,
    tokenEndpoint: `${ISSUER}/token`,
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    scopes: ['openid'],
    oidc: {
      issuer: `${ISSUER}/`,
      jwksUri: `${ISSUER}/jwks`,
    },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await expect(
    supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200),
  ).resolves.toBeTruthy();
});

test('OIDC：id_token.iss 尾斜杠与配置无斜杠仍匹配', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'nonce-iss-slash-123456789012345678901234';
  const state = 'state-iss-slash-12345678901234567890123';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'ver', nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce, iss: `${ISSUER}/` });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    authorizationEndpoint: `${ISSUER}/authorize`,
    tokenEndpoint: `${ISSUER}/token`,
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    scopes: ['openid'],
    oidc: {
      issuer: ISSUER,
      jwksUri: `${ISSUER}/jwks`,
    },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
});

test('OIDC：id_token.iss 与期望 issuer 真正不一致时拒绝', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'nonce-bad-iss-12345678901234567890123456';
  const state = 'state-bad-iss-1234567890123456789012345';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'ver', nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce, iss: 'https://evil.example' });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    authorizationEndpoint: `${ISSUER}/authorize`,
    tokenEndpoint: `${ISSUER}/token`,
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    scopes: ['openid'],
    oidc: {
      issuer: ISSUER,
      jwksUri: `${ISSUER}/jwks`,
    },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.callback(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(401, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(401, i18n.t('oidc_id_token_invalid'));
});

test('OIDC：缺少 id_token', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const state = 'missingidtokenstate123456789012345678901';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'v', nonce: 'n' },
    60_000,
  );
  stubOidcFetch({
    token: () => Response.json({ access_token: 'at', token_type: 'bearer' }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.callback(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(401, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(401, i18n.t('oidc_missing_id_token'));
});

test('OIDC：nonce 不匹配', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const state = 'noncemismatchstate1234567890123456789012';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'v', nonce: 'expected-nonce-value-xxxxxxxxxxxx' },
    60_000,
  );
  const idToken = await signIdToken({ nonce: 'wrong-nonce-value-xxxxxxxxxxxxx' });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.callback(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(401, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(401, i18n.t('oidc_nonce_mismatch'));
});

test('OIDC：错误 aud 验签失败', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'badaudnonce123456789012345678901234567890';
  const state = 'badaudstate123456789012345678901234567890';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'v', nonce },
    60_000,
  );
  const idToken = await signIdToken({ nonce, aud: 'other-client' });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.callback(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(401, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(401, i18n.t('oidc_id_token_invalid'));
});

test('OIDC：discovery 失败', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('nope', { status: 500 })),
  );
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.getAuthorizationUrl(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(400, i18n.t('oidc_discovery_failed'));
});

test('OIDC：scopes 已含 openid 不重复添加', async () => {
  stubOidcFetch({
    token: () => Response.json({ access_token: 'x', token_type: 'bearer' }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    scopes: ['email', 'openid', 'profile'],
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  expect(new URL(res.text).searchParams.get('scope')).toBe('email openid profile');
});

test('OIDC：state 中缺少 nonce', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const state = 'missingnoncestate12345678901234567890123';
  await caching.set(`oauth2:state:${CLIENT_ID}:${state}`, { verifier: 'v' }, 60_000);
  const idToken = await signIdToken({ nonce: 'n' });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.callback(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(400, i18n.t('invalid_state'));
});

test('OIDC：id_token 缺少 sub', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'emptysubnonce123456789012345678901234567';
  const state = 'emptysubstate123456789012345678901234567';
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'v', nonce },
    60_000,
  );
  const idToken = await new SignJWT({ nonce })
    .setProtectedHeader({ alg: 'RS256', kid: KID })
    .setIssuer(ISSUER)
    .setAudience(CLIENT_ID)
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(privateKey);
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.callback(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(401, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(401, i18n.t('oidc_id_token_invalid'));
});

test('OIDC：discovery issuer 与配置不一致', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        issuer: 'https://evil.example',
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: `${ISSUER}/token`,
        jwks_uri: `${ISSUER}/jwks`,
      }),
    ),
  );
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.getAuthorizationUrl(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(400, i18n.t('oidc_issuer_mismatch'));
});

test('OIDC：discovery issuer 末尾斜杠视为一致', async () => {
  stubOidcFetch({
    discovery: () =>
      Response.json({
        issuer: `${ISSUER}/`,
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: `${ISSUER}/token`,
        jwks_uri: `${ISSUER}/jwks`,
      }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  expect(res.text).toContain(`${ISSUER}/authorize`);
});

test('OIDC：discovery 文档字段不全', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/authorize`,
        // 缺少 token_endpoint / jwks_uri
      }),
    ),
  );
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.getAuthorizationUrl(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(400, i18n.t('oidc_discovery_failed'));
});

test('OIDC：discovery 返回空 authorization_endpoint', async () => {
  stubOidcFetch({
    discovery: () =>
      Response.json({
        issuer: ISSUER,
        authorization_endpoint: '',
        token_endpoint: `${ISSUER}/token`,
        jwks_uri: `${ISSUER}/jwks`,
      }),
    token: () => Response.json({ access_token: 'x', token_type: 'bearer' }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.getAuthorizationUrl(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen())
    .get('/')
    .expect(400, i18n.t('authorization_endpoint_empty'));
});

test('OIDC：discovery 返回空 token_endpoint', async () => {
  stubOidcFetch({
    discovery: () =>
      Response.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: '',
        jwks_uri: `${ISSUER}/jwks`,
      }),
    token: () => Response.json({ access_token: 'x', token_type: 'bearer' }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.getAuthorizationUrl(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(400, i18n.t('token_endpoint_empty'));
});

test('OIDC：discovery 返回空 jwks_uri', async () => {
  stubOidcFetch({
    discovery: () =>
      Response.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: `${ISSUER}/token`,
        jwks_uri: '',
      }),
    token: () => Response.json({ access_token: 'x', token_type: 'bearer' }),
  });
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          await client.getAuthorizationUrl(ctx);
          ctx.send('ok');
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(400, i18n.t('oidc_jwks_uri_missing'));
});

test('OIDC：复用 JWKS 缓存', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const client = new OAuth2Client({
    authorizationEndpoint: `${ISSUER}/authorize`,
    tokenEndpoint: `${ISSUER}/token`,
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER, jwksUri: `${ISSUER}/jwks` },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  for (const suffix of ['a', 'b']) {
    const nonce = `reusejwksnonce${suffix}`.padEnd(43, 'x');
    const state = `reusejwksstate${suffix}`.padEnd(43, 'x');
    await caching.set(
      `oauth2:state:${CLIENT_ID}:${state}`,
      { verifier: 'v', nonce },
      60_000,
    );
    const idToken = await signIdToken({ nonce });
    stubOidcFetch({
      token: () =>
        Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
    });
    const app = new TestWebApp({
      mount: [
        middleware.web(async (ctx) => {
          ctx.send(await client.callback(ctx));
        }),
      ],
    });
    await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
  }
});

test('OIDC：refresh 走 discovery token_endpoint', async () => {
  const urls: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      urls.push(url);
      if (url.includes('/.well-known/openid-configuration')) {
        return Response.json({
          issuer: ISSUER,
          authorization_endpoint: `${ISSUER}/authorize`,
          token_endpoint: `${ISSUER}/token`,
          jwks_uri: `${ISSUER}/jwks`,
          revocation_endpoint: `${ISSUER}/revoke`,
        });
      }
      if (url.includes('/token')) {
        return Response.json({ access_token: 'refreshed', token_type: 'bearer' });
      }
      throw new Error(`unexpected fetch: ${url}`);
    }),
  );

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const token = await client.refresh('rt');
  expect(token.access_token).toBe('refreshed');
  expect(urls.some((u) => u.includes('/token'))).toBe(true);
});

test('OIDC：revoke 使用 discovery revocation_endpoint', async () => {
  let capturedInit: RequestInit | undefined;
  const urls: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      urls.push(url);
      if (url.includes('/.well-known/openid-configuration')) {
        return Response.json({
          issuer: ISSUER,
          authorization_endpoint: `${ISSUER}/authorize`,
          token_endpoint: `${ISSUER}/token`,
          jwks_uri: `${ISSUER}/jwks`,
          revocation_endpoint: `${ISSUER}/revoke`,
        });
      }
      if (url.includes('/revoke')) {
        capturedInit = init;
        return new Response(null, { status: 200 });
      }
      throw new Error(`unexpected fetch: ${url}`);
    }),
  );

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  await client.revoke('tok', { tokenTypeHint: 'access_token' });
  expect(urls.some((u) => u.endsWith('/revoke'))).toBe(true);
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('token')).toBe('tok');
  expect(body.get('token_type_hint')).toBe('access_token');
});

test('OIDC：discovery 无 revocation_endpoint 且未手写时 revoke 抛错', async () => {
  stubOidcFetch({
    discovery: () =>
      Response.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: `${ISSUER}/token`,
        jwks_uri: `${ISSUER}/jwks`,
      }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  await expect(client.revoke('tok')).rejects.toThrow(i18n.t('revocation_endpoint_empty'));
});

test('OIDC：手写 revocationEndpoint 优先于 discovery', async () => {
  let capturedUrl = '';
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url === 'https://manual.example/revoke') {
        capturedUrl = url;
        return new Response(null, { status: 200 });
      }
      throw new Error(`unexpected fetch: ${url}`);
    }),
  );

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
    revocationEndpoint: 'https://manual.example/revoke',
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  await client.revoke('tok');
  expect(capturedUrl).toBe('https://manual.example/revoke');
});

test('OIDC：assertAtHash 委托 oidc-token-hash', () => {
  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store: new CacheMemoryAdapter(),
    oidc: { issuer: ISSUER },
  });

  const accessToken = 'tok';
  expect(() =>
    client['assertAtHash'](accessToken, computeAtHash(accessToken), 'RS256'),
  ).not.toThrow();
  expect(() =>
    client['assertAtHash'](accessToken, computeAtHash('other'), 'RS256'),
  ).toThrow(i18n.t('oidc_at_hash_mismatch'));
});

test('OIDC：多 aud 且 azp 正确时通过', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({
    nonce,
    aud: [CLIENT_ID, 'other-aud'],
    azp: CLIENT_ID,
  });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=auth&state=${state}`).expect(200);
});

test('OIDC：多 aud 缺少 azp 时拒绝', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({
    nonce,
    aud: [CLIENT_ID, 'other-aud'],
  });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(401, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=auth&state=${state}`)
    .expect(401, i18n.t('oidc_azp_mismatch'));
});

test('OIDC：回调 iss 与配置一致时通过', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  const idToken = await signIdToken({ nonce });
  stubOidcFetch({
    token: () =>
      Response.json({ access_token: 'at', token_type: 'bearer', id_token: idToken }),
  });

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=auth&state=${state}&iss=${encodeURIComponent(ISSUER)}`)
    .expect(200);
});

test('OIDC：回调 iss 不一致时拒绝', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const nonce = 'N'.repeat(43);
  const state = 'S'.repeat(43);
  await caching.set(
    `oauth2:state:${CLIENT_ID}:${state}`,
    { verifier: 'V'.repeat(43), nonce },
    60_000,
  );

  stubOidcFetch({});

  const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: 's',
    redirectUri: 'http://localhost/cb',
    store,
    oidc: { issuer: ISSUER },
    onProfile: async ({ oidc }) => oidc.claims.sub,
  });

  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(401, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=auth&state=${state}&iss=${encodeURIComponent('https://evil.example')}`)
    .expect(401, i18n.t('callback_iss_mismatch'));
  expect(await caching.get(`oauth2:state:${CLIENT_ID}:${state}`)).toBeNull();
});
