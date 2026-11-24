import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import type http from 'node:http';
import { TestWebApp } from '../../../web/src/testing';
import {
  WebsocketApp,
  channels,
  type WebsocketAppOptions,
  type Channel,
} from '../../src';
import { TestWebsocketApp } from '../../src/testing';
import type { GlobPathOptions } from '@aomex/internal-file-import';
// 测试专用相对引用，避免 @aomex/websocket ↔ ws-adapter 成环
import {
  WsTransport,
  type WsTransportOptions,
} from '../../../websocket-ws-transport/src';

export const closeServer = async (slot: { server?: http.Server }) => {
  if (!slot.server) return;
  await new Promise<void>((resolve, reject) => {
    slot.server!.close((err) => (err ? reject(err) : resolve()));
  });
  slot.server = undefined;
};

export const connect = async (
  port: number,
  path = '/ws',
): Promise<globalThis.WebSocket> => {
  const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await once(ws, 'open');
  return ws;
};

export const send = (ws: globalThis.WebSocket, event: string, data?: unknown) => {
  ws.send(JSON.stringify({ event, data }));
};

export const recv = async (ws: globalThis.WebSocket) => {
  const [raw] = await once(ws, 'message');
  const data = raw instanceof MessageEvent ? raw.data : raw;
  const text =
    typeof data === 'string'
      ? data
      : Buffer.isBuffer(data)
        ? data.toString('utf8')
        : new TextDecoder().decode(data as ArrayBuffer);
  return JSON.parse(text) as { event: string; data: unknown };
};

type ListenOptions = Omit<
  WebsocketAppOptions,
  'transport' | 'mount' | 'logger' | 'language'
> &
  Partial<Pick<WebsocketAppOptions, 'transport' | 'mount' | 'language'>> & {
    /** 快捷：自动包一层 `channels(...)` 接到 mount 末尾 */
    channels?: GlobPathOptions | Channel[];
  };

/**
 * 测试用：`http()` → `attach` → `listen(0)`。
 * 传 `channels` 时自动 `mount: [...mount, channels(...)]`。
 */
export const listenWebsocket = async (
  app: TestWebApp,
  options: ListenOptions,
  slot: { server?: http.Server },
  wsOptions: WsTransportOptions = { heartbeatInterval: 0 },
): Promise<{ port: number; ws: WebsocketApp; server: http.Server }> => {
  const { channels: channelSource, mount = [], transport, language, ...rest } = options;
  const server = app.http({});
  const ws = new TestWebsocketApp({
    ...rest,
    language,
    logger: app['logger'],
    transport: transport ?? new WsTransport(wsOptions),
    mount: [...mount, ...(channelSource !== undefined ? [channels(channelSource)] : [])],
  });
  ws.attach(app, server);
  slot.server = server.listen(0) as http.Server;
  const port = (slot.server.address() as AddressInfo).port;
  return { port, ws, server };
};
