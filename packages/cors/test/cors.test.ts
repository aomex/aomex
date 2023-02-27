import { assert, describe, expect, test } from 'vitest';
import request from 'supertest';
import { cors, CorsOptions } from '../src';
import { WebApp, WebChain, WebContext } from '@aomex/web';
import { chain, middleware } from '@aomex/core';

const createApp = (
  options?: CorsOptions,
  callback?: (ctx: WebContext) => {},
  preMiddleware?: WebChain,
) => {
  const app = new WebApp({
    silent: true,
  });
  app.mount(preMiddleware || null);
  app.mount(cors(options));
  app.mount(
    middleware.web((ctx) => {
      ctx.send({ foo: 'bar' });
      callback?.(ctx);
    }),
  );
  return app;
};

describe('default options', function () {
  const app = createApp();

  test('should not set `Access-Control-Allow-Origin` when request Origin header missing', async () => {
    await request(app.listen())
      .get('/')
      .expect({ foo: 'bar' })
      .expect(200)
      .expect((res) => {
        assert(!res.headers['Access-Control-Allow-Origin']);
      });
  });

  test('should set `Access-Control-Allow-Origin` to request origin header', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect(200);
  });

  test('should 204 on Preflight Request', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
      .expect(204);
  });

  test('should not Preflight Request if request missing Access-Control-Request-Method', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .expect(200);
  });

  test('should always set `Vary` to Origin', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Origin')
      .expect({ foo: 'bar' })
      .expect(200);
  });
});

describe('options.origin=*', function () {
  const app = createApp({
    origin: '*',
  });

  test('should always set `Access-Control-Allow-Origin` to *', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', '*')
      .expect({ foo: 'bar' })
      .expect(200);
  });
});

describe('options.secureContext=true', function () {
  const app = new WebApp();
  app.mount(
    cors({
      secureContext: true,
    }),
  );
  app.mount(
    middleware.web((ctx) => {
      ctx.send({ foo: 'bar' });
    }),
  );

  test('should always set `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` on not OPTIONS', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Cross-Origin-Opener-Policy', 'same-origin')
      .expect('Cross-Origin-Embedder-Policy', 'require-corp')
      .expect({ foo: 'bar' })
      .expect(200);
  });

  test('should always set `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` on OPTIONS', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Cross-Origin-Opener-Policy', 'same-origin')
      .expect('Cross-Origin-Embedder-Policy', 'require-corp')
      .expect(204);
  });
});

describe('options.secureContext=false', function () {
  const app = createApp({
    secureContext: false,
  });

  test('should not set `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy`', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect((res) => {
        assert(!('Cross-Origin-Opener-Policy' in res.headers));
        assert(!('Cross-Origin-Embedder-Policy' in res.headers));
      })
      .expect({ foo: 'bar' })
      .expect(200);
  });
});

describe('options.origin=function', function () {
  const app = createApp({
    origin: (ctx) => (ctx.request.url === '/forbin' ? '' : '*'),
  });

  test('should disable cors', async () => {
    await request(app.listen())
      .get('/forbin')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect(200)
      .expect((res) => {
        assert(!res.headers['Access-Control-Allow-Origin']);
      });
  });

  test('should set Access-Control-Allow-Origin to *', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200);
  });
});

describe('options.origin=async function', function () {
  const app = createApp({
    origin: async (ctx) => (ctx.request.url === '/forbin' ? '' : '*'),
  });

  test('should disable cors', async () => {
    await request(app.listen())
      .get('/forbin')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect(200)
      .expect((res) => {
        assert(!res.headers['Access-Control-Allow-Origin']);
      });
  });

  test('should set Access-Control-Allow-Origin to *', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200);
  });
});

