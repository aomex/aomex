import { createReadStream } from 'node:fs';
import request from 'supertest';
import { expect, test } from 'vitest';
import { WebApp } from '@aomex/web';
import { middleware } from '@aomex/core';
import { etag } from '../src';

test('when body is missing, should not add ETag', async () => {
  const app = new WebApp();
  app.mount(etag());

  await request(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.headers).not.toHaveProperty('etag');
    });
});

test('when ETag is exists, should not add ETag', async () => {
  const app = new WebApp();
  app.mount(etag());
  app.mount(
    middleware.web((ctx) => {
      ctx.send({ hi: 'etag' });
      ctx.response.setHeader('Etag', '"etaghaha"');
    }),
  );

  await request(app.listen())
    .get('/')
    .expect('etag', '"etaghaha"')
    .expect({ hi: 'etag' })
    .expect(200);
});

test('when body is a string, should add ETag', async () => {
  const app = new WebApp();
  app.mount(etag());
  app.mount(
    middleware.web((ctx) => {
      ctx.send('Hello World');
    }),
  );

  await request(app.listen())
    .get('/')
    .expect('ETag', '"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA"');
});

test('when body is a Buffer, should add ETag', async () => {
  const app = new WebApp();
  app.mount(etag());
  app.mount(
    middleware.web((ctx) => {
      ctx.send(Buffer.from('Hello World'));
    }),
  );

  await request(app.listen())
    .get('/')
    .expect('ETag', '"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA"');
});

test('when body is JSON, should add ETag', async () => {
  const app = new WebApp();
  app.mount(etag());
  app.mount(
    middleware.web((ctx) => {
      ctx.send({ foo: 'bar' });
    }),
  );

  await request(app.listen())
    .get('/')
    .expect('ETag', '"d-pedE0BZFQNM7HX6mFsKPL6l+dUo"');
});

test('when body is a stream with a .path, should add an ETag', async () => {
  const app = new WebApp();
  app.mount(etag());
  app.mount(
    middleware.web((ctx) => {
      ctx.send(createReadStream('package.json'));
    }),
  );

  await request(app.listen())
    .get('/')
    .expect('ETag', /^W\/.+/);
});

test('when with options, should add weak ETag', async () => {
  const app = new WebApp();
  app.mount(etag({ weak: true }));
  app.mount(
    middleware.web((ctx) => {
      ctx.send('Hello World');
    }),
  );

  await request(app.listen())
    .get('/')
    .expect('ETag', 'W/"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA"');
});
