import { expectType } from 'ts-expect';
import { WsTransport, type WsTransportOptions } from '../src';

{
  const opts = {
    perMessageDeflate: false,
    clientTracking: true,
    heartbeatInterval: 0,
  } satisfies WsTransportOptions;
  new WsTransport(opts);
  new WsTransport();

  // @ts-expect-error path 由 WebsocketApp 注入
  const badPath: WsTransportOptions = { path: '/ws' };
  void badPath;
  // @ts-expect-error maxPayload 由 WebsocketApp 注入
  const badPayload: WsTransportOptions = { maxPayload: 1 };
  void badPayload;
  // @ts-expect-error verifyClient 由 WebsocketApp 的 verify 注入
  const badVerify: WsTransportOptions = { verifyClient: () => true };
  void badVerify;

  expectType<number | undefined>(opts.heartbeatInterval);
}
