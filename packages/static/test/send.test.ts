import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import { readFileSync } from 'fs';
import request from 'supertest';
import { send } from '../src';

test('when root is not set, should serve from cwd', async () => {
  const app = new WebApp();
  app.mount(middleware.web((ctx) => send(ctx, {})));
  await request(app.listen())
    .get('/package.json')
    .expect(readFileSync('./package.json', 'utf8'));
});

test('when root = ".", should serve from cwd', async () => {
  const app = new WebApp();
  app.mount(middleware.web((ctx) => send(ctx, { root: '.' })));
  await request(app.listen())
    .get('/package.json')
    .expect(readFileSync('./package.json', 'utf8'));
});

test('when path is not a file, should 404', async () => {
  const app = new WebApp();
  app.mount(middleware.web((ctx) => send(ctx, { root: 'test/fixtures' })));
  await request(app.listen()).get('/something').expect(404);
});

test('the path is valid, should send the file', async () => {
  const app = new WebApp();
  app.mount(middleware.web((ctx) => send(ctx, { root: 'test/fixtures' })));
  await request(app.listen()).get('/hello.txt').expect(200).expect('world');
});

test('when matched up path, should 403', async () => {
  const app = new WebApp();
  app.mount(middleware.web((ctx) => send(ctx, { root: 'test/fixtures' })));
  await request(app.listen()).get('/../../package.json').expect(403);
  await request(app.listen()).get('/world/../hello.txt').expect(403);
});

describe('index', () => {
  test('when present, should alter the index file supported', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, { root: 'test/fixtures', index: 'index.txt' }),
      ),
    );
    await request(app.listen())
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('text index');
  });

  test('when omitted, should use index.html', async () => {
    const app = new WebApp();
    app.mount(middleware.web((ctx) => send(ctx, { root: 'test/fixtures' })));
    await request(app.listen())
      .get('/world/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('html index\n');
  });

  describe('when disabled', () => {
    test('should not use index.html', async () => {
      const app = new WebApp();
      app.mount(
        middleware.web((ctx) =>
          send(ctx, { root: 'test/fixtures', index: false }),
        ),
      );
      await request(app.listen()).get('/world/').expect(404);
    });
  });
});

describe('dot file', () => {
  test('when allow, should send file', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, { root: 'test/fixtures', dotFiles: 'allow' }),
      ),
    );
    await request(app.listen()).get('/.df.txt').expect(200, 'dot-file');
  });

  test('when deny, should 403', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, { root: 'test/fixtures', dotFiles: 'deny' }),
      ),
    );
    await request(app.listen()).get('/.df.txt').expect(403);
  });

  test('when ignore, should 404', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, { root: 'test/fixtures', dotFiles: 'ignore' }),
      ),
    );
    await request(app.listen()).get('/.df.txt').expect(404);
  });
});

test('set content-type=text without extension', async () => {
  const app = new WebApp();
  app.mount(middleware.web((ctx) => send(ctx, { root: 'test/fixtures' })));
  await request(app.listen())
    .get('/no-ext')
    .expect(200, 'no-extension')
    .expect('Content-Type', 'text/plain; charset=utf-8');
});

describe('Cache-Control', () => {
  test.each([true, {}, undefined])('default setting', async (value) => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, {
          root: 'test/fixtures',
          headers: {
            cacheControl: value,
          },
        }),
      ),
    );
    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'public, max-age=0');
  });

  test('private', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, {
          root: 'test/fixtures',
          headers: {
            cacheControl: {
              share: false,
            },
          },
        }),
      ),
    );
    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'private, max-age=0');
  });

  test('maxAge', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, {
          root: 'test/fixtures',
          headers: {
            cacheControl: {
              maxAge: 221000,
            },
          },
        }),
      ),
    );
    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'public, max-age=221');
  });

  test('immutable', async () => {
    const app = new WebApp();
    app.mount(
      middleware.web((ctx) =>
        send(ctx, {
          root: 'test/fixtures',
          headers: {
            cacheControl: {
              immutable: true,
            },
          },
        }),
      ),
    );
    await request(app.listen())
      .get('/hello.txt')
      .expect('Cache-Control', 'public, max-age=0, immutable');
  });
});
