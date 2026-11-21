import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { Caching } from '@aomex/cache';
import { internalDestroyServices, middleware } from '@aomex/common';
import { createHash } from 'node:crypto';
import supertest from 'supertest';
import { afterEach, expect, test, vi } from 'vitest';
import { TestWebApp } from '../../web/src/testing';
import { OAuth2Client } from '../src';
import { i18n } from '../src/i18n';

afterEach(async () => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  await internalDestroyServices([]);
});

function createClient(
  overrides?: Partial<OAuth2Client.OAuth2OnlyOptions<{ id: number; login: string }>>,
) {
  const store = new CacheMemoryAdapter();
  const onProfile = vi.fn(async () => ({ id: 1, login: 'octocat' }));
  const client = new OAuth2Client({
    authorizationEndpoint: 'https://example.com/oauth/authorize',
    tokenEndpoint: 'https://example.com/oauth/token',
    clientId: 'cid',
    clientSecret: 'csecret',
    redirectUri: 'http://localhost/oauth/callback',
    scopes: ['read:user'],
    store,
    onProfile,
    ...overrides,
  });
  return { client, store, onProfile, caching: new Caching(store) };
}

test('构造：空 clientId 抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: 'https://example.com/a',
        tokenEndpoint: 'https://example.com/t',
        clientId: '',
        clientSecret: 'x',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        onProfile: async () => ({}),
      }),
  ).toThrow(i18n.t('client_id_empty'));
});

test('构造：空 clientSecret 字符串抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: 'https://example.com/a',
        tokenEndpoint: 'https://example.com/t',
        clientId: 'cid',
        clientSecret: '',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        onProfile: async () => ({}),
      }),
  ).toThrow(i18n.t('client_secret_empty'));
});

test('refresh：clientSecret 可为异步函数', async () => {
  const { client } = createClient({
    clientSecret: async () => 'dynamic-secret',
  });
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );
  await client.refresh('rt');
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('client_secret')).toBe('dynamic-secret');
});

test('构造：空 authorizationEndpoint 抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: '',
        tokenEndpoint: 'https://example.com/t',
        clientId: 'cid',
        clientSecret: 'x',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        onProfile: async () => ({}),
      }),
  ).toThrow(i18n.t('authorization_endpoint_empty'));
});

test('构造：空 tokenEndpoint 抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: 'https://example.com/a',
        tokenEndpoint: '',
        clientId: 'cid',
        clientSecret: 'x',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        onProfile: async () => ({}),
      }),
  ).toThrow(i18n.t('token_endpoint_empty'));
});

test('构造：空 redirectUri 字符串抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: 'https://example.com/a',
        tokenEndpoint: 'https://example.com/t',
        clientId: 'cid',
        clientSecret: 'x',
        redirectUri: '',
        store: new CacheMemoryAdapter(),
        onProfile: async () => ({}),
      }),
  ).toThrow(i18n.t('redirect_uri_empty'));
});

test('构造：stateTtl 为 0 抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: 'https://example.com/a',
        tokenEndpoint: 'https://example.com/t',
        clientId: 'cid',
        clientSecret: 'x',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        stateTtl: 0,
        onProfile: async () => ({}),
      }),
  ).toThrow(i18n.t('state_ttl_invalid'));
});

test('getAuthorizationUrl：写入 state 并带 PKCE', async () => {
  const { client, caching } = createClient({
    authorizationParams: { prompt: 'consent' },
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const url = await client.getAuthorizationUrl(ctx);
        ctx.send(url);
      }),
    ],
  });

  const res = await supertest(app.listen()).get('/').expect(200);
  const url = new URL(res.text);
  expect(url.origin + url.pathname).toBe('https://example.com/oauth/authorize');
  expect(url.searchParams.get('response_type')).toBe('code');
  expect(url.searchParams.get('client_id')).toBe('cid');
  expect(url.searchParams.get('redirect_uri')).toBe('http://localhost/oauth/callback');
  expect(url.searchParams.get('scope')).toBe('read:user');
  expect(url.searchParams.get('prompt')).toBe('consent');
  expect(url.searchParams.get('code_challenge_method')).toBe('S256');

  const state = url.searchParams.get('state')!;
  expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
  const challenge = url.searchParams.get('code_challenge')!;
  const saved = await caching.get<{ verifier: string }>(`oauth2:state:cid:${state}`);
  expect(saved).not.toBeNull();
  expect(createHash('sha256').update(saved!.verifier).digest('base64url')).toBe(
    challenge,
  );
});

