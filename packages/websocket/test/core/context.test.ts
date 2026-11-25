import { expect, test } from 'vitest';
import { Logger } from '@aomex/logger';
import type { BaseWebRequest } from '@aomex/web';
import type { WebsocketTransport } from '../../src';
import { WebsocketAll, WebsocketClient, WebsocketContext, WebsocketHub } from '../../src';

const fakeTransport = (id: string): WebsocketTransport => ({
  id,
  request: {} as BaseWebRequest,
  send: async () => {},
  close: async () => {},
  onMessage() {},
  onClose() {},
});

test('WebsocketContext.logger 为构造时传入的实例', () => {
  const logger = new Logger({ transports: [] });
  const hub = new WebsocketHub();
  hub.bindLogger(logger);
  const client = new WebsocketClient(fakeTransport('c1'), hub, 'zh-CN');
  const ctx = new WebsocketContext(
    'ping',
    client,
    new WebsocketAll(hub),
    (name) => hub.room(name),
    { n: 1 },
    logger,
  );

  expect(ctx.logger).toBe(logger);
  expect(ctx.logger).toBeInstanceOf(Logger);
  expect(ctx.event).toBe('ping');
  expect(ctx.rawPayload).toEqual({ n: 1 });
});
