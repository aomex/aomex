import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import request from 'supertest';
import { send } from '../src';
import { describe, test } from 'vitest';
import { join } from 'path';

const fixturesDir = join(import.meta.dirname, 'fixtures');

test('找到文件则发送文件', async () => {
  const app = new WebApp({
    mount: [middleware.web((ctx) => send(ctx, { root: fixturesDir }))],
  });
  await request(app.listen()).get('/hello.txt').expect(200).expect('world');
});

describe('indexFile', () => {
  test('设置后则要自动加上', async () => {
    const app = new WebApp({
      mount: [
        middleware.web((ctx) => send(ctx, { root: fixturesDir, indexFile: 'index.txt' })),
      ],
    });

    await request(app.listen())
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('text index');
  });

  test('不设置则使用默认的 index.html', async () => {
    const app = new WebApp({
      mount: [middleware.web((ctx) => send(ctx, { root: fixturesDir }))],
    });
    await request(app.listen())
      .get('/world/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('html index');
  });

  test('禁用则不补全 index.html', async () => {
    const app = new WebApp({
      mount: [
        middleware.web((ctx) => send(ctx, { root: fixturesDir, indexFile: false })),
      ],
    });

    await request(app.listen()).get('/world/').expect(404);
  });
});

test('.dot文件直接返回 404', async () => {
  const app = new WebApp({
    mount: [middleware.web((ctx) => send(ctx, { root: fixturesDir }))],
  });
  await request(app.listen()).get('/.df.txt').expect(404);
});

test('没有后缀则直接使用 content-type=text', async () => {
  const app = new WebApp({
    mount: [middleware.web((ctx) => send(ctx, { root: fixturesDir }))],
  });
  await request(app.listen())
    .get('/no-ext')
    .expect(200, 'no-extension')
    .expect('Content-Type', 'text/plain; charset=utf-8');
});

describe('Cache-Control', () => {
  test('默认配置', async () => {
    const app = new WebApp({
      mount: [
        middleware.web((ctx) => send(ctx, { root: fixturesDir, cacheControl: {} })),
      ],
    });

    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'public, max-age=0');
  });

  test('private', async () => {
    const app = new WebApp({
      mount: [
        middleware.web((ctx) =>
          send(ctx, { root: fixturesDir, cacheControl: { publicOrPrivate: 'private' } }),
        ),
      ],
    });
    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'private, max-age=0');
  });

  test('maxAge', async () => {
    const app = new WebApp({
      mount: [
        middleware.web((ctx) =>
          send(ctx, { root: fixturesDir, cacheControl: { maxAge: 221_000 } }),
        ),
      ],
    });

    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'public, max-age=221');
  });

  test('immutable', async () => {
    const app = new WebApp({
      mount: [
        middleware.web((ctx) =>
          send(ctx, { root: fixturesDir, cacheControl: { immutable: true } }),
        ),
      ],
    });
    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'public, max-age=0, immutable');
  });
});

test('root之外的文件无法获取', async () => {
  const app = new WebApp({
    mount: [middleware.web((ctx) => send(ctx, { root: fixturesDir }))],
  });
  await request(app.listen()).get('/README.md').expect(404);
});

test('不能通过..到root上一级获取', async () => {
  const app = new WebApp({
    mount: [middleware.web((ctx) => send(ctx, { root: fixturesDir }))],
  });
  await request(app.listen()).get('/../send.test.ts').expect(404);
});
