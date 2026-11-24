import { expectType } from 'ts-expect';
import { SocketIoTransport, type SocketIoTransportOptions } from '../src';
import type { WebsocketTransportAdapter } from '@aomex/websocket';

{
  const adapter = new SocketIoTransport();
  expectType<SocketIoTransport>(adapter);
  expectType<WebsocketTransportAdapter>(adapter);
}

{
  const opts = { cors: { origin: '*' } } satisfies SocketIoTransportOptions;
  new SocketIoTransport(opts);
  // @ts-expect-error path 由 WebsocketApp 注入，不允许在适配器选项覆盖
  new SocketIoTransport({ path: '/x' });
}
