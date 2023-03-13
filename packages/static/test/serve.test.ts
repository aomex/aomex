import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import request from 'supertest';
import { serve } from '../src';

describe('when defer=false', () => {
  test('when path is valid, should send the file', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures' }));
    await request(app.listen()).get('/hello.txt').expect(200).expect('world');
  });

  test('should pass to downstream if 404', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures', index: false }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send(200, 'oh no');
      }),
    );
    await request(app.listen()).get('/something.txt').expect(200, 'oh no');
  });

  test('should throw error when status != 404', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures' }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send(200, 'oh no');
      }),
    );
    await request(app.listen()).get('/../dotfile').expect(403);
  });

  test('when method is not `GET` or `HEAD`, should 404', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures' }));
    await request(app.listen()).post('/hello.txt').expect(404);
  });
});

describe('when defer=true', () => {
  test('when path is valid, should send the file', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures', defer: true }));
    await request(app.listen()).get('/hello.txt').expect(200).expect('world');
  });

  test('when upstream middleware responds, should do nothing', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures', defer: true }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send('hey');
      }),
    );
    await request(app.listen()).get('/hello.txt').expect(200, 'hey');
  });

  describe('should not handle the request', () => {
    test('when status=204', async () => {
      const app = new WebApp();
      app.mount(serve({ root: 'test/fixtures', defer: true }));
      app.mount(
        middleware.web((ctx) => {
          ctx.send(204);
        }),
      );
      await request(app.listen()).get('/something%%%/').expect(204);
    });

    test('when body=""', async () => {
      const app = new WebApp();
      app.mount(serve({ root: 'test/fixtures', defer: true }));
      app.mount(
        middleware.web((ctx) => {
          ctx.send('');
        }),
      );
      await request(app.listen()).get('/something%%%/').expect(200);
    });
  });

  test('when method is not `GET` or `HEAD`, should 404', async () => {
    const app = new WebApp();
    app.mount(serve({ root: 'test/fixtures', defer: true }));
    await request(app.listen()).post('/hello.txt').expect(404);
  });
});
