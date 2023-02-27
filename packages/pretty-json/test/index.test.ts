import { Readable } from 'node:stream';
import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { prettyJson } from '../src';

describe('pretty', () => {
  test('should default to true', async () => {
    const app = new WebApp();
    app.mount(prettyJson());
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    );

    await request(app.listen()).get('/').expect('{\n  "foo": "bar"\n}');
  });

  test('should ok', async () => {
    const app = new WebApp();
    app.mount(prettyJson());
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: null, bar: undefined });
      }),
    );

    await request(app.listen()).get('/').expect('{\n  "foo": null\n}');
  });

  test('should retain content-type', async () => {
    const app = new WebApp();
    app.mount(prettyJson());
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    );

    await request(app.listen())
      .get('/')
      .expect('Content-Type', /application\/json/);
  });

  test('should pass through when false', async () => {
    const app = new WebApp();
    app.mount(prettyJson({ enable: false }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    );

    await request(app.listen()).get('/').expect('{"foo":"bar"}');
  });

  test('should allow custom spaces', async () => {
    const app = new WebApp();
    app.mount(prettyJson({ enable: true, spaces: 4 }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    );

    await request(app.listen()).get('/').expect('{\n    "foo": "bar"\n}');
  });
});

describe('streams', () => {
  test('should not do anything binary streams', async () => {
    const app = new WebApp();
    app.mount(prettyJson());
    app.mount(
      middleware.web((ctx) => {
        const stream = new Readable();
        ctx.send(stream);
        stream.push('lol');
        stream.push(null);
      }),
    );

    await request(app.listen())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.toString()).toBe('lol');
      });
  });

  test('pretty=false时不处理', async () => {
    const app = new WebApp();
    app.mount(prettyJson({ enable: false }));
    app.mount(
      middleware.web((ctx) => {
        const stream = new Readable({ objectMode: true });
        ctx.send(stream);
        stream.push(JSON.stringify({ message: '1' }));
        stream.push(JSON.stringify({ message: '2' }));
        stream.push(null);
      }),
    );

    await request(app.listen())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Buffer);
        expect(res.body.toString()).toBe('{"message":"1"}{"message":"2"}');
      });
  });

  test('should prettify object streams', async () => {
    const app = new WebApp();
    app.mount(prettyJson());
    app.mount(
      middleware.web((ctx) => {
        const stream = new Readable({ objectMode: true });
        ctx.send(stream);
        stream.push({ message: '1' });
        stream.push({ message: '2' });
        stream.push(null);
      }),
    );

    await request(app.listen())
      .get('/')
      .expect('Content-Type', /application\/json/)
      .expect(200, [{ message: '1' }, { message: '2' }])
      .expect((res) => {
        expect(res.text).toContain('{\n  "message": "1"\n}');
        expect(res.text).toContain('{\n  "message": "2"\n}');
      });
  });
});

describe('param', () => {
  test('should default to being disabled', async () => {
    const app = new WebApp();
    app.mount(prettyJson({ enable: false }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    );

    await request(app.listen()).get('/?pretty').expect('{"foo":"bar"}');
  });

  test('should pretty-print when present', async () => {
    const app = new WebApp();
    app.mount(prettyJson({ enable: false, param: 'pretty' }));
    app.mount(
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    );

    await request(app.listen()).get('/?pretty').expect('{\n  "foo": "bar"\n}');
  });
});
