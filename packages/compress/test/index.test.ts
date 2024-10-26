import fs from 'node:fs';
import crypto from 'node:crypto';
import request from 'supertest';
import { describe, test, expect } from 'vitest';
import { compress, type CompressProps } from '../src';
import { middleware } from '@aomex/common';
import { WebApp } from '@aomex/web';
import { dirname, join } from 'node:path';

const buffer = crypto.randomBytes(1024); // 1024 B
const bufferString = buffer.toString('hex'); // 2048 B
const sendString = middleware.web((ctx) => {
  ctx.send(bufferString);
});

test('压缩字符串', async () => {
  const app = new WebApp({
    mount: [compress(), sendString],
  });

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect(bufferString)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-length');
    });
});

test('阈值以下不允许压缩字符串', async () => {
  const app = new WebApp({
    mount: [compress({ threshold: '1mb' }), sendString],
  });

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect(bufferString)
    .expect('content-length', '2048')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

test('压缩JSON', async () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web((ctx) => {
        ctx.send(jsonBody);
      }),
    ],
  });

  const jsonBody = { status: 200, message: 'ok', data: bufferString };

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-length');
      expect(res.text).toBe(JSON.stringify(jsonBody));
    });
});

test('阈值以下不允许压缩JSON', async () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web((ctx) => {
        ctx.send(jsonBody);
      }),
    ],
  });
  const jsonBody = { status: 200, message: 'ok' };

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
      expect(res.text).toBe(JSON.stringify(jsonBody));
    });
});

test('压缩Buffer', async () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web((ctx) => {
        ctx.response.contentType = 'text';
        ctx.send(buffer);
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-length');
    });
});

test('压缩数据流', async () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web((ctx) => {
        ctx.response.contentType = 'application/javascript';
        const stream = fs.createReadStream(
          join(dirname(import.meta.dirname), 'package.json'),
        );
        ctx.send(stream);
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-length');
    });
});

test('设置 ctx.compress=true 时强制压缩未达阈值的内容', async () => {
  const app = new WebApp({
    mount: [
      compress({ threshold: '1mb' }),
      middleware.web<CompressProps>((ctx) => {
        ctx.needCompress = true;
        ctx.send(bufferString);
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('transfer-encoding', 'chunked')
    .expect('content-encoding', 'gzip')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-length');
    });
});

test('设置 ctx.compress=false 时禁止压缩', async () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web<CompressProps>((ctx) => {
        ctx.needCompress = false;
        ctx.send(bufferString);
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('content-length', '2048')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

test('不压缩HEAD请求', async () => {
  const app = new WebApp({
    mount: [compress(), sendString],
  });

  await request(app.listen())
    .head('/')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

test('阈值设为0时不压缩', async () => {
  const app = new WebApp({
    mount: [compress({ threshold: 0 }), sendString],
  });

  await request(app.listen())
    .get('/')
    .set('Accept-Encoding', '')
    .expect('content-length', '2048')
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

test('图片不压缩', () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web((ctx) => {
        ctx.response.contentType = 'image/png';
        ctx.send(Buffer.alloc(2048));
      }),
    ],
  });

  return request(app.listen())
    .get('/')
    .expect(200)
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

test('已经设置了Content-Encoding则不压缩', () => {
  const app = new WebApp({
    mount: [
      compress(),
      middleware.web((ctx) => {
        ctx.response.setHeader('Content-Encoding', 'identity');
        ctx.response.contentType = 'text';
        ctx.send(bufferString);
      }),
    ],
  });

  return request(app.listen())
    .get('/')
    .expect('content-encoding', 'identity')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

describe('Cache-Control', () => {
  test.each([
    'no-transform',
    'public, no-transform',
    'no-transform, private',
    'no-transform , max-age=1000',
    'max-age=1000 , no-transform',
  ])('跳过Cache-Control', async (headerValue) => {
    const app = new WebApp({
      mount: [
        compress(),
        middleware.web((ctx, next) => {
          ctx.response.setHeader('Cache-Control', headerValue);
          return next();
        }),
        sendString,
      ],
    });

    await request(app.listen())
      .get('/')
      .expect(200)
      .expect(bufferString)
      .expect('content-length', '2048')
      .expect('vary', 'Accept-Encoding')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('content-encoding');
        expect(res.headers).not.toHaveProperty('transfer-encoding');
      });
  });

  test.each(['not-no-transform', 'public', 'no-transform-thingy'])(
    '不跳过Cache-Control',
    async (headerValue) => {
      const app = new WebApp({
        mount: [
          compress(),
          middleware.web((ctx, next) => {
            ctx.response.setHeader('Cache-Control', headerValue);
            return next();
          }),
          sendString,
        ],
      });

      await request(app.listen())
        .get('/')
        .expect(200)
        .expect(bufferString)
        .expect('transfer-encoding', 'chunked')
        .expect('content-encoding', 'gzip')
        .expect('vary', 'Accept-Encoding')
        .expect((res) => {
          expect(res.headers).not.toHaveProperty('content-length');
        });
    },
  );
});

describe('accept-encoding', () => {
  const app = new WebApp({
    mount: [compress(), sendString],
  });

  test('deflate', async () => {
    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'deflate')
      .expect(200)
      .expect('content-encoding', 'deflate')
      .expect('vary', 'Accept-Encoding');
  });

  test('gzip', async () => {
    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect(200)
      .expect('vary', 'Accept-Encoding')
      .expect('content-encoding', 'gzip');
  });

  test('br', async () => {
    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'br, gzip, deflate')
      .expect(200)
      .expect('vary', 'Accept-Encoding')
      .expect('content-encoding', 'br');
  });

  test('包含未知压缩方案', async () => {
    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'abcd, br, gzip, deflate')
      .expect(200)
      .expect('vary', 'Accept-Encoding')
      .expect('content-encoding', 'br');
  });

  test('空字符串', async () => {
    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', '')
      .expect(200)
      .expect('vary', 'Accept-Encoding')
      .expect((res) => {
        expect(res.headers).not.toHaveProperty('content-encoding');
        expect(res.headers).not.toHaveProperty('transfer-encoding');
      });
  });

  test('禁用某项压缩方案', async () => {
    const app = new WebApp({
      mount: [compress({ br: false }), sendString],
    });

    await request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'br, gzip, deflate')
      .expect(200)
      .expect('vary', 'Accept-Encoding')
      .expect('content-encoding', 'gzip');
  });
});

test('空内容不压缩', async () => {
  const app = new WebApp({
    mount: [
      compress({ br: false }),
      middleware.web((ctx) => {
        ctx.send(null);
      }),
    ],
  });
  await request(app.listen())
    .get('/')
    .expect(200)
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});

test('空状态码不压缩', async () => {
  const app = new WebApp({
    mount: [
      compress({ br: false }),
      middleware.web((ctx) => {
        ctx.send(204, bufferString);
      }),
    ],
  });
  await request(app.listen())
    .get('/')
    .expect(204)
    .expect('vary', 'Accept-Encoding')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('content-encoding');
      expect(res.headers).not.toHaveProperty('transfer-encoding');
    });
});
