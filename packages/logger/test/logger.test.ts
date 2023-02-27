import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import { createReadStream } from 'node:fs';
import stripAnsi from 'strip-ansi';
import supertest from 'supertest';
import { logger, LoggerOptions } from '../src';

let msgs: string[] = [];
const printer: NonNullable<LoggerOptions['printer']> = (message, ...args) => {
  msgs = [stripAnsi(message), ...args];
};

beforeEach(() => {
  msgs = [];
});

test('print request log', async () => {
  const app = new WebApp();
  app.mount(logger({ responseFormat: false, printer }));
  app.mount(
    middleware.web((ctx) => {
      ctx.send('hello world');
    }),
  );

  await supertest(app.listen()).get('/200').expect(200);
  expect(msgs).toStrictEqual(['  %s %s %s', '<--', 'GET', '/200']);
});

test('print response log', async () => {
  const app = new WebApp();
  app.mount(
    logger({
      responseFormat:
        '[response] [contentType] [contentLength] [statusCode] [url]',
      printer,
    }),
  );
  app.mount(
    middleware.web((ctx) => {
      ctx.send('hello world');
    }),
  );

  await supertest(app.listen()).get('/200-status').expect(200);
  expect(msgs).toStrictEqual([
    '%s %s %s %s %s',
    '-->',
    '-',
    '11b',
    '200',
    '/200-status',
  ]);
});

test('print error log', async () => {
  const app = new WebApp();
  app.mount(
    logger({
      responseFormat:
        '[response] [contentType] [contentLength] [statusCode] [url]',
      printer,
    }),
  );
  app.mount(
    middleware.web((ctx) => {
      ctx.throw(400, 'here is a bug');
    }),
  );

  await supertest(app.listen()).get('/400-status').expect(400);
  expect(msgs).toStrictEqual([
    '%s %s %s %s %s',
    'xxx',
    '-',
    '13b',
    '400',
    '/400-status',
  ]);
});

test('print stream log', async () => {
  const app = new WebApp();
  app.mount(
    logger({
      responseFormat:
        '[response] [contentType] [contentLength] [statusCode] [url]',
      printer,
    }),
  );
  app.mount(
    middleware.web((ctx) => {
      ctx.send(createReadStream('./test/mocks/file.txt'));
    }),
  );

  await supertest(app.listen()).get('/stream-response').expect(200);
  expect(msgs).toStrictEqual([
    '%s %s %s %s %s',
    '-->',
    '-',
    '108b',
    '200',
    '/stream-response',
  ]);
});

test('custom tokens', async () => {
  const app = new WebApp();
  app.mount(
    logger({
      responseFormat:
        '[response] [body] [body_next] [contentLength] [statusCode] [url]',
      printer,
      customTokens: {
        body: (ctx) => String(ctx.response.body),
        body_next: () => 'I AM BODY NEXT',
      },
    }),
  );
  app.mount(
    middleware.web((ctx) => {
      ctx.send(201, 'BODY_BODY_BODY');
    }),
  );

  await supertest(app.listen()).post('/custom-tokens').expect(201);
  expect(msgs).toStrictEqual([
    '%s %s %s %s %s %s',
    '-->',
    'BODY_BODY_BODY',
    'I AM BODY NEXT',
    '14b',
    '201',
    '/custom-tokens',
  ]);
});

test('default printer is console.log', async () => {
  const spy = vitest.spyOn(console, 'log');
  const app = new WebApp();
  app.mount(logger());
  app.mount(
    middleware.web((ctx) => {
      ctx.send('BODY_BODY_BODY');
    }),
  );

  await supertest(app.listen()).post('/').expect(200);
  expect(spy).toBeCalledTimes(2);
  spy.mockRestore();
});
