import type http from 'node:http';
import type https from 'node:https';
import { WebSocketServer, type ServerOptions, type WebSocket } from 'ws';
import type { I18nLanguage } from '@aomex/common';
import type { BaseWebRequest } from '@aomex/web';
import {
  WebsocketTransportAdapter,
  type WebsocketTransportListenContext,
  type WebsocketTransport,
} from '@aomex/websocket';
import { i18n } from './i18n';

const MAX_EVENT_NAME_LENGTH = 128;
/** 对齐 `ws` README 心跳示例 */
const DEFAULT_HEARTBEAT_INTERVAL = 30_000;
/** WebSocket close reason 上限（RFC） */
const MAX_CLOSE_REASON_BYTES = 123;

type TrackedSocket = WebSocket & { isAlive?: boolean };

/**
 * 传给 `ws` `WebSocketServer` 的选项（`path` / `maxPayload` / `server` / `verifyClient` 等由传输层注入，勿在此重复）。
 *
 * ```ts
 * new WsTransport({
 *   perMessageDeflate: false,
 *   clientTracking: true,
 *   heartbeatInterval: 0, // 测试时可关
 * });
 * ```
 */
export type WsTransportOptions = Omit<
  ServerOptions,
  'path' | 'maxPayload' | 'server' | 'port' | 'host' | 'noServer' | 'verifyClient'
> & {
  /**
   * 心跳间隔（毫秒）。默认 `30_000`；`0` 关闭。
   */
  heartbeatInterval?: number;
};

/**
 * 用标准 WebSocket（`ws`）作为 `@aomex/websocket` 的传输层。
 *
 * - 帧约定：JSON `{ event, data }`
 * - 内置：`error` 监听、心跳 ping/pong、可选 `verify`
 * - 可通过构造参数透传 `ws` 的 `ServerOptions`（如 `perMessageDeflate`）
 * - `WebApp.onShutdown`（经 `WebsocketApp.attach`）调用 `shutdown()`：按 1001 关连并 `wss.close()`；`onDestroy` 幂等收尾
 *
 * ```ts
 * import { WebsocketApp, channels } from '@aomex/websocket';
 * import { WsTransport } from '@aomex/websocket-ws-transport';
 *
 * const ws = new WebsocketApp({
 *   logger: services.logger,
 *   language: { mode: 'fixed', language: 'zh-CN' },
 *   path: '/ws',
 *   transport: new WsTransport({
 *     perMessageDeflate: false,
 *     heartbeatInterval: 30_000,
 *   }),
 *   mount: [channels('./src/channels')],
 * });
 * const server = web.http({});
 * ws.attach(web, server);
 * server.listen(3000);
 * ```
 *
 * 浏览器：
 *
 * ```ts
 * const ws = new WebSocket('ws://localhost:3000/ws');
 * ws.send(JSON.stringify({ event: 'chat.send', data: { text: 'hi' } }));
 * ```
 */
export class WsTransport extends WebsocketTransportAdapter {
  protected wss?: WebSocketServer;

  /**
   * @param options `ws` 服务端选项 + `heartbeatInterval`（不含 path / maxPayload / server / verifyClient）
   */
  constructor(protected readonly options: WsTransportOptions = {}) {
    super();
  }

  /** 资源在 {@link listen} 时创建，此处无操作 */
  override onInit(): void {}

  /**
   * 挂到 `server` 的 upgrade；由 `WebsocketApp.attach` 调用。
   * 握手经 {@link beforeHandshake} 等待传输就绪。
   */
  override listen(
    server: http.Server | https.Server,
    context: WebsocketTransportListenContext,
  ): void {
    if (this.wss) return;

    const { heartbeatInterval: heartbeatOption, ...serverOptions } = this.options;
    const heartbeatInterval = resolveHeartbeatInterval(heartbeatOption);
    const wss = new WebSocketServer({
      ...serverOptions,
      server,
      path: context.path,
      maxPayload: context.maxPayload,
      // 始终走 beforeHandshake：无业务 verify 时也等 ensureReady
      verifyClient: (info, callback) => {
        void this.beforeHandshake(context, info.req)
          .then((denied) => {
            if (!denied) {
              callback(true);
              return;
            }
            callback(false, denied.statusCode, denied.message);
          })
          .catch((err: unknown) => {
            void this.failHandshake(context, info.req, err).then(() => {
              callback(false, 500, 'Forbidden');
            });
          });
      },
    });
    this.wss = wss;

    wss.on('connection', (socket, request) => {
      const tracked = socket as TrackedSocket;
      tracked.isAlive = true;
      tracked.on('error', () => {
        // 必须监听，否则半开/协议错误会变成未捕获异常（ws README）
      });
      tracked.on('pong', () => {
        tracked.isAlive = true;
      });
      this.acceptConnection(context, request, (req) =>
        this.createTransport(tracked, req, context.resolveLanguage?.(req) ?? 'zh-CN'),
      );
    });

    if (heartbeatInterval > 0) {
      const timer = setInterval(() => {
        for (const client of wss.clients) {
          const tracked = client as TrackedSocket;
          if (tracked.isAlive === false) {
            tracked.terminate();
            continue;
          }
          tracked.isAlive = false;
          tracked.ping();
        }
      }, heartbeatInterval);
      timer.unref?.();
      wss.on('close', () => clearInterval(timer));
    }
  }

