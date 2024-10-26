import { middleware } from '@aomex/common';
import { WebApp } from '@aomex/web';
import request from 'supertest';
import { serveStatic } from '../src';
import { test } from 'vitest';
import { join } from 'path';

const fixturesDir = join(import.meta.dirname, 'fixtures');

test('发送文件', async () => {
  const app = new WebApp({ mount: [serveStatic({ root: fixturesDir })] });
  await request(app.listen()).get('/hello.txt').expect(200).expect('world');
});

test('没有命中则继续往下执行中间件', async () => {
  const app = new WebApp({
    mount: [
      serveStatic({ root: fixturesDir }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo-bar');
      }),
    ],
  });
  await request(app.listen()).get('/something.txt').expect(200, 'foo-bar');
});

test('只接受 `GET` 或者 `HEAD` 方法', async () => {
  const app = new WebApp({
    mount: [serveStatic({ root: fixturesDir })],
  });
  await request(app.listen()).post('/hello.txt').expect(404);
});
