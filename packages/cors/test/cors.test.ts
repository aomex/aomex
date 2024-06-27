import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { cors } from '../src';
import { WebApp } from '@aomex/web';
import { mdchain, middleware } from '@aomex/core';

describe('默认配置', function () {
  const app = new WebApp({
    mount: mdchain.web.mount(cors()),
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
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ secureContext: true })),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Cross-Origin-Opener-Policy', 'same-origin')
      .expect('Cross-Origin-Embedder-Policy', 'require-corp')
      .expect(404);
  });

  test('[true] 预请求总是设置 `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ secureContext: true })),
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
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ secureContext: false })),
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
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ secureContext: false })),
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
    new WebApp({
      mount: mdchain.web.mount(cors({ origin: () => '' })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ origin: async () => '' })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ origin: '' })),
    }),
  ])('禁用跨域', async (app) => {
    await request(app.listen())
      .get('/')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('access-control-allow-origin');
      });
  });

  test.each([
    new WebApp({
      mount: mdchain.web.mount(cors({ origin: () => '*' })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ origin: async () => '*' })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ origin: '*' })),
    }),
  ])('设置 Access-Control-Allow-Origin 为 *', async (app) => {
    await request(app.listen()).get('/').expect('Access-Control-Allow-Origin', '*');
  });
});

describe('options.exposeHeaders', function () {
  test('字符串', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ exposeHeaders: 'content-length' })),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Expose-Headers', 'content-length');
  });

  test('数组', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ exposeHeaders: ['content-length', 'x-header'] })),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Expose-Headers', 'content-length,x-header');
  });
});

describe('options.maxAge', function () {
  test('使用数字', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ maxAge: 3600 })),
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204);
  });

  test('使用字符串', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ maxAge: '3600' })),
    });
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204);
  });

  test('非预请求则不设置', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ maxAge: 3600 })),
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
  test.each([
    new WebApp({
      mount: mdchain.web.mount(cors({ credentials: true })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ credentials: () => true })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ credentials: async () => true })),
    }),
  ])('[true] 不设置 Access-Control-Allow-Credentials', async (app) => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true');
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204);
  });

  test.each([
    new WebApp({
      mount: mdchain.web.mount(cors({})),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ credentials: false })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ credentials: () => false })),
    }),
    new WebApp({
      mount: mdchain.web.mount(cors({ credentials: async () => false })),
    }),
  ])('[false] 不设置 Access-Control-Allow-Credentials', async (app) => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        expect(res).not.not.toHaveProperty('access-control-allow-credentials');
      });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect((res) => {
        expect(res).not.not.toHaveProperty('access-control-allow-credentials');
      })
      .expect(204);
  });
});

describe('options.allowHeaders', function () {
  test('字符串', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowHeaders: 'X-PINGOTHER' })),
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204);
  });

  test('数组', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowHeaders: ['X-PINGOTHER', 'Y'] })),
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER,Y')
      .expect(204);
  });

  test('把请求报文 Access-Control-Request-Headers 上的内容复制到 Access-Control-Allow-Headers', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors()),
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
    const app = new WebApp({
      mount: mdchain.web.mount(cors()),
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
      .expect(204);
  });

  test('数组', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowMethods: ['GET', 'POST'] })),
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect(204);
  });

  test('跳过报文', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowMethods: undefined })),
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
    const app = new WebApp({
      mount: mdchain.web
        .mount(
          middleware.web((ctx, next) => {
            ctx.response.vary('Accept-Encoding');
            return next();
          }),
        )
        .mount(cors({ allowMethods: undefined })),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Accept-Encoding, Origin');
  });

  test('其他中间件报错并设置了vary', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowMethods: undefined })).mount(
        middleware.web((ctx) => {
          ctx.throw(500, 'Oops', {
            headers: {
              Vary: 'Accept-Encoding',
            },
          });
        }),
      ),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Accept-Encoding, Origin')
      .expect(/Error/)
      .expect(500);
  });

  test('其他中间件报错并设置了vary=*', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowMethods: undefined })).mount(
        middleware.web((ctx) => {
          ctx.throw(500, 'Oops', {
            headers: {
              Vary: '*',
            },
          });
        }),
      ),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', '*')
      .expect(/Error/)
      .expect(500);
  });

  test('其他中间件报错并设置了vary而且包含了Origin，则不能重复添加', async () => {
    const app = new WebApp({
      mount: mdchain.web.mount(cors({ allowMethods: undefined })).mount(
        middleware.web((ctx) => {
          ctx.throw(500, 'Oops', {
            headers: {
              Vary: 'Origin, Accept-Encoding',
            },
          });
        }),
      ),
    });
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Origin, Accept-Encoding')
      .expect(/Error/)
      .expect(500);
  });
});

test('options.privateNetworkAccess=false', async () => {
  const app = new WebApp({
    mount: mdchain.web.mount(cors({ privateNetworkAccess: false })),
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
  const app = new WebApp({
    mount: mdchain.web.mount(cors({ privateNetworkAccess: true })),
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