  /**
   * 关停前半：对存量连接发 `1001 Going Away`，再优雅关闭 `WebSocketServer`。
   */
  override async onShutdown(): Promise<void> {
    await this.closeWebSocketServer(1001, 'Going Away');
  }

  /**
   * 关闭 `WebSocketServer`（幂等）；若 `onShutdown` 已关过则为空操作。
   */
  override async onDestroy(): Promise<void> {
    await this.closeWebSocketServer();
  }

  /**
   * 关闭底层 `wss`：可选先对客户端 `close(code, reason)`，再 `wss.close()`。
   */
  protected async closeWebSocketServer(code?: number, reason?: string): Promise<void> {
    const wss = this.wss;
    if (!wss) return;
    this.wss = undefined;
    if (code !== undefined) {
      const closeReason = reason ? truncateCloseReason(reason) : undefined;
      for (const client of wss.clients) {
        client.close(code, closeReason);
      }
    }
    await new Promise<void>((resolve, reject) => {
      wss.close((err) => (err ? reject(err) : resolve()));
    });
  }

  /**
   * 把 `ws` 的 `WebSocket` 包成 `WebsocketTransport`。
   * 子类若要改帧格式或 id 生成策略，可 override。
   */
  protected createTransport(
    socket: TrackedSocket,
    request: BaseWebRequest,
    language: I18nLanguage,
  ): WebsocketTransport {
    const id = this.generateClientId(request);
    let messageHandler: ((event: string, data: unknown) => void) | undefined;
    let closeHandler: (() => void) | undefined;

    socket.on('message', (raw, isBinary) => {
      if (!messageHandler || isBinary) return;
      const parsed = this.parseFrame(raw);
      if (!parsed) {
        socket.close(
          1003,
          truncateCloseReason(i18n.t('invalid_frame', undefined, language)),
        );
        return;
      }
      messageHandler(parsed.event, parsed.data);
    });

    socket.on('close', () => {
      closeHandler?.();
    });

    return {
      id,
      request,
      send(event, data) {
        if (socket.readyState !== socket.OPEN) return;
        socket.send(JSON.stringify({ event, data }));
      },
      close(code, reason) {
        socket.close(code, reason ? truncateCloseReason(reason) : undefined);
      },
      terminate() {
        socket.terminate();
      },
      onMessage(handler) {
        messageHandler = handler;
      },
      onClose(handler) {
        closeHandler = handler;
      },
    };
  }

  /**
   * 解析文本帧为 `{ event, data }`；非法则返回 `null`（调用方会关连接）。
   * 子类可 override 以支持其它序列化格式。
   */
  protected parseFrame(raw: WebSocket.RawData): { event: string; data: unknown } | null {
    let text: string;
    if (typeof raw === 'string') {
      text = raw;
    } else if (Buffer.isBuffer(raw)) {
      text = raw.toString('utf8');
    } else if (Array.isArray(raw)) {
      text = Buffer.concat(raw).toString('utf8');
    } else {
      text = Buffer.from(raw).toString('utf8');
    }

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return null;
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    const event = (body as { event?: unknown }).event;
    if (
      typeof event !== 'string' ||
      event.length === 0 ||
      event.length > MAX_EVENT_NAME_LENGTH ||
      event.includes('\0')
    ) {
      return null;
    }
    return { event, data: (body as { data?: unknown }).data };
  }
}

const resolveHeartbeatInterval = (value: number | undefined): number => {
  if (value === undefined) return DEFAULT_HEARTBEAT_INTERVAL;
  if (!Number.isFinite(value) || value < 0) return DEFAULT_HEARTBEAT_INTERVAL;
  return value;
};

/**
 * close reason 必须是合法 UTF-8 且 ≤123 字节。
 * 按码点回退，不在多字节字符中间切开。切完再 `toString` 会得到 U+FFFD，
 * 重新编码后可能超过 123 字节，`ws` 关闭帧会抛 RangeError。
 */
const truncateCloseReason = (reason: string): string => {
  if (Buffer.byteLength(reason) <= MAX_CLOSE_REASON_BYTES) return reason;
  let bytes = 0;
  let chars = 0;
  for (const char of reason) {
    const size = Buffer.byteLength(char);
    if (bytes + size > MAX_CLOSE_REASON_BYTES) break;
    bytes += size;
    chars += char.length;
  }
  return reason.slice(0, chars);
};