test('getAuthorizationUrl：pkce=false 不写 challenge', async () => {
  const { client, caching } = createClient({ pkce: false });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  const url = new URL(res.text);
  expect(url.searchParams.get('code_challenge')).toBeNull();
  const state = url.searchParams.get('state')!;
  const saved = await caching.get<{ verifier: string }>(`oauth2:state:cid:${state}`);
  expect(saved).toEqual({ verifier: '' });
});

test('getAuthorizationUrl：无 scopes 时不带 scope', async () => {
  const { client } = createClient({ scopes: undefined });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  expect(new URL(res.text).searchParams.get('scope')).toBeNull();
});

test('getAuthorizationUrl：空 scopes 不带 scope', async () => {
  const { client } = createClient({ scopes: [] });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  expect(new URL(res.text).searchParams.get('scope')).toBeNull();
});

test('getAuthorizationUrl：动态 redirectUri', async () => {
  const { client } = createClient({
    redirectUri: (ctx) => `https://app.example/${ctx.request.query['tenant']}/cb`,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/?tenant=acme').expect(200);
  expect(new URL(res.text).searchParams.get('redirect_uri')).toBe(
    'https://app.example/acme/cb',
  );
});

test('getAuthorizationUrl：动态 redirectUri 返回空串抛错', async () => {
  const { client } = createClient({ redirectUri: () => '' });
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
  await supertest(app.listen()).get('/').expect(400, i18n.t('redirect_uri_empty'));
});

test('getAuthorizationUrl：子类可 override stateKey', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  class CustomClient extends OAuth2Client<{ id: number }> {
    protected override stateKey(state: string) {
      return `custom:${state}` as const;
    }
  }
  const client = new CustomClient({
    authorizationEndpoint: 'https://example.com/oauth/authorize',
    tokenEndpoint: 'https://example.com/oauth/token',
    clientId: 'cid',
    clientSecret: 'csecret',
    redirectUri: 'http://localhost/oauth/callback',
    store,
    onProfile: async () => ({ id: 1 }),
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  const state = new URL(res.text).searchParams.get('state')!;
  expect(await caching.get(`custom:${state}`)).toEqual({
    verifier: expect.any(String),
  });
});

test('redirect：响应 302 Location', async () => {
  const { client } = createClient();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        await client.redirect(ctx);
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(302);
  expect(res.headers['location']).toMatch(/^https:\/\/example\.com\/oauth\/authorize\?/);
});

test('callback：完整换票成功', async () => {
  const { client, caching, onProfile } = createClient();
  const state = 'S'.repeat(43);
  const verifier = 'V'.repeat(43);
  await caching.set(`oauth2:state:cid:${state}`, { verifier }, 60_000);

  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      capturedUrl = String(url);
      capturedInit = init;
      return Response.json({
        access_token: 'at',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'rt',
        scope: 'read:user',
        id_token: 'idt',
      });
    }),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const profile = await client.callback(ctx);
        ctx.send(profile);
      }),
    ],
  });

  const res = await supertest(app.listen())
    .get(`/cb?code=authcode&state=${state}`)
    .expect(200);
  expect(res.body).toEqual({ id: 1, login: 'octocat' });
  expect(await caching.get(`oauth2:state:cid:${state}`)).toBeNull();
  expect(onProfile).toHaveBeenCalledWith({
    token: {
      access_token: 'at',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'rt',
      scope: 'read:user',
      id_token: 'idt',
    },
    ctx: expect.anything(),
  });

  expect(capturedUrl).toBe('https://example.com/oauth/token');
  expect(capturedInit?.method).toBe('POST');
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('grant_type')).toBe('authorization_code');
  expect(body.get('code')).toBe('authcode');
  expect(body.get('client_id')).toBe('cid');
  expect(body.get('client_secret')).toBe('csecret');
  expect(body.get('code_verifier')).toBe(verifier);
  expect(body.get('redirect_uri')).toBe('http://localhost/oauth/callback');
});

test('callback：tokenAuth=basic', async () => {
  const { client, caching } = createClient({ tokenAuth: 'basic' });
  const state = 'basicstate12345678901234567890123456789012';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'ver' }, 60_000);

  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);

  const headers = capturedInit?.headers as Record<string, string>;
  expect(headers['Authorization']).toBe(
    `Basic ${Buffer.from('cid:csecret', 'utf8').toString('base64')}`,
  );
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('client_id')).toBeNull();
  expect(body.get('client_secret')).toBeNull();
});

