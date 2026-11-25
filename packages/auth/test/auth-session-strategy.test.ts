import { TestWebApp } from '../../web/src/testing';
import { Caching } from '@aomex/cache';
import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { middleware, OpenAPI } from '@aomex/common';
import supertest from 'supertest';
import { expect, test, vitest } from 'vitest';
import { Auth } from '../src';
import { AuthError } from '../src/auth-error';
import { AuthSessionStrategy } from '../src/strategies/auth-session-strategy';

type Stored = { userId: number };
type Loaded = { userId: number; role?: number };

function createCache() {
  return new Caching(new CacheMemoryAdapter());
}

function createAuth(opts?: {
  store?: Caching;
  sliding?: boolean;
  onLoaded?: AuthSessionStrategy.Options<Stored, Loaded, any[]>['onLoaded'];
  cookieName?: string;
  maxAge?: number;
  generateCacheKey?: AuthSessionStrategy.Options<
    Stored,
    Loaded,
    any[]
  >['generateCacheKey'];
}) {
  const cache = opts?.store ?? createCache();
  const strategy = new AuthSessionStrategy<Stored, Loaded, [role: number]>({
    store: cache,
    generateCacheKey: opts?.generateCacheKey,
    cookie: { name: opts?.cookieName, maxAge: opts?.maxAge ?? 3600 },
    sliding: opts?.sliding,
    onLoaded: opts?.onLoaded ?? ((data) => data),
  });
  const auth = new Auth({ strategies: { session: strategy } });
  return { auth, cache, strategy };
}

function parseSessionId(
  setCookie: string | string[] | undefined,
  name = 'sessionId',
): string {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  for (const item of list) {
    const match = item.match(new RegExp(`(?:^|,\\s*)${name}=([^;]+)`));
    if (match?.[1]) return match[1];
  }
  throw new Error('sessionId cookie not found');
}

test('无 cookie 返回 401', async () => {
  const { auth } = createAuth();
  const app = new TestWebApp({ mount: [auth.authenticate('session')] });
  await supertest(app.listen()).get('/').expect(401);
});

test('login 后可认证', async () => {
  const { auth, strategy } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        if (ctx.request.pathname === '/login') {
          await strategy.login(ctx, { userId: 1 });
          ctx.send('ok');
          return;
        }
        return next();
      }),
      auth.authenticate('session'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.session);
      }),
    ],
  });

  const login = await supertest(app.listen()).get('/login').expect(200, 'ok');
  const sessionId = parseSessionId(login.headers['set-cookie']);

  const me = await supertest(app.listen())
    .get('/')
    .set('Cookie', `sessionId=${sessionId}`)
    .expect(200);

  expect(me.body).toEqual({ sessionId, data: { userId: 1 } });
});

test('无效 sessionId 返回 401', async () => {
  const { auth } = createAuth();
  const app = new TestWebApp({ mount: [auth.authenticate('session')] });
  await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=not-exists')
    .expect(401);
});

test('过期会话返回 401', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({ store: cache, maxAge: 1 });
  await cache.set(strategy['getSessionKey']('expired'), { userId: 1 }, 1);
  await new Promise((r) => setTimeout(r, 5));

  const app = new TestWebApp({ mount: [auth.authenticate('session')] });
  await supertest(app.listen()).get('/').set('Cookie', 'sessionId=expired').expect(401);
});

test('cookie.maxAge 非正数时构造抛错', () => {
  expect(
    () =>
      new AuthSessionStrategy({
        store: createCache(),
        cookie: { maxAge: 0 },
        onLoaded(data: Stored) {
          return data;
        },
      }),
  ).toThrow(/cookie\.maxAge|positive/);
  expect(
    () =>
      new AuthSessionStrategy({
        store: createCache(),
        cookie: { maxAge: -1 },
        onLoaded(data: Stored) {
          return data;
        },
      }),
  ).toThrow(/cookie\.maxAge|positive/);
});

test('logout 后旧 sessionId 失效', async () => {
  const { auth, strategy } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        if (ctx.request.pathname === '/login') {
          await strategy.login(ctx, { userId: 2 });
          ctx.send('ok');
          return;
        }
        if (ctx.request.pathname === '/logout') {
          await strategy.logout(ctx);
          ctx.send('bye');
          return;
        }
        return next();
      }),
      auth.authenticate('session'),
      middleware.web((ctx) => {
        ctx.send('me');
      }),
    ],
  });

  const login = await supertest(app.listen()).get('/login').expect(200);
  const sid = parseSessionId(login.headers['set-cookie']);

  await supertest(app.listen())
    .get('/logout')
    .set('Cookie', `sessionId=${sid}`)
    .expect(200, 'bye');

  await supertest(app.listen()).get('/').set('Cookie', `sessionId=${sid}`).expect(401);
});

