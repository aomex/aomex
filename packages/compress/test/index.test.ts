import fs from 'node:fs';
import crypto from 'node:crypto';
import request from 'supertest';
import { describe, test, assert, expect } from 'vitest';
import { compress } from '../src';
import { Middleware, middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import path from 'node:path';

const buffer = crypto.randomBytes(1024);
const bufferString = buffer.toString('hex');
const sendString = middleware.web((ctx) => {
  ctx.send(bufferString);
});
const sendBuffer = middleware.web<
  Middleware.Infer<ReturnType<typeof compress>>
>((ctx) => {
  ctx.needCompress = true;
  ctx.send(buffer);
});

test('should compress strings', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendString);

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect(bufferString)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-length']);
    });
});

test('should not compress strings below threshold', async () => {
  const app = new WebApp();
  app.mount(
    compress({
      threshold: '1mb',
    }),
  );
  app.mount(sendString);

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect(bufferString)
    .expect('content-length', '2048')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-encoding']);
      assert(!res.headers['transfer-encoding']);
    });
});

test('should compress JSON body', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(
    middleware.web((ctx) => {
      ctx.send(jsonBody);
    }),
  );
  const jsonBody = { status: 200, message: 'ok', data: bufferString };

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-length']);
      expect(res.text).toBe(JSON.stringify(jsonBody));
    });
});

test('should not compress JSON body below threshold', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(
    middleware.web((ctx) => {
      ctx.send(jsonBody);
    }),
  );
  const jsonBody = { status: 200, message: 'ok' };

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-encoding']);
      assert(!res.headers['transfer-encoding']);
      expect(res.text).toBe(JSON.stringify(jsonBody));
    });
});

test('should compress buffers', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendBuffer);

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-length']);
    });
});

test('should compress streams', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(
    middleware.web((ctx) => {
      ctx.response.contentType = 'application/javascript';
      const stream = fs.createReadStream(path.resolve('./test/index.test.ts'));
      ctx.send(stream);
    }),
  );

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-length']);
    });
});

test('should compress when ctx.compress === true', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendBuffer);

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-length']);
    });
});

test('should not compress when ctx.compress === false', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(
    middleware.web((ctx) => {
      // @ts-ignore
      ctx.needCompress = false;
      ctx.send(buffer);
    }),
  );

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('content-length', '1024')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-encoding']);
      assert(!res.headers['transfer-encoding']);
    });
});

test('should not compress HEAD requests', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendString);

  await request(app.listen())
    .head('/')
    .expect((res) => {
      assert(!res.headers['content-encoding']);
    });
});

test('should not crash even if accept-encoding: sdch', () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendBuffer);

  return request(app.listen())
    .get('/')
    .set('Accept-Encoding', 'sdch, gzip, deflate')
    .expect(200);
});

test('should not compress if no accept-encoding is sent', async () => {
  const app = new WebApp();
  app.mount(compress({ threshold: 0 }));
  app.mount(
    middleware.web((ctx) => {
      ctx.response.contentType = 'text';
      ctx.send(buffer);
    }),
  );

  await request(app.listen())
    .get('/')
    .set('Accept-Encoding', '')
    .expect('content-length', '1024')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      assert(!res.headers['content-encoding']);
      assert(!res.headers['transfer-encoding']);
    });
});

test('should not crash if a type does not pass the filter', () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(
    middleware.web((ctx) => {
      ctx.response.contentType = 'image/png';
      ctx.send(Buffer.alloc(2048));
    }),
  );

  return request(app.listen()).get('/').expect(200);
});

test('should not compress when transfer-encoding is already set', () => {
  const app = new WebApp();
  app.mount(
    compress({
      threshold: 0,
    }),
  );
  app.mount(
    middleware.web((ctx) => {
      ctx.response.setHeader('Content-Encoding', 'identity');
      ctx.response.contentType = 'text';
      ctx.send('asdf');
    }),
  );

  return request(app.listen()).get('/').expect('asdf');
});

describe('Cache-Control', () => {
  test.each([
    'no-transform',
    'public, no-transform',
    'no-transform, private',
    'no-transform , max-age=1000',
    'max-age=1000 , no-transform',
  ])('should skip Cache-Control', async (headerValue) => {
    const app = new WebApp();
    app.mount(compress());
    app.mount(
      middleware.web((ctx, next) => {
        ctx.response.setHeader('Cache-Control', headerValue);
        return next();
      }),
    );
    app.mount(sendString);

    await request(app.listen())
      .get('/')
      .expect(200)
      .expect(bufferString)
      .expect('content-length', '2048')
      .expect('vary', 'Accept-Encoding')
      .expect((res) => {
        assert(!res.headers['content-encoding']);
        assert(!res.headers['transfer-encoding']);
      });
  });

  test.each(['not-no-transform', 'public', 'no-transform-thingy'])(
    'should not skip Cache-Control',
    async (headerValue) => {
      const app = new WebApp();
      app.mount(compress());
      app.mount(
        middleware.web((ctx, next) => {
          ctx.response.setHeader('Cache-Control', headerValue);
          return next();
        }),
      );
      app.mount(sendString);

      await request(app.listen())
        .get('/')
        .expect(200)
        .expect(bufferString)
        .expect('transfer-encoding', 'chunked')
        .expect('content-encoding', 'gzip')
        .expect('vary', 'Accept-Encoding')
        .expect((res) => {
          assert(!res.headers['content-length']);
        });
    },
  );
});

test('accept-encoding: deflate', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendBuffer);

  await request(app.listen())
    .get('/')
    .set('Accept-Encoding', 'deflate')
    .expect(200)
    .expect('content-encoding', 'deflate')
    .expect('vary', 'Accept-Encoding');
});

test('accept-encoding: gzip', async () => {
  const app = new WebApp();
  app.mount(compress());
  app.mount(sendBuffer);

  await request(app.listen())
    .get('/')
    .set('Accept-Encoding', 'gzip, deflate')
    .expect(200)
    .expect('vary', 'Accept-Encoding')
    .expect('content-encoding', 'gzip');
});

if (process.versions['brotli']) {
  test('accept-encoding: br', async () => {
    const app = new WebApp();
    app.mount(compress());
    app.mount(sendBuffer);

    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'br')
      .expect(200)
      .expect('vary', 'Accept-Encoding')
      .expect('content-encoding', 'br');
  });
}

test('accept-encoding: br (banned, should be gzip)', async () => {
  const app = new WebApp();
  app.mount(compress({ br: false }));
  app.mount(sendBuffer);

  await request(app.listen())
    .get('/')
    .set('Accept-Encoding', 'gzip, deflate, br')
    .expect(200)
    .expect('vary', 'Accept-Encoding')
    .expect('content-encoding', 'gzip');
});