test('callback：form-urlencoded 令牌响应', async () => {
  const { client, caching, onProfile } = createClient({ pkce: false });
  const state = 'formurlencodedstate123456789012345678901';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);

  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response(
        'access_token=atok&token_type=bearer&expires_in=7200&refresh_token=r&scope=s&id_token=i',
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
      );
    }),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
  expect(onProfile).toHaveBeenCalledWith({
    token: {
      access_token: 'atok',
      token_type: 'bearer',
      expires_in: 7200,
      refresh_token: 'r',
      scope: 's',
      id_token: 'i',
    },
    ctx: expect.anything(),
  });
});

test('callback：form-urlencoded 缺少 token_type 拒绝', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'formonlyaccesstoken1234567890123456789012';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);

  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response('access_token=only', {
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      });
    }),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(400, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(400, i18n.t('token_type_invalid'));
});

test('callback：无 Content-Type 时按 JSON 解析', async () => {
  const { client, caching, onProfile } = createClient({ pkce: false });
  const state = 'nocontenttypestate123456789012345678901234';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      // 二进制 body 不会自动带 Content-Type，覆盖 `get(...) || ''` 的空值分支
      return new Response(
        new TextEncoder().encode(
          JSON.stringify({ access_token: 'raw', token_type: 'Bearer' }),
        ),
      );
    }),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
  expect(onProfile).toHaveBeenCalledWith({
    token: expect.objectContaining({ access_token: 'raw', token_type: 'bearer' }),
    ctx: expect.anything(),
  });
});

test('callback：JSON 仅 access_token + token_type', async () => {
  const { client, caching, onProfile } = createClient({ pkce: false });
  const state = 'jsononlyaccesstoken1234567890123456789012';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ access_token: 'only', token_type: 'bearer' })),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
  expect(onProfile).toHaveBeenCalledWith({
    token: {
      access_token: 'only',
      token_type: 'bearer',
      expires_in: undefined,
      refresh_token: undefined,
      scope: undefined,
      id_token: undefined,
    },
    ctx: expect.anything(),
  });
});

test('callback：非法 token_type 拒绝', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'badtokentypestate123456789012345678901234';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ access_token: 'at', token_type: 'mac' })),
  );
  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(400, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(400, i18n.t('token_type_invalid'));
});