test('logout 清除 Cookie 时带上 path 与 domain', async () => {
  const strategy = new AuthSessionStrategy<Stored, Loaded, []>({
    store: createCache(),
    cookie: { maxAge: 3600, path: '/app', domain: 'example.com' },
    onLoaded(data) {
      return data;
    },
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        await strategy.logout(ctx);
        ctx.send('bye');
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200, 'bye');
  const setCookie = res.headers['set-cookie'];
  const line = Array.isArray(setCookie) ? setCookie.join(',') : String(setCookie);
  expect(line).toMatch(/sessionId=;/);
  expect(line).toMatch(/Path=\/app/i);
  expect(line).toMatch(/Domain=example\.com/i);
  expect(line).toMatch(/Expires=/i);
});

test('regenerateSessionId 默认沿用 Stored 并轮换 id', async () => {
  const { auth, strategy, cache } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        if (ctx.request.pathname === '/login') {
          await strategy.login(ctx, { userId: 1 });
          ctx.send('ok');
          return;
        }
        if (ctx.request.pathname === '/rotate') {
          const sid = await strategy.regenerateSessionId(ctx);
          ctx.send({ ok: sid !== false, sid });
          return;
        }
        return next();
      }),
      auth.authenticate('session'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.session.data);
      }),
    ],
  });

  const login = await supertest(app.listen()).get('/login').expect(200);
  const oldSid = parseSessionId(login.headers['set-cookie']);

  const rotate = await supertest(app.listen())
    .get('/rotate')
    .set('Cookie', `sessionId=${oldSid}`)
    .expect(200);
  expect(rotate.body.ok).toBe(true);
  const newSid = rotate.body.sid as string;
  expect(newSid).not.toBe(oldSid);
  expect(await cache.get(strategy['getSessionKey'](oldSid))).toBeNull();
  expect(await cache.get(strategy['getSessionKey'](newSid))).toEqual({ userId: 1 });

  await supertest(app.listen()).get('/').set('Cookie', `sessionId=${oldSid}`).expect(401);
  await supertest(app.listen())
    .get('/')
    .set('Cookie', `sessionId=${newSid}`)
    .expect(200, { userId: 1 });
});

test('regenerateSessionId 可顺带更新 Stored', async () => {
  const { auth, strategy } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        if (ctx.request.pathname === '/login') {
          await strategy.login(ctx, { userId: 1 });
          ctx.send('ok');
          return;
        }
        if (ctx.request.pathname === '/rotate') {
          await strategy.regenerateSessionId(ctx, { userId: 9 });
          ctx.send('ok');
          return;
        }
        return next();
      }),
      auth.authenticate('session'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.session.data);
      }),
    ],
  });

  const login = await supertest(app.listen()).get('/login').expect(200);
  const oldSid = parseSessionId(login.headers['set-cookie']);
  const rotate = await supertest(app.listen())
    .get('/rotate')
    .set('Cookie', `sessionId=${oldSid}`)
    .expect(200);
  const newSid = parseSessionId(rotate.headers['set-cookie']);
  await supertest(app.listen())
    .get('/')
    .set('Cookie', `sessionId=${newSid}`)
    .expect(200, { userId: 9 });
});

test('regenerateSessionId 无会话返回 false', async () => {
  const { strategy } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send({ ok: await strategy.regenerateSessionId(ctx) });
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(200, { ok: false });
});

test('自定义 cookie 名', async () => {
  const { auth, strategy } = createAuth({ cookieName: 'aomex.sid' });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        if (ctx.request.pathname === '/login') {
          await strategy.login(ctx, { userId: 3 });
          ctx.send('ok');
          return;
        }
        return next();
      }),
      auth.authenticate('session'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.session.data);
      }),
    ],
  });

  const login = await supertest(app.listen()).get('/login').expect(200);
  const sid = parseSessionId(login.headers['set-cookie'], 'aomex.sid');

  await supertest(app.listen())
    .get('/')
    .set('Cookie', `aomex.sid=${sid}`)
    .expect(200, { userId: 3 });
});

test('自定义 generateCacheKey', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({
    store: cache,
    generateCacheKey: (sessionId) => `my:sess:${sessionId}`,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        if (ctx.request.pathname === '/login') {
          await strategy.login(ctx, { userId: 4 });
          ctx.send('ok');
          return;
        }
        return next();
      }),
      auth.authenticate('session'),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const login = await supertest(app.listen()).get('/login').expect(200);
  const sid = parseSessionId(login.headers['set-cookie']);
  expect(await cache.get(`my:sess:${sid}`)).toEqual({ userId: 4 });
  expect(await cache.get(`auth:session:${sid}`)).toBeNull();

  await supertest(app.listen())
    .get('/')
    .set('Cookie', `sessionId=${sid}`)
    .expect(200, 'ok');
});