describe('options.exposeHeaders', function () {
  test('should Access-Control-Expose-Headers: `content-length`', async () => {
    const app = createApp({
      exposeHeaders: 'content-length',
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Expose-Headers', 'content-length')
      .expect({ foo: 'bar' })
      .expect(200);
  });

  test('should work with array', async () => {
    const app = createApp({
      exposeHeaders: ['content-length', 'x-header'],
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Expose-Headers', 'content-length,x-header')
      .expect({ foo: 'bar' })
      .expect(200);
  });
});

describe('options.maxAge', function () {
  test('should set maxAge with number', async () => {
    const app = createApp({
      maxAge: 3600,
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204);
  });

  test('should set maxAge with string', async () => {
    const app = createApp({
      maxAge: '3600',
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Max-Age', '3600')
      .expect(204);
  });

  test('should not set maxAge on simple request', async () => {
    const app = createApp({
      maxAge: '3600',
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect(200)
      .expect((res) => {
        assert(!res.headers['Access-Control-Max-Age']);
      });
  });
});

describe('options.credentials', function () {
  const app = createApp({
    credentials: true,
  });

  test('should enable Access-Control-Allow-Credentials on Simple request', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect({ foo: 'bar' })
      .expect(200);
  });

  test('should enable Access-Control-Allow-Credentials on Preflight request', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204);
  });
});

describe('options.credentials unset', function () {
  const app = createApp();

  test('should disable Access-Control-Allow-Credentials on Simple request', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect(200)
      .expect((response) => {
        expect(
          response.headers['Access-Control-Allow-Credentials'],
        ).toBeUndefined();
      });
  });

  test('should disable Access-Control-Allow-Credentials on Preflight request', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect(204)
      .expect((response) => {
        expect(
          response.headers['Access-Control-Allow-Credentials'],
        ).toBeUndefined();
      });
  });
});

describe('options.credentials=function', function () {
  const app = createApp({
    credentials(ctx) {
      return ctx.request.url !== '/forbin';
    },
  });

  test('should enable Access-Control-Allow-Credentials on Simple request', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect({ foo: 'bar' })
      .expect(200);
  });

  test('should enable Access-Control-Allow-Credentials on Preflight request', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204);
  });

  test('should disable Access-Control-Allow-Credentials on Simple request', async () => {
    await request(app.listen())
      .get('/forbin')
      .set('Origin', 'https://aomex.js.org')
      .expect({ foo: 'bar' })
      .expect(200)
      .expect((response) => {
        expect(
          response.headers['Access-Control-Allow-Credentials'],
        ).toBeUndefined();
      });
  });

  test('should disable Access-Control-Allow-Credentials on Preflight request', async () => {
    await request(app.listen())
      .options('/forbin')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect(204)
      .expect((response) => {
        expect(
          response.headers['Access-Control-Allow-Credentials'],
        ).toBeUndefined();
      });
  });
});

describe('options.credentials=async function', function () {
  const app = createApp({
    credentials: async () => true,
  });

  test('should enable Access-Control-Allow-Credentials on Simple request', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect({ foo: 'bar' })
      .expect(200);
  });

  test('should enable Access-Control-Allow-Credentials on Preflight request', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'DELETE')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204);
  });
});