test('callback：拒绝隐式/混合流参数', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'hybridflowstate123456789012345678901234567';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(400, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}&id_token=eyJ`)
    .expect(400, i18n.t('callback_unsupported_response'));
});

test('callback：出站 302 不跟随并视为失败', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'redirectmanualstate1234567890123456789012';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.redirect).toBe('manual');
      return new Response(null, {
        status: 302,
        headers: { Location: 'https://evil.example/token' },
      });
    }),
  );
  const app = new TestWebApp({
    mount: [
      middleware.web((ctx, next) =>
        next().catch((e) => {
          ctx.throw(400, (e as Error).message);
        }),
      ),
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(400, i18n.t('token_exchange_failed'));
});
test('构造：stateTtl 负数由 parseDuration 抛错', () => {
  expect(
    () =>
      new OAuth2Client({
        authorizationEndpoint: 'https://example.com/a',
        tokenEndpoint: 'https://example.com/t',
        clientId: 'cid',
        clientSecret: 'x',
        redirectUri: 'http://localhost/cb',
        store: new CacheMemoryAdapter(),
        stateTtl: -1,
        onProfile: async () => ({}),
      }),
  ).toThrow(/无效的时长/);
});

test('构造：stateTtl 支持可读时长', async () => {
  const store = new CacheMemoryAdapter();
  const caching = new Caching(store);
  const client = new OAuth2Client({
    authorizationEndpoint: 'https://example.com/oauth/authorize',
    tokenEndpoint: 'https://example.com/oauth/token',
    clientId: 'cid',
    clientSecret: 'csecret',
    redirectUri: 'http://localhost/oauth/callback',
    store,
    stateTtl: '5m',
    onProfile: async () => ({ id: 1 }),
  });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.getAuthorizationUrl(ctx));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  const state = new URL(res.text).searchParams.get('state')!;
  const ttl = await caching.ttl(`oauth2:state:cid:${state}`);
  expect(ttl).toBeGreaterThan(290_000);
  expect(ttl).toBeLessThanOrEqual(300_000);
});

test('callback：code 为空串', async () => {
  const { client } = createClient();
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
    .get('/?code=&state=abc')
    .expect(400, i18n.t('missing_code_or_state'));
});

test('callback：缺少 code/state', async () => {
  const { client } = createClient();
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
  await supertest(app.listen()).get('/').expect(400, i18n.t('missing_code_or_state'));
  await supertest(app.listen())
    .get('/?code=c&state=bad state!')
    .expect(400, i18n.t('missing_code_or_state'));
});

test('callback：state 过期或未知', async () => {
  const { client } = createClient();
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
    .get('/?code=c&state=unknownstate123456789012345678901234')
    .expect(400, i18n.t('invalid_state'));
});

test('callback：pkce 开启但 verifier 为空视为无效 state', async () => {
  const { client, caching } = createClient();
  const state = 'emptyverifierstate1234567890123456789012';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
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

test('callback：换票 HTTP 失败', async () => {
  const { client, caching } = createClient();
  const state = 'tokenfailstate12345678901234567890123456';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ error: 'invalid_grant' }, { status: 400 })),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('callback：换票 JSON 无 access_token', async () => {
  const { client, caching } = createClient();
  const state = 'noaccesstokenstate1234567890123456789012';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ token_type: 'bearer' })),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('callback：换票响应非 JSON', async () => {
  const { client, caching } = createClient();
  const state = 'badjsonstate1234567890123456789012345678';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () => new Response('not-json', { headers: { 'content-type': 'text/plain' } }),
    ),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('callback：form-urlencoded 无 access_token', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'formnoaccesstoken123456789012345678901234';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response('error=invalid_grant', {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
    }),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('callback：form-urlencoded 非 2xx 即使有 access_token 也拒绝', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'formnon2xxaccesstoken12345678901234567890';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response('access_token=leaked&error=server_error', {
        status: 500,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
    }),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('callback：form-urlencoded 带 error 字段即使 200 也拒绝', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'formerrorwithtoken12345678901234567890123';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response('access_token=x&error=invalid_grant', {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });
    }),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('callback：换票网络错误映射为 token_exchange_failed', async () => {
  const { client, caching } = createClient({ pkce: false });
  const state = 'fetchnetworkerrorstate1234567890123456789';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new TypeError('fetch failed');
    }),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
});

test('refresh：网络错误映射为 token_refresh_failed', async () => {
  const { client } = createClient();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new TypeError('fetch failed');
    }),
  );
  await expect(client.refresh('rt')).rejects.toThrow(i18n.t('token_refresh_failed'));
});

test('refresh / exchange：出站请求带 AbortSignal 超时', async () => {
  const { client } = createClient();
  let captured: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      captured = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );
  await client.refresh('rt');
  expect(captured?.signal).toBeInstanceOf(AbortSignal);
  expect(captured?.signal?.aborted).toBe(false);
});

test('callback：state 一次性（第二次失败）', async () => {
  const { client, caching } = createClient();
  const state = 'onetimeusestate1234567890123456789012345';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ access_token: 'at', token_type: 'bearer' })),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          ctx.send(await client.callback(ctx));
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  const agent = supertest(app.listen());
  await agent.get(`/?code=c&state=${state}`).expect(200);
  await agent.get(`/?code=c&state=${state}`).expect(400, i18n.t('invalid_state'));
});

test('callback：并发消费同一 state 仅一方成功', async () => {
  const { client, caching, onProfile } = createClient();
  const state = 'concurrentstate1234567890123456789012345';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ access_token: 'at', token_type: 'bearer' })),
  );

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        try {
          ctx.send(await client.callback(ctx));
        } catch (e) {
          ctx.throw(400, e instanceof Error ? e.message : String(e));
        }
      }),
    ],
  });
  const agent = supertest(app.listen());
  const [r1, r2] = await Promise.all([
    agent.get(`/?code=c1&state=${state}`),
    agent.get(`/?code=c2&state=${state}`),
  ]);
  const statuses = [r1.status, r2.status].sort((a, b) => a - b);
  expect(statuses).toEqual([200, 400]);
  expect([r1.text, r2.text]).toContain(i18n.t('invalid_state'));
  expect(onProfile).toHaveBeenCalledTimes(1);
  expect(await caching.get(`oauth2:state:cid:${state}`)).toBeNull();
});

test('callback：授权服务器 error 校验 state 后拒绝', async () => {
  const { client, caching } = createClient();
  const state = 'accessdeniedstate12345678901234567890123';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
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
    .get(`/?error=access_denied&state=${state}`)
    .expect(400, i18n.t('authorization_denied', { error: 'access_denied' }));
  expect(await caching.get(`oauth2:state:cid:${state}`)).toBeNull();
});

test('callback：授权 error 但 state 无效', async () => {
  const { client } = createClient();
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
    .get('/?error=access_denied&state=unknownstate123456789012345678901234')
    .expect(400, i18n.t('invalid_state'));
});

test('callback：非法 error 码不拼进文案', async () => {
  const { client, caching } = createClient();
  const state = 'baderrorcodestate123456789012345678901234';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
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
    .get(`/?error=${encodeURIComponent('access denied')}&state=${state}`)
    .expect(400, i18n.t('missing_code_or_state'));
  // 非法 error 未消费 state
  expect(await caching.get(`oauth2:state:cid:${state}`)).toEqual({ verifier: 'v' });
});

test('callback：JSON expires_in 为字符串', async () => {
  const { client, caching, onProfile } = createClient({ pkce: false });
  const state = 'expiresinstringstate123456789012345678901';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: '' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        access_token: 'atok',
        token_type: 'bearer',
        expires_in: '3600',
      }),
    ),
  );
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await client.callback(ctx));
      }),
    ],
  });
  await supertest(app.listen()).get(`/?code=c&state=${state}`).expect(200);
  expect(onProfile).toHaveBeenCalledWith(
    expect.objectContaining({
      token: expect.objectContaining({ expires_in: 3600 }),
    }),
  );
});

test('callback：换票失败后 state 不可恢复', async () => {
  const { client, caching } = createClient();
  const state = 'burnonafterfailstate123456789012345678901';
  await caching.set(`oauth2:state:cid:${state}`, { verifier: 'v' }, 60_000);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ error: 'invalid_grant' }, { status: 400 })),
  );
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
    .expect(401, i18n.t('token_exchange_failed'));
  expect(await caching.get(`oauth2:state:cid:${state}`)).toBeNull();
  await supertest(app.listen())
    .get(`/?code=c&state=${state}`)
    .expect(401, i18n.t('invalid_state'));
});

test('authorizationParams 不能覆盖必要字段', async () => {
  const { client } = createClient({
    authorizationParams: {
      response_type: 'token',
      client_id: 'hijack',
      state: 'fixed',
    },
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
  expect(url.searchParams.get('response_type')).toBe('code');
  expect(url.searchParams.get('client_id')).toBe('cid');
  expect(url.searchParams.get('state')).not.toBe('fixed');
});

test('refresh：空 refreshToken 抛错', async () => {
  const { client } = createClient();
  await expect(client.refresh('')).rejects.toThrow(i18n.t('refresh_token_empty'));
});

test('refresh：成功换取新令牌', async () => {
  const { client } = createClient();
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      capturedUrl = String(url);
      capturedInit = init;
      return Response.json({
        access_token: 'new-at',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'new-rt',
        scope: 'read:user',
      });
    }),
  );

  const token = await client.refresh('old-rt', { scope: ['read:user', 'repo'] });
  expect(token).toEqual({
    access_token: 'new-at',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'new-rt',
    scope: 'read:user',
    id_token: undefined,
  });
  expect(capturedUrl).toBe('https://example.com/oauth/token');
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('grant_type')).toBe('refresh_token');
  expect(body.get('refresh_token')).toBe('old-rt');
  expect(body.get('scope')).toBe('read:user repo');
  expect(body.get('client_id')).toBe('cid');
  expect(body.get('client_secret')).toBe('csecret');
});

test('refresh：scope 为字符串', async () => {
  const { client } = createClient();
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );
  await client.refresh('rt', { scope: 'a b' });
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('scope')).toBe('a b');
});

test('refresh：tokenAuth=basic', async () => {
  const { client } = createClient({ tokenAuth: 'basic' });
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );
  await client.refresh('rt');
  const headers = capturedInit?.headers as Record<string, string>;
  expect(headers['Authorization']).toBe(
    `Basic ${Buffer.from(`${client['formUrlEncode']('cid')}:${client['formUrlEncode']('csecret')}`, 'utf8').toString('base64')}`,
  );
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('client_id')).toBeNull();
  expect(body.get('client_secret')).toBeNull();
});

test('refresh：Basic 对特殊字符做 form-urlencoded', async () => {
  const { client } = createClient({
    tokenAuth: 'basic',
    clientId: 'id with space',
    clientSecret: 'sec*ret~',
  });
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );
  await client.refresh('rt');
  const headers = capturedInit?.headers as Record<string, string>;
  expect(headers['Authorization']).toBe(
    `Basic ${Buffer.from(
      `${client['formUrlEncode']('id with space')}:${client['formUrlEncode']('sec*ret~')}`,
      'utf8',
    ).toString('base64')}`,
  );
  // 空格 → +，* / ~ 须百分号编码（与 encodeURIComponent 不同）
  expect(client['formUrlEncode']('id with space')).toBe('id+with+space');
  expect(client['formUrlEncode']('sec*ret~')).toBe('sec%2Aret%7E');
});

test('refresh：AS 错误响应抛错', async () => {
  const { client } = createClient();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ error: 'invalid_grant' }, { status: 400 })),
  );
  await expect(client.refresh('rt')).rejects.toThrow(i18n.t('token_refresh_failed'));
});

test('refresh：form-urlencoded 无 access_token 抛错', async () => {
  const { client } = createClient();
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response('error=invalid_grant', {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }),
    ),
  );
  await expect(client.refresh('rt')).rejects.toThrow(i18n.t('token_refresh_failed'));
});

test('refresh：空 scope 不写入请求体', async () => {
  const { client } = createClient();
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return Response.json({ access_token: 'at', token_type: 'bearer' });
    }),
  );
  await client.refresh('rt', { scope: [] });
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('scope')).toBeNull();
});

test('revoke：空 token 抛错', async () => {
  const { client } = createClient({
    revocationEndpoint: 'https://example.com/oauth/revoke',
  });
  await expect(client.revoke('')).rejects.toThrow(i18n.t('revoke_token_empty'));
});

test('revoke：未配置 revocationEndpoint 抛错', async () => {
  const { client } = createClient();
  await expect(client.revoke('tok')).rejects.toThrow(i18n.t('revocation_endpoint_empty'));
});

test('revoke：成功吊销', async () => {
  const { client } = createClient({
    revocationEndpoint: 'https://example.com/oauth/revoke',
  });
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      capturedUrl = String(url);
      capturedInit = init;
      return new Response(null, { status: 200 });
    }),
  );

  await client.revoke('access-or-refresh', { tokenTypeHint: 'refresh_token' });
  expect(capturedUrl).toBe('https://example.com/oauth/revoke');
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('token')).toBe('access-or-refresh');
  expect(body.get('token_type_hint')).toBe('refresh_token');
  expect(body.get('client_id')).toBe('cid');
  expect(body.get('client_secret')).toBe('csecret');
});

test('revoke：非 2xx 抛错', async () => {
  const { client } = createClient({
    revocationEndpoint: 'https://example.com/oauth/revoke',
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status: 401 })),
  );
  await expect(client.revoke('tok')).rejects.toThrow(i18n.t('token_revoke_failed'));
});

test('revoke：网络错误抛错', async () => {
  const { client } = createClient({
    revocationEndpoint: 'https://example.com/oauth/revoke',
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('network');
    }),
  );
  await expect(client.revoke('tok')).rejects.toThrow(i18n.t('token_revoke_failed'));
});

test('revoke：tokenAuth=basic', async () => {
  const { client } = createClient({
    tokenAuth: 'basic',
    revocationEndpoint: 'https://example.com/oauth/revoke',
  });
  let capturedInit: RequestInit | undefined;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      capturedInit = init;
      return new Response(null, { status: 200 });
    }),
  );
  await client.revoke('tok', { tokenTypeHint: 'access_token' });
  const headers = capturedInit?.headers as Record<string, string>;
  expect(headers['Authorization']).toMatch(/^Basic /);
  const body = new URLSearchParams(String(capturedInit?.body));
  expect(body.get('token_type_hint')).toBe('access_token');
  expect(body.get('client_id')).toBeNull();
});

test('构造：自动登记 store 生命周期', async () => {
  const order: string[] = [];
  class TrackingAdapter extends CacheMemoryAdapter {
    override async connect() {
      order.push('init');
    }
    override async disconnect() {
      order.push('destroy');
    }
  }

  new OAuth2Client({
    authorizationEndpoint: 'https://example.com/a',
    tokenEndpoint: 'https://example.com/t',
    clientId: 'cid',
    clientSecret: 'csecret',
    redirectUri: 'http://localhost/cb',
    store: new TrackingAdapter(),
    onProfile: async () => ({}),
  });
  await new Promise((r) => setTimeout(r, 20));
  expect(order).toEqual(['init']);
  await internalDestroyServices([]);
  expect(order).toEqual(['init', 'destroy']);
});