test('onLoaded 返回 false 时 401', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({
    store: cache,
    onLoaded() {
      return false;
    },
  });
  await cache.set(strategy['getSessionKey']('s1'), { userId: 1 }, 3600_000);
  const app = new TestWebApp({ mount: [auth.authenticate('session')] });
  await supertest(app.listen()).get('/').set('Cookie', 'sessionId=s1').expect(401);
});

test('onLoaded 抛出 AuthError 时 401', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({
    store: cache,
    onLoaded() {
      throw new AuthError('disabled');
    },
  });
  await cache.set(strategy['getSessionKey']('s1'), { userId: 1 }, 3600_000);
  const app = new TestWebApp({ mount: [auth.authenticate('session')] });
  await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=s1')
    .expect(401, 'disabled');
});

test('onLoaded 可变换身份数据', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({
    store: cache,
    onLoaded(data) {
      return { userId: data.userId, role: 9 };
    },
  });
  await cache.set(strategy['getSessionKey']('s1'), { userId: 1 }, 3600_000);
  const app = new TestWebApp({
    mount: [
      auth.authenticate('session'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.session.data);
      }),
    ],
  });
  await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=s1')
    .expect(200, { userId: 1, role: 9 });
});

test('sliding 用 expire 续期且不把 Loaded 写回 store', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({
    store: cache,
    sliding: true,
    maxAge: 3600,
    onLoaded(data) {
      return { userId: data.userId, role: 1 };
    },
  });
  const key = strategy['getSessionKey']('s1');
  await cache.set(key, { userId: 1 }, 1000);
  const expireSpy = vitest.spyOn(cache, 'expire');
  const setSpy = vitest.spyOn(cache, 'set');
  setSpy.mockClear();

  const app = new TestWebApp({
    mount: [
      auth.authenticate('session'),
      middleware.web((ctx) => {
        // @ts-expect-error
        ctx.send(ctx.auth.session.data);
      }),
    ],
  });

  const res = await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=s1')
    .expect(200, { userId: 1, role: 1 });

  expect(expireSpy).toHaveBeenCalledWith(key, 3600_000);
  expect(setSpy).not.toHaveBeenCalled();
  expect(await cache.get(key)).toEqual({ userId: 1 });
  expect(parseSessionId(res.headers['set-cookie'])).toBe('s1');
});

test('sliding 时 expire 失败则认证失败且不写 Cookie', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({ store: cache, sliding: true });
  await cache.set(strategy['getSessionKey']('s1'), { userId: 1 }, 3600_000);
  vitest.spyOn(cache, 'expire').mockResolvedValue(false);

  const app = new TestWebApp({
    mount: [
      auth.authenticate('session'),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const res = await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=s1')
    .expect(401);
  expect(res.headers['set-cookie']).toBeUndefined();
});

test('权限认证', async () => {
  const cache = createCache();
  const strategy = new AuthSessionStrategy<
    { userId: number },
    { userId: number; role?: number },
    [role: number]
  >({
    store: cache,
    cookie: { maxAge: 3600 },
    onLoaded(data) {
      return data;
    },
    onAuthorize(role) {
      return this.getIdentity().role === role;
    },
  });
  await strategy['cache'].set(
    strategy['getSessionKey']('admin'),
    { userId: 1, role: 1 },
    3600_000,
  );
  await strategy['cache'].set(
    strategy['getSessionKey']('user'),
    { userId: 2, role: 0 },
    3600_000,
  );
  const auth = new Auth({ strategies: { session: strategy } });
  const app = new TestWebApp({
    mount: [
      auth.authenticate('session').authorize(1),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=admin')
    .expect(200, 'ok');
  await supertest(app.listen()).get('/').set('Cookie', 'sessionId=user').expect(403);
});

test('sliding 刷新 TTL', async () => {
  const cache = createCache();
  const { auth, strategy } = createAuth({ store: cache, sliding: true, maxAge: 3600 });
  const key = strategy['getSessionKey']('s1');
  await cache.set(key, { userId: 1 }, 1000);
  const expireSpy = vitest.spyOn(cache, 'expire');

  const app = new TestWebApp({
    mount: [
      auth.authenticate('session'),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const res = await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=s1')
    .expect(200, 'ok');

  expect(expireSpy).toHaveBeenCalledWith(key, 3600_000);
  expect(parseSessionId(res.headers['set-cookie'])).toBe('s1');
});

test('touch 无会话返回 false', async () => {
  const { strategy } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send({ ok: await strategy.touch(ctx) });
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(200, { ok: false });
});

test('touch 刷新已有会话', async () => {
  const cache = createCache();
  const { strategy } = createAuth({ store: cache, maxAge: 7200 });
  await cache.set(strategy['getSessionKey']('s1'), { userId: 1 }, 1000);
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send({ ok: await strategy.touch(ctx) });
      }),
    ],
  });
  const res = await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=s1')
    .expect(200, { ok: true });
  expect(parseSessionId(res.headers['set-cookie'])).toBe('s1');
  expect(await cache.get(strategy['getSessionKey']('s1'))).toEqual({ userId: 1 });
});

test('sessionId 为密码学安全随机串', async () => {
  const { strategy } = createAuth();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sid = await strategy.login(ctx, { userId: 1 });
        ctx.send(sid);
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  expect(res.text).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

test('login 用 setNX，碰撞时换 id 重试', async () => {
  const { strategy, cache } = createAuth({ maxAge: 3600 });
  const originalSetNX = Caching.prototype.setNX;
  let attempts = 0;
  const setNX = vitest
    .spyOn(cache, 'setNX')
    .mockImplementation(async (key, data, ttl) => {
      attempts += 1;
      // 第一次：先占住随机 id，让真实 setNX 返回 false，触发换 id 重试
      if (attempts === 1) {
        await cache.set(key, { userId: 99 }, ttl);
      }
      return originalSetNX.call(cache, key, data, ttl);
    });

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.send(await strategy.login(ctx, { userId: 1 }));
      }),
    ],
  });
  const res = await supertest(app.listen()).get('/').expect(200);
  expect(res.text).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(setNX).toHaveBeenCalledTimes(2);
  const occupiedKey = setNX.mock.calls[0]![0];
  const freshKey = setNX.mock.calls[1]![0];
  expect(freshKey).not.toBe(occupiedKey);
  expect(await cache.get(occupiedKey)).toEqual({ userId: 99 });
  expect(await cache.get(freshKey)).toEqual({ userId: 1 });
  expect(freshKey).toBe(strategy['getSessionKey'](res.text));
});

