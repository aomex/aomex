import type http from 'node:http';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vitest } from 'vitest';
import sleep from 'sleep-promise';
import { Channel, type WebsocketContext } from '@aomex/websocket';
import { Transport, type LogRecord } from '@aomex/logger';
import { stripVTControlCharacters } from 'node:util';
import { TestWebApp } from '../../web/src/testing';
import {
  closeServer,
  connect,
  listenWebsocket,
  recv,
  send,
} from '../../websocket/test/fixture/ws-helpers';
import {
  websocketAccessLog,
  WebsocketAccessLogToken,
  type WebsocketAccessLogOptions,
} from '../src/websocket';

let msgs: string[] = [];

class MockTransport extends Transport {
  override async consume(message: LogRecord): Promise<any> {
    msgs.push(
      `[${message.level}] ${this.dateToString(new Date(message.timestamp))} ${stripVTControlCharacters(message.message)}`,
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

const slot: { server?: http.Server } = {};
let hrtimeSpy: ReturnType<typeof vitest.spyOn>;

beforeAll(() => {
  hrtimeSpy = vitest.spyOn(process, 'hrtime').mockImplementation(() => [1, 2]);
});

beforeEach(() => {
  msgs = [];
});

afterEach(async () => {
  await closeServer(slot);
});

afterAll(() => {
  hrtimeSpy.mockRestore();
});

const fakeCtx = (options: { id?: string; ip?: string; event?: string } = {}) => {
  return {
    event: options.event ?? 'ping',
    client: {
      id: options.id ?? 'c1',
      request: { ip: options.ip ?? '203.0.113.1' },
      data: {},
      send: async () => {},
    },
  } as unknown as WebsocketContext;
};

const run = async (options: WebsocketAccessLogOptions, ctx: WebsocketContext) => {
  let called = false;
  await websocketAccessLog(options)['fn'](ctx, async () => {
    called = true;
  });
  return called;
};

test('打印入站日志', async () => {
  await expect(run({ transports }, fakeCtx())).resolves.toBe(true);
  await sleep(100);
  expect(msgs).toEqual(['[info] 2024-06-04 11:23:12 203.0.113.1 c1 ping 1s']);
});

test('没有 IP 时记为 -', async () => {
  await run({ transports }, fakeCtx({ ip: '' }));
  await sleep(100);
  expect(msgs).toEqual(['[info] 2024-06-04 11:23:12 - c1 ping 1s']);
});

test('下游抛错仍记日志并冒泡', async () => {
  await expect(
    websocketAccessLog({ transports })['fn'](fakeCtx(), async () => {
      throw new Error('boom');
    }),
  ).rejects.toThrow('boom');
  await sleep(100);
  expect(msgs).toEqual(['[info] 2024-06-04 11:23:12 203.0.113.1 c1 ping 1s']);
});

test('customTokens 抛错不掩盖业务异常', async () => {
  await expect(
    websocketAccessLog({
      transports,
      customTokens: {
        room: () => {
          throw new Error('token-fail');
        },
      },
      format: `${WebsocketAccessLogToken.event} [room]`,
    })['fn'](fakeCtx(), async () => {
      throw new Error('boom');
    }),
  ).rejects.toThrow('boom');
  await sleep(100);
  expect(msgs).toEqual([]);
});

test('customTokens 抛错不影响 next 成功返回', async () => {
  await expect(
    run(
      {
        transports,
        customTokens: {
          room: () => {
            throw new Error('token-fail');
          },
        },
        format: `${WebsocketAccessLogToken.event} [room]`,
      },
      fakeCtx(),
    ),
  ).resolves.toBe(true);
  await sleep(100);
  expect(msgs).toEqual([]);
});

test('自定义令牌', async () => {
  await run(
    {
      transports,
      format: `${WebsocketAccessLogToken.event} [room]`,
      customTokens: {
        room: (ctx) => String(ctx.client.data['room'] ?? 'lobby'),
      },
    },
    fakeCtx({ event: 'chat.send' }),
  );
  await sleep(100);
  expect(msgs).toEqual(['[info] 2024-06-04 11:23:12 chat.send lobby']);
});

test('禁用日志', async () => {
  await run({ disabled: true, transports }, fakeCtx());
  await sleep(100);
  expect(msgs).toEqual([]);
});

test('空 transports 相当于禁用日志', async () => {
  await run({ transports: [] }, fakeCtx());
  await sleep(100);
  expect(msgs).toEqual([]);
});

test('真实连接会打日志', async () => {
  const channel = new Channel();
  channel.on('ping', {
    action: async (ctx) => {
      ctx.client.send('pong');
    },
  });
  const { port } = await listenWebsocket(
    new TestWebApp(),
    {
      mount: [websocketAccessLog({ transports })],
      channels: [channel],
    },
    slot,
  );
  const ws = await connect(port);
  send(ws, 'ping');
  await expect(recv(ws)).resolves.toMatchObject({ event: 'pong' });
  await sleep(100);
  expect(msgs.some((line) => line.includes(' ping '))).toBe(true);
  ws.close();
});
