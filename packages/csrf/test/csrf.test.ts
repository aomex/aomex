import { ensureI18nLanguage, middleware } from '@aomex/common';
import { expect, test } from 'vitest';
import supertest from 'supertest';
import { TestWebApp } from '../../web/src/testing';
import { csrf } from '../src';
import { i18n } from '../src/i18n';

function parseCookieValue(
  setCookie: string | string[] | undefined,
  name: string,
): string {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  for (const item of list) {
    const match = item.match(new RegExp(`(?:^|,\\s*)${name}=([^;]+)`));
    if (match?.[1]) return match[1];
  }
  throw new Error(`${name} cookie not found`);
}

function findSetCookie(setCookie: string | string[] | undefined, name: string): string {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  const hit = list.find(
    (item) => item.startsWith(`${name}=`) || item.includes(`, ${name}=`),
  );
  if (!hit) throw new Error(`${name} set-cookie not found`);
  return hit;
}

test('GET 签发 csrf Cookie 且不校验 Header', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        // @ts-expect-error 后续中间件未贯通上游 props
        ctx.send({ token: ctx.csrfToken });
      }),
    ],
  });

  const res = await supertest(app.listen()).get('/').expect(200);
  const cookie = parseCookieValue(res.headers['set-cookie'], 'csrfToken');
  expect(cookie).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(res.body.token).toBe(cookie);

  const line = findSetCookie(res.headers['set-cookie'], 'csrfToken');
  expect(line).toMatch(/SameSite=Strict/i);
  expect(line).not.toMatch(/HttpOnly/i);
});

test('已有合法 Cookie 时不重新签发', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        // @ts-expect-error 后续中间件未贯通上游 props
        ctx.send({ token: ctx.csrfToken });
      }),
    ],
  });

  const first = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(first.headers['set-cookie'], 'csrfToken');

  const second = await supertest(app.listen())
    .get('/')
    .set('Cookie', `csrfToken=${token}`)
    .expect(200);

  expect(second.headers['set-cookie']).toBeUndefined();
  expect(second.body.token).toBe(token);
});

test('非法 Cookie 会重新签发', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        // @ts-expect-error 后续中间件未贯通上游 props
        ctx.send({ token: ctx.csrfToken });
      }),
    ],
  });

  const res = await supertest(app.listen())
    .get('/')
    .set('Cookie', 'csrfToken=not-a-valid-token')
    .expect(200);

  const token = parseCookieValue(res.headers['set-cookie'], 'csrfToken');
  expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(token).not.toBe('not-a-valid-token');
  expect(res.body.token).toBe(token);
});

test('POST 缺少 Header 返回 403', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .expect(403, 'CSRF 校验失败');
});

test('POST Cookie 与 Header 一致时通过', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        // @ts-expect-error 后续中间件未贯通上游 props
        ctx.send({ ok: true, token: ctx.csrfToken });
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  const res = await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', token)
    .expect(200);

  expect(res.body).toEqual({ ok: true, token });
});

test('POST Cookie 与 Header 不一致返回 403', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');
  const other = parseCookieValue(
    (await supertest(app.listen()).get('/').expect(200)).headers['set-cookie'],
    'csrfToken',
  );

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', other)
    .expect(403);
});

test('HEAD / OPTIONS 默认跳过校验', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send(204);
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(204);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  await supertest(app.listen()).head('/').set('Cookie', `csrfToken=${token}`).expect(204);

  await supertest(app.listen())
    .options('/')
    .set('Cookie', `csrfToken=${token}`)
    .expect(204);
});