test('login setNX 连续失败则抛错，不无限重试', async () => {
  const { strategy } = createAuth();
  vitest.spyOn(strategy['cache'], 'setNX').mockResolvedValue(false);

  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        await expect(strategy.login(ctx, { userId: 1 })).rejects.toThrow(
          /无法创建会话|Failed to create session/,
        );
        ctx.send('ok');
      }),
    ],
  });
  await supertest(app.listen()).get('/').expect(200);
  expect(strategy['cache'].setNX).toHaveBeenCalledTimes(10);
});

test('空 cookie 值视为未登录', async () => {
  const { auth } = createAuth();
  const app = new TestWebApp({ mount: [auth.authenticate('session')] });
  await supertest(app.listen()).get('/').set('Cookie', 'sessionId=').expect(401);
  await supertest(app.listen()).get('/').set('Cookie', 'sessionId=   ').expect(401);
});

test('非法 sessionId 格式视为未登录', async () => {
  const { auth, strategy, cache } = createAuth();
  await cache.set(strategy['getSessionKey']('ok-id'), { userId: 1 }, 3600_000);
  const app = new TestWebApp({
    mount: [
      auth.authenticate('session'),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });
  await supertest(app.listen()).get('/').set('Cookie', 'sessionId=has/slash').expect(401);
  await supertest(app.listen())
    .get('/')
    .set('Cookie', `sessionId=${'a'.repeat(129)}`)
    .expect(401);
  await supertest(app.listen())
    .get('/')
    .set('Cookie', 'sessionId=ok-id')
    .expect(200, 'ok');
});

test('文档', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };
  const md = new Auth({
    strategies: {
      session: new AuthSessionStrategy({
        store: createCache(),
        cookie: { name: 'sessionId', maxAge: 3600 },
        onLoaded(data: { userId: number }) {
          return data;
        },
      }),
    },
  }).authenticate('session');
  const openapi = md['openapi']();
  openapi.onDocument?.(doc);
  openapi.onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  openapi.postMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  openapi.postDocument?.(doc);

  expect(doc).toMatchInlineSnapshot(`
    {
      "components": {
        "securitySchemes": {
          "sessionCookie": {
            "in": "cookie",
            "name": "sessionId",
            "type": "apiKey",
          },
        },
      },
      "info": {
        "title": "",
        "version": "",
      },
      "openapi": "",
      "paths": {
        "/": {
          "get": {
            "responses": {
              "401": {
                "description": "Unauthorized",
              },
            },
            "security": [
              {
                "sessionCookie": [],
              },
            ],
          },
        },
      },
    }
  `);
});
