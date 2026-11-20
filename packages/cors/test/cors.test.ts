import { TestWebApp } from '../../web/src/testing';
import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { cors } from '../src';
import { middleware } from '@aomex/common';
describe('默认配置', function () {
  const app = new TestWebApp({
    mount: [cors()],
  });

  test('没有origin报头时，不应该设置 `Access-Control-Allow-Origin`', async () => {
    await request(app.listen())
      .get('/')
      .expect((res) => {
        expect(res.header).not.toHaveProperty('access-control-allow-origin');
      });
  });

  test('设置 `Access-Control-Allow-Origin`', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org');
  });

  test('预请求响应204状态码', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
      .expect(204);
  });

  test('请求缺失 Access-Control-Request-Method 报文时不进行预请求', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .expect(404);
  });

  test('`Vary`总是包含Origin字符串', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Origin');
  });
});

describe('options.secureContext', function () {
  test('[true] 非预请求总是设置 `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', async () => {
    const app = new TestWebApp({
      mount: [cors({ secureContext: true })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Cross-Origin-Opener-Policy', 'same-origin')
      .expect('Cross-Origin-Embedder-Policy', 'require-corp')
      .expect(404);
  });

  test('[true] 预请求总是设置 `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', async () => {
    const app = new TestWebApp({
      mount: [cors({ secureContext: true })],
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Cross-Origin-Opener-Policy', 'same-origin')
      .expect('Cross-Origin-Embedder-Policy', 'require-corp')
      .expect(204);
  });

  test('[true] 非预请求不设置 `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', async () => {
    const app = new TestWebApp({
      mount: [cors({ secureContext: false })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res.header).not.toHaveProperty('cross-origin-opener-policy');
        expect(res.header).not.toHaveProperty('cross-origin-embedder-policy');
      })
      .expect(404);
  });

  test('[false] 预请求不设置 `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', async () => {
    const app = new TestWebApp({
      mount: [cors({ secureContext: false })],
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        expect(res.header).not.toHaveProperty('cross-origin-opener-policy');
        expect(res.header).not.toHaveProperty('cross-origin-embedder-policy');
      })
      .expect(204);
  });
});

describe('options.origin', function () {
  test.each([
    new TestWebApp({
      mount: [cors({ origin: () => '' })],
    }),
    new TestWebApp({
      mount: [cors({ origin: async () => '' })],
    }),
    new TestWebApp({
      mount: [cors({ origin: '' })],
    }),
  ])('禁用跨域', async (app) => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
      });
  });

  test.each([
    new TestWebApp({
      mount: [cors({ origin: () => '*' })],
    }),
    new TestWebApp({
      mount: [cors({ origin: async () => '*' })],
    }),
    new TestWebApp({
      mount: [cors({ origin: '*' })],
    }),
  ])('设置 Access-Control-Allow-Origin 为 *', async (app) => {
    await request(app.listen()).get('/').expect('Access-Control-Allow-Origin', '*');
  });

  test('数组白名单命中时回写请求 Origin', async () => {
    const app = new TestWebApp({
      mount: [
        cors({
          origin: ['https://aomex.js.org', 'https://example.com'],
        }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org');
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://example.com')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Origin', 'https://example.com')
      .expect(204);
  });

  test.each([
    new TestWebApp({
      mount: [cors({ origin: ['https://aomex.js.org'] })],
    }),
    new TestWebApp({
      mount: [cors({ origin: [] })],
    }),
  ])('数组白名单未命中时不设置 Access-Control-Allow-Origin', async (app) => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://evil.example')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
      });
    // 未命中白名单时不进入 CORS 预检短路，交由后续路由处理（此处无路由 → 404）
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://evil.example')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
      })
      .expect(404);
  });

  test('数组白名单无请求 Origin 时不设置 Access-Control-Allow-Origin', async () => {
    const app = new TestWebApp({
      mount: [cors({ origin: ['https://aomex.js.org'] })],
    });
    await request(app.listen())
      .get('/')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
      });
  });

  test('数组白名单不做子串匹配', async () => {
    const app = new TestWebApp({
      mount: [cors({ origin: ['https://aomex.js.org'] })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org.evil.com')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
      });
  });
});

