import { TestWebApp } from '../../web/src/testing';
import { createReadStream } from 'node:fs';
import request from 'supertest';
import { expect, test } from 'vitest';
import { middleware } from '@aomex/common';
import { etag } from '../src';
import { join } from 'node:path';
test('没有响应内容时不设置etag', async () => {
  const app = new TestWebApp({
    mount: [etag()],
  });

  await request(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('etag');
    });
});

test('已经包含etag报文时，不再重新设置etag', async () => {
  const app = new TestWebApp({
    mount: [
      etag(),
      middleware.web((ctx) => {
        ctx.send({ hi: 'etag' });
        ctx.response.setHeader('ETag', '"foo"');
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect('etag', '"foo"')
    .expect({ hi: 'etag' })
    .expect(200);
});

test('响应字符串时，添加etag报文', async () => {
  const app = new TestWebApp({
    mount: [
      etag(),
      middleware.web((ctx) => {
        ctx.send('Hello World');
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect('ETag', '"b~pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4"');
});

test('响应Buffer时，添加etag报文', async () => {
  const app = new TestWebApp({
    mount: [
      etag(),
      middleware.web((ctx) => {
        ctx.send(Buffer.from('Hello World'));
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect('ETag', '"b~pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4"');
});

test('响应JSON时，添加etag报文', async () => {
  const app = new TestWebApp({
    mount: [
      etag(),
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect('ETag', '"d~eji_gfOD9pQzrW6QDTWz4jhVk_dqe3q11DVbi6Qe4ks"');
});

test('带path的数据流时，添加etag报文，并携带W/', async () => {
  const app = new TestWebApp({
    mount: [
      etag(),
      middleware.web((ctx) => {
        ctx.send(createReadStream(join(import.meta.dirname, 'fixture', 'a.txt')));
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    // etag的值与文件的生成时间关联，因此无法得到固定的值
    .expect('ETag', /^W\/"[0-9a-v]+~[0-9a-v]+"$/);
});

test('手动开启携带W/', async () => {
  const app = new TestWebApp({
    mount: [
      etag({ weak: true }),
      middleware.web((ctx) => {
        ctx.send('Hello World');
      }),
    ],
  });

  await request(app.listen())
    .get('/')
    .expect('ETag', 'W/"b~pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4"');
});