test('自定义 Cookie 名与 Header 名', async () => {
  const app = new TestWebApp({
    mount: [
      csrf({
        cookie: { name: 'xsrf' },
        headerName: 'x-xsrf-token',
      }),
      middleware.web((ctx) => {
        // @ts-expect-error 后续中间件未贯通上游 props
        ctx.send({ token: ctx.csrfToken });
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'xsrf');
  expect(boot.body.token).toBe(token);

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `xsrf=${token}`)
    .set('x-xsrf-token', token)
    .expect(200, { token });
});

test('ignore 跳过校验', async () => {
  const app = new TestWebApp({
    mount: [
      csrf({
        ignore: (ctx) => ctx.request.pathname === '/hook',
      }),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  await supertest(app.listen()).post('/hook').expect(200, 'ok');

  const denied = await supertest(app.listen()).post('/other').expect(403);
  const token = parseCookieValue(denied.headers['set-cookie'], 'csrfToken');
  expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

test('ignoreMethods 可改为空数组以校验 GET', async () => {
  const app = new TestWebApp({
    mount: [
      csrf({ ignoreMethods: [] }),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(403);

  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  await supertest(app.listen())
    .get('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', token)
    .expect(200, 'ok');
});

test('Cookie 可配置 sameSite / path / maxAge', async () => {
  const app = new TestWebApp({
    mount: [
      csrf({
        cookie: {
          sameSite: 'lax',
          path: '/api',
          maxAge: 3600,
        },
      }),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const res = await supertest(app.listen()).get('/').expect(200);
  const line = findSetCookie(res.headers['set-cookie'], 'csrfToken');
  expect(line).toMatch(/SameSite=Lax/i);
  expect(line).toMatch(/Path=\/api/i);
  expect(line).toMatch(/Max-Age=3600/i);
  expect(line).not.toMatch(/HttpOnly/i);
});

test('多值 Header 视为无效', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', [token, token] as unknown as string)
    .expect(403);
});

test('空白 Header 视为无效', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', '   ')
    .expect(403);
});

test('已有 Cookie 校验失败时不附带 Set-Cookie', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');
  const other = parseCookieValue(
    (await supertest(app.listen()).get('/').expect(200)).headers['set-cookie'],
    'csrfToken',
  );

  const res = await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', other)
    .expect(403);

  expect(res.headers['set-cookie']).toBeUndefined();
});

test('无 Cookie 首次 POST 校验失败时响应含 Set-Cookie', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  const res = await supertest(app.listen()).post('/').expect(403, 'CSRF 校验失败');
  const token = parseCookieValue(res.headers['set-cookie'], 'csrfToken');
  expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(findSetCookie(res.headers['set-cookie'], 'csrfToken')).not.toMatch(/HttpOnly/i);

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', token)
    .expect(200, 'ok');
});

test('异步 ignore', async () => {
  const app = new TestWebApp({
    mount: [
      csrf({
        ignore: async (ctx) => ctx.request.pathname === '/skip',
      }),
      middleware.web((ctx) => {
        ctx.send('ok');
      }),
    ],
  });

  await supertest(app.listen()).post('/skip').expect(200, 'ok');

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  await supertest(app.listen())
    .post('/')
    .set('Cookie', `csrfToken=${token}`)
    .set('x-csrf-token', token)
    .expect(200, 'ok');
});

test('i18n 异步加载各语言包', async () => {
  await ensureI18nLanguage('ja-JP');
  expect(i18n.t('invalid_csrf_token')).toBe('CSRF 検証に失敗しました');

  await ensureI18nLanguage('zh-TW');
  expect(i18n.t('invalid_csrf_token')).toBe('CSRF 校驗失敗');

  await ensureI18nLanguage('de-DE');
  expect(i18n.t('invalid_csrf_token')).toBe('CSRF-Prüfung fehlgeschlagen');
});

test('PUT / PATCH / DELETE 同样校验', async () => {
  const app = new TestWebApp({
    mount: [
      csrf(),
      middleware.web((ctx) => {
        ctx.send(ctx.request.method);
      }),
    ],
  });

  const boot = await supertest(app.listen()).get('/').expect(200);
  const token = parseCookieValue(boot.headers['set-cookie'], 'csrfToken');

  for (const method of ['put', 'patch', 'delete'] as const) {
    await supertest(app.listen())
      [method]('/')
      .set('Cookie', `csrfToken=${token}`)
      .expect(403);

    await supertest(app.listen())
      [method]('/')
      .set('Cookie', `csrfToken=${token}`)
      .set('x-csrf-token', token)
      .expect(200, method.toUpperCase());
  }
});