describe('options.allowHeaders', function () {
  test('should work with allowHeaders is string', async () => {
    const app = createApp({
      allowHeaders: 'X-PINGOTHER',
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204);
  });

  test('should work with allowHeaders is array', async () => {
    const app = createApp({
      allowHeaders: ['X-PINGOTHER'],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204);
  });

  test('should set Access-Control-Allow-Headers to request Access-Control-Request-Headers header', async () => {
    const app = createApp();

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
  test('should work with allowMethods is array', async () => {
    const app = createApp({
      allowMethods: ['GET', 'POST'],
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect(204);
  });

  test('should skip allowMethods', async () => {
    const app = createApp({
      allowMethods: undefined,
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect(204);
  });
});

describe('options.headersKeptOnError', function () {
  test.only('should keep CORS headers after an error', async () => {
    const app = createApp({}, () => {
      throw new Error('Whoops!');
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect('Vary', 'Origin')
      .expect(/Error/)
      .expect(500);
  });

  test('should not affect OPTIONS requests', async () => {
    const app = createApp({}, () => {
      throw new Error('Whoops!');
    });

    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect(204);
  });

  test('should not keep unrelated headers', async () => {
    const app = createApp({}, (ctx) => {
      ctx.response.setHeader('X-Example', 'Value');
      throw new Error('Whoops!');
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Access-Control-Allow-Origin', 'https://aomex.js.org')
      .expect(/Error/)
      .expect(500)
      .expect((res) => {
        assert(!res.headers['x-example']);
      });
  });

  test('should not keep CORS headers after an error if keepHeadersOnError is false', async () => {
    const app = createApp({ keepHeadersOnError: false }, () => {
      throw new Error('Whoops!');
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect(/Error/)
      .expect(500)
      .expect((res) => {
        assert(!res.headers['Access-Control-Allow-Origin']);
        assert(!res.headers.vary);
      });
  });
});

describe('other middleware has been set `Vary` header to Accept-Encoding', function () {
  const app = createApp(
    {},
    undefined,
    chain.web.mount(
      middleware.web((ctx, next) => {
        ctx.response.setHeader('Vary', 'Accept-Encoding');
        return next();
      }),
    ),
  );

  test('should append `Vary` header to Origin', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Accept-Encoding, Origin')
      .expect({ foo: 'bar' })
      .expect(200);
  });
});
describe('other middleware has set vary header on Error', function () {
  test('should append `Origin to other `Vary` header', async () => {
    const app = createApp({}, () => {
      const error = new Error('Whoops!');
      // @ts-ignore
      error.headers = { Vary: 'Accept-Encoding' };
      throw error;
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Accept-Encoding, Origin')
      .expect(/Error/)
      .expect(500);
  });
  test('should preserve `Vary: *`', async () => {
    const app = createApp({}, () => {
      const error = new Error('Whoops!');
      // @ts-ignore
      error.headers = { Vary: '*' };
      throw error;
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', '*')
      .expect(/Error/)
      .expect(500);
  });
  test('should not append Origin` if already present in `Vary`', async () => {
    const app = createApp({}, () => {
      const error = new Error('Whoops!');
      // @ts-ignore
      error.headers = { Vary: 'Origin, Accept-Encoding' };
      throw error;
    });

    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .expect('Vary', 'Origin, Accept-Encoding')
      .expect(/Error/)
      .expect(500);
  });
});

describe('options.privateNetworkAccess=false', function () {
  const app = createApp({ privateNetworkAccess: false });

  test('should not set `Access-Control-Allow-Private-Network` on not OPTIONS', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        assert(!('Access-Control-Allow-Private-Network' in res.headers));
      })
      .expect(200);
  });

  test('should not set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` not exist on OPTIONS', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        assert(!('Access-Control-Allow-Private-Network' in res.headers));
      })
      .expect(204);
  });

  test('should not set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` exist on OPTIONS', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .set('Access-Control-Request-Private-Network', 'true')
      .expect((res) => {
        assert(!('Access-Control-Allow-Private-Network' in res.headers));
      })
      .expect(204);
  });
});

describe('options.privateNetworkAccess=true', function () {
  const app = createApp({ privateNetworkAccess: true });

  test('should not set `Access-Control-Allow-Private-Network` on not OPTIONS', async () => {
    await request(app.listen())
      .get('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        assert(!('Access-Control-Allow-Private-Network' in res.headers));
      })
      .expect(200);
  });

  test('should not set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` not exist on OPTIONS', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .expect((res) => {
        assert(!('Access-Control-Allow-Private-Network' in res.headers));
      })
      .expect(204);
  });

  test('should always set `Access-Control-Allow-Private-Network` if `Access-Control-Request-Private-Network` exist on OPTIONS', async () => {
    await request(app.listen())
      .options('/')
      .set('Origin', 'https://aomex.js.org')
      .set('Access-Control-Request-Method', 'PUT')
      .set('Access-Control-Request-Private-Network', 'true')
      .expect(204)
      .expect('Access-Control-Allow-Private-Network', 'true');
  });
});
