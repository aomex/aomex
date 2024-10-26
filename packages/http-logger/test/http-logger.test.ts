import { middleware } from '@aomex/common';
import { WebApp } from '@aomex/web';
import { stripVTControlCharacters } from 'node:util';
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  test,
  vitest,
  type MockInstance,
} from 'vitest';
import { httpLogger } from '../src';
import supertest from 'supertest';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

let msgs: string[] = [];
const printer = (message: string) => {
  msgs.push(stripVTControlCharacters(message));
};

let spy: MockInstance;

beforeAll(() => {
  spy = vitest.spyOn(Date, 'now').mockImplementation(() => 1717471392001);
});

afterAll(() => {
  spy.mockRestore();
});

beforeEach(() => {
  msgs = [];
});

test('只打印请求日志', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ responseFormat: false, printer }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo bar');
      }),
    ],
  });
  await supertest(app.listen()).get('/api');
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[2024-06-04 11:23:12] <-- ::ffff:127.0.0.1 GET /api",
    ]
  `);
});

test('只打印响应日志', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ requestFormat: false, printer }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo bar');
      }),
    ],
  });
  const spy = vitest
    .spyOn(process, 'hrtime')
    .mockImplementationOnce(() => [1, 2])
    .mockImplementationOnce(() => [0, 20000]);

  await supertest(app.listen()).get('/api');
  expect(msgs).toMatchInlineSnapshot(`
  [
    "[2024-06-04 11:23:12] --> ::ffff:127.0.0.1 GET /api 200 20μs 7b",
  ]
  `);
  spy.mockRestore();
});

test('打印请求和响应日志', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ printer }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo bar');
      }),
    ],
  });
  const spy = vitest
    .spyOn(process, 'hrtime')
    .mockImplementationOnce(() => [1, 2])
    .mockImplementationOnce(() => [0, 20000]);

  await supertest(app.listen()).get('/api');
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[2024-06-04 11:23:12] <-- ::ffff:127.0.0.1 GET /api",
      "[2024-06-04 11:23:12] --> ::ffff:127.0.0.1 GET /api 200 20μs 7b",
    ]
  `);
  spy.mockRestore();
});

test('打印错误日志', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ printer }),
      middleware.web((ctx) => {
        ctx.throw(400, 'bad request');
      }),
    ],
  });
  const spy = vitest
    .spyOn(process, 'hrtime')
    .mockImplementationOnce(() => [1, 2])
    .mockImplementationOnce(() => [0, 20000]);

  await supertest(app.listen()).get('/api');
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[2024-06-04 11:23:12] <-- ::ffff:127.0.0.1 GET /api",
      "[2024-06-04 11:23:12] xxx ::ffff:127.0.0.1 GET /api 400 20μs 11b",
    ]
  `);
  spy.mockRestore();
});

test('数据流也能获取长度', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ printer }),
      middleware.web((ctx) => {
        ctx.send(createReadStream(join(import.meta.dirname, 'fixture', 'file.txt')));
      }),
    ],
  });
  const spy = vitest
    .spyOn(process, 'hrtime')
    .mockImplementationOnce(() => [1, 2])
    .mockImplementationOnce(() => [0, 20000]);

  await supertest(app.listen()).get('/api');
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[2024-06-04 11:23:12] <-- ::ffff:127.0.0.1 GET /api",
      "[2024-06-04 11:23:12] --> ::ffff:127.0.0.1 GET /api 200 20μs 108b",
    ]
  `);
  spy.mockRestore();
});

test('自定义令牌', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({
        requestFormat: '[method] [foo] [bar] [baz]',
        responseFormat: '[foo]   [method]',
        customTokens: {
          foo: () => 'ifooo',
          baz: async () => 'bazzz',
        },
        printer,
      }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo bar');
      }),
    ],
  });

  await supertest(app.listen()).get('/api');
  expect(msgs).toMatchInlineSnapshot(`
    [
      "GET ifooo [bar] bazzz",
      "ifooo   GET",
    ]
  `);
});
