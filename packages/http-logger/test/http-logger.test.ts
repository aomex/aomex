import { middleware } from '@aomex/common';
import { Logger, LoggerTransport } from '@aomex/logger';
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
import sleep from 'sleep-promise';

let msgs: string[] = [];

class MockTransport extends LoggerTransport {
  override async consume(message: Logger.Log): Promise<any> {
    msgs.push(
      `[${message.level}] ${this.dateToString(new Date(message.timestamp))} ${stripVTControlCharacters(message.text)}`,
    );
  }
}

const t = new MockTransport();
const transports = [t];
{
  const originConsume = t.consume.bind(t);
  vitest.spyOn(t, 'consume').mockImplementation(async (message) => {
    message.timestamp = new Date('2024-06-04 11:23:12');
    return originConsume(message);
  });
}

let spy: MockInstance;

beforeAll(() => {
  spy = vitest.spyOn(process, 'hrtime').mockImplementation(() => [1, 2]);
});

beforeEach(() => {
  msgs = [];
});

afterAll(() => {
  spy.mockRestore();
});

test('打印日志', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ transports }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo bar');
      }),
    ],
  });

  await supertest(app.listen()).get('/api');
  await sleep(100);
  expect(msgs).toMatchInlineSnapshot(`
  [
    "[http] 2024-06-04 11:23:12 ::ffff:127.0.0.1 GET /api 200 1s 7b",
  ]
  `);
});

test('打印错误日志', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ transports }),
      middleware.web((ctx) => {
        ctx.throw(400, 'bad request');
      }),
    ],
  });

  await supertest(app.listen()).get('/api');
  await sleep(100);
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[http] 2024-06-04 11:23:12 ::ffff:127.0.0.1 GET /api 400 1s 11b",
    ]
  `);
});

test('数据流也能获取长度', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({ transports }),
      middleware.web((ctx) => {
        ctx.send(createReadStream(join(import.meta.dirname, 'fixture', 'file.txt')));
      }),
    ],
  });

  await supertest(app.listen()).get('/api');
  await sleep(100);
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[http] 2024-06-04 11:23:12 ::ffff:127.0.0.1 GET /api 200 1s 108b",
    ]
  `);
});

test('自定义令牌', async () => {
  const app = new WebApp({
    mount: [
      httpLogger({
        format: '[method] [foo] [bar] [baz]',
        customTokens: {
          foo: () => 'ifooo',
          baz: async () => 'bazzz',
        },
        transports,
      }),
      middleware.web((ctx) => {
        ctx.send(200, 'foo bar');
      }),
    ],
  });

  await supertest(app.listen()).get('/api');
  await sleep(100);
  expect(msgs).toMatchInlineSnapshot(`
    [
      "[http] 2024-06-04 11:23:12 GET ifooo [bar] bazzz",
    ]
  `);
});