describe('options.exposeHeaders', function () {
  test('字符串', async () => {
    const app = new TestWebApp({
      mount: [cors({ exposeHeaders: 'content-length' })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Expose-Headers', 'content-length');
  });

  test('数组', async () => {
    const app = new TestWebApp({
      mount: [cors({ exposeHeaders: ['content-length', 'x-header'] })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Expose-Headers', 'content-length,x-header');
  });
});

describe('options.maxAge', function () {
  test('默认值', async () => {
    const app = new TestWebApp({
      mount: [cors()],
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204);
  });

  test('使用数字', async () => {
    const app = new TestWebApp({
      mount: [cors({ maxAge: 7200 })],
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '7200')
      .expect(204);
  });

  test('使用字符串', async () => {
    const app = new TestWebApp({
      mount: [cors({ maxAge: '3600' })],
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204);
  });

  test('非预请求则不设置', async () => {
    const app = new TestWebApp({
      mount: [cors({ maxAge: 3600 })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-max-age');
      });
  });
});

describe('options.credentials', function () {
  test('凭证开启且静态 origin 为 * 时创建中间件即抛错', async () => {
    const { i18n } = await import('../src/i18n');
    expect(() => cors({ origin: '*', credentials: true })).toThrow(
      i18n.t('credentials_with_wildcard_origin'),
    );
  });

  test.each(<const>[
    { origin: '*', credentials: (): true => true },
    { origin: (): '*' => '*', credentials: true },
    {
      origin: async (): Promise<'*'> => '*',
      credentials: async (): Promise<true> => true,
    },
  ])('凭证开启且动态解析为 * 时请求阶段抛错', async (opts) => {
    const { i18n } = await import('../src/i18n');
    let caught: unknown;
    const app = new TestWebApp({
      mount: [
        middleware.web(async (_, next) => {
          try {
            await next();
          } catch (err) {
            caught = err;
          }
        }),
        cors(opts),
      ],
    });
    await request(app.listen()).get('/').set('Origin', 'https://aomex.js.org');
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe(i18n.t('credentials_with_wildcard_origin'));
  });

  test('凭证静态开启但未配置 origin 时创建中间件即抛错', async () => {
    const { i18n } = await import('../src/i18n');
    expect(() => cors({ credentials: true })).toThrow(
      i18n.t('credentials_without_origin'),
    );
  });

  test.each(<const>[
    { credentials: (): true => true },
    { credentials: async (): Promise<true> => true },
  ])('凭证函数返回 true 但未配置 origin 时请求阶段抛错', async (opts) => {
    const { i18n } = await import('../src/i18n');
    let caught: unknown;
    const app = new TestWebApp({
      mount: [
        middleware.web(async (_, next) => {
          try {
            await next();
          } catch (err) {
            caught = err;
          }
        }),
        cors(opts),
      ],
    });
    await request(app.listen()).get('/').set('Origin', 'https://aomex.js.org');
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe(i18n.t('credentials_without_origin'));
  });

  test('显式空白名单 + 凭证：未命中时不抛错且不设置 CORS', async () => {
    const app = new TestWebApp({
      mount: [cors({ origin: [], credentials: true })],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
        expect(res.headers).not.toHaveProperty('access-control-allow-credentials');
      });
  });

  test.each(<const>[
    { origin: '', credentials: true },
    { origin: (): string => '', credentials: true },
    { origin: async (): Promise<string> => '', credentials: true },
  ])('显式空 origin + 凭证：禁用 CORS 且不反射', async (opts) => {
    const app = new TestWebApp({
      mount: [cors(opts)],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
        expect(res.headers).not.toHaveProperty('access-control-allow-credentials');
      });
  });

  test.each(<const>[
    { origin: 'https://aomex.js.org', credentials: true },
    { origin: 'https://aomex.js.org', credentials: (): true => true },
    {
      origin: (): string => 'https://aomex.js.org',
      credentials: true,
    },
    {
      origin: async (): Promise<string> => 'https://aomex.js.org',
      credentials: async (): Promise<true> => true,
    },
  ])('凭证开启且显式具体来源时设置 Credentials', async (opts) => {
    const app = new TestWebApp({
      mount: [cors(opts)],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true');
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204);
  });

  test('凭证开启且数组白名单命中时设置 Credentials', async () => {
    const app = new TestWebApp({
      mount: [
        cors({
          origin: ['https://aomex.js.org', 'https://example.com'],
          credentials: true,
        }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true');
  });

  test('凭证开启且数组白名单未命中时不设置 CORS', async () => {
    const app = new TestWebApp({
      mount: [
        cors({
          origin: ['https://aomex.js.org'],
          credentials: true,
        }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://evil.example')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
        expect(res.headers).not.toHaveProperty('access-control-allow-credentials');
      });
  });

  test.each([
    new TestWebApp({
      mount: [cors({})],
    }),
    new TestWebApp({
      mount: [cors({ credentials: false })],
    }),
    new TestWebApp({
      mount: [cors({ credentials: () => false })],
    }),
    new TestWebApp({
      mount: [cors({ credentials: async () => false })],
    }),
  ])('[false] 不设置 Access-Control-Allow-Credentials', async (app) => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-credentials');
      });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-credentials');
      })
      .expect(204);
  });
});

describe('options.allowHeaders', function () {
  test('字符串', async () => {
    const app = new TestWebApp({
      mount: [cors({ allowHeaders: 'X-PINGOTHER' })],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204);
  });

  test('数组', async () => {
    const app = new TestWebApp({
      mount: [cors({ allowHeaders: ['X-PINGOTHER', 'Y'] })],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER,Y')
      .expect(204);
  });

  test('把请求报文 Access-Control-Request-Headers 上的内容复制到 Access-Control-Allow-Headers', async () => {
    const app = new TestWebApp({
      mount: [cors()],
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .set('Access-Control-Request-Headers', 'X-PINGOTHER')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204);
  });
});

describe('options.allowMethods', function () {
  test('默认值', async () => {
    const app = new TestWebApp({
      mount: [cors()],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
      .expect(204);
  });

  test('数组', async () => {
    const app = new TestWebApp({
      mount: [cors({ allowMethods: ['GET', 'POST'] })],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect(204);
  });

  test('跳过报文', async () => {
    const app = new TestWebApp({
      mount: [cors({ allowMethods: undefined })],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        expect(res.header).not.toHaveProperty('access-control-allow-methods');
      })
      .expect(204);
  });
});

describe('vary', () => {
  test('其他中间件设置了vary报文', async () => {
    const app = new TestWebApp({
      mount: [
        middleware.web((ctx, next) => {
          ctx.response.vary('Accept-Encoding');
          return next();
        }),
        cors({ allowMethods: undefined }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Accept-Encoding, Origin');
  });

  test('其他中间件报错并设置了vary', async () => {
    const app = new TestWebApp({
      mount: [
        cors({ allowMethods: undefined }),
        middleware.web((ctx) => {
          // 5xx 默认不暴露 message；本用例要断言正文，需显式 expose
          ctx.throw(500, 'Oops', {
            expose: true,
            headers: {
              Vary: 'Accept-Encoding',
            },
          });
        }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Accept-Encoding, Origin')
      .expect(500, 'Oops');
  });

  test('其他中间件报错并设置了vary=*', async () => {
    const app = new TestWebApp({
      mount: [
        cors({ allowMethods: undefined }),
        middleware.web((ctx) => {
          ctx.throw(500, 'Oops', {
            expose: true,
            headers: {
              Vary: '*',
            },
          });
        }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', '*')
      .expect(500, 'Oops');
  });

  test('其他中间件报错并设置了vary而且包含了Origin，则不能重复添加', async () => {
    const app = new TestWebApp({
      mount: [
        cors({ allowMethods: undefined }),
        middleware.web((ctx) => {
          ctx.throw(500, 'Oops', {
            expose: true,
            headers: {
              Vary: 'Origin, Accept-Encoding',
            },
          });
        }),
      ],
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Origin, Accept-Encoding')
      .expect(500, 'Oops');
  });
});

test('options.privateNetworkAccess=false', async () => {
  const app = new TestWebApp({
    mount: [cors({ privateNetworkAccess: false })],
  });

  await request(app.listen())
    .get('/')
    .set('Origin', 'https://aomex.js.org')
    .set('Access-Control-Request-Method', 'PUT')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('access-control-allow-private-network');
    });
  await request(app.listen())
    .options('/')
    .set('Origin', 'https://aomex.js.org')
    .set('Access-Control-Request-Method', 'PUT')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('access-control-allow-private-network');
    })
    .expect(204);
  await request(app.listen())
    .options('/')
    .set('Origin', 'https://aomex.js.org')
    .set('Access-Control-Request-Method', 'PUT')
    .set('Access-Control-Request-Private-Network', 'true')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('access-control-allow-private-network');
    })
    .expect(204);
});

describe('options.privateNetworkAccess=true', function () {
  const app = new TestWebApp({
    mount: [cors({ privateNetworkAccess: true })],
  });
  test('非预请求不设置 `Access-Control-Allow-Private-Network`', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-private-network');
      });
  });

  test('预请求不带 `Access-Control-Request-Private-Network` 时不设置 `Access-Control-Allow-Private-Network`', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-private-network');
      })
      .expect(204);
  });

  test('预请求带 `Access-Control-Request-Private-Network` 时总是设置 `Access-Control-Allow-Private-Network`', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .set('Access-Control-Request-Private-Network', 'true')
      .expect(204)
      .expect('Access-Control-Allow-Private-Network', 'true');
  });
});
