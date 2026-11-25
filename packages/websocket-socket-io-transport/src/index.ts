import type http from 'node:http';
import type https from 'node:https';
import { Server as SocketIoServer, type ServerOptions, type Socket } from 'socket.io';
import type { BaseWebRequest } from '@aomex/web';
import {
  WebsocketTransportAdapter,
  type WebsocketTransportListenContext,
  type WebsocketTransport,
} from '@aomex/websocket';

/** 与标准 WebSocket 传输一致：按字符串长度，不是 UTF-8 字节 */
const MAX_EVENT_NAME_LENGTH = 128;

/**
 * 传给 Socket.IO `Server` 的选项（`path` / `maxHttpBufferSize` 由 `WebsocketApp` 注入，勿在此重复）。
 *
 * 房间与跨机广播请用 `new WebsocketApp({ hub })`，不要在此挂 Socket.IO Redis adapter。
 *
 * ```ts
 * new SocketIoTransport({
 *   cors: { origin: '*' },
 *   pingInterval: 25_000,
 * });
 * ```
 */
export type SocketIoTransportOptions = Omit<
  Partial<ServerOptions>,
  'path' | 'maxHttpBufferSize'
>;

/**
 * 用 Socket.IO 作为 `@aomex/websocket` 的**传输层**（不含房间）。
 *
 * - 客户端必须用 `socket.io-client`（不是浏览器原生 `WebSocket`）
 * - 事件名与载荷仍走 `Channel.on`；服务端 `client.send(event, data)` 对应 `socket.emit`
 * - `join` / `room().send` / `all.send` 走配置项 `hub`（默认内存）
 * - 心跳由 Socket.IO 的 `pingInterval` / `pingTimeout` 负责
 * - `verify` 会转成 `io.use` 中间件
 * - `WebApp.onShutdown`（经 `WebsocketApp.attach`）调用 `shutdown()`：踢连接并关 Engine；`onDestroy` 幂等收尾
 * - 不暴露：namespace、`emit` ack / `emitWithAck`、`volatile`
 *
 * ```ts
 * import { WebsocketApp, channels } from '@aomex/websocket';
 * import { SocketIoTransport } from '@aomex/websocket-socket-io-transport';
 *
 * const ws = new WebsocketApp({
 *   logger,
 *   language: { mode: 'fixed', language: 'zh-CN' },
 *   path: '/ws',
 *   transport: new SocketIoTransport(),
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
 * import { io } from 'socket.io-client';
 * const socket = io('http://localhost:3000', { path: '/ws' });
 * socket.emit('echo', { text: 'hi' });
 * socket.on('echo', (data) => console.log(data));
 * ```
 */
export class SocketIoTransport extends WebsocketTransportAdapter {
  protected io?: SocketIoServer;

  /**
   * @param options Socket.IO 服务端选项（不含 path / maxHttpBufferSize）
   */
  constructor(protected readonly options: SocketIoTransportOptions = {}) {
    super();
  }

  /** 资源在 {@link listen} 时创建，此处无操作 */
  override onInit(): void {}

  /**
   * 在已有 HTTP Server 上创建 Socket.IO；由 `WebsocketApp.attach` 调用。
   * 握手经 {@link beforeHandshake} 等待传输就绪。
   */
  override listen(
    server: http.Server | https.Server,
    context: WebsocketTransportListenContext,
  ): void {
    if (this.io) return;

    const io = new SocketIoServer(server, {
      ...this.options,
      path: context.path,
      maxHttpBufferSize: context.maxPayload,
    });
    this.io = io;

    // 始终挂一层：无业务 verify 时也等 ensureReady
    io.use(async (socket, next) => {
      try {
        const denied = await this.beforeHandshake(context, socket.request);
        if (denied) {
          next(new Error(denied.message));
          return;
        }
        next();
      } catch (err) {
        await this.failHandshake(context, socket.request, err);
        next(err instanceof Error ? err : new Error('Forbidden'));
      }
    });

    io.on('connection', (socket) => {
      this.acceptConnection(context, socket.request, (request) =>
        this.createTransport(socket, request),
      );
    });
  }

  /**
   * 关停前半：踢掉连接并关 Engine（不 `io.close()`，以免连带外部 `http.Server`）。
   */
  override async onShutdown(): Promise<void> {
    await this.closeSocketIo();
  }

  /**
   * 关闭 Socket.IO 传输（幂等）；若 `onShutdown` 已关过则为空操作。
   */
  override async onDestroy(): Promise<void> {
    await this.closeSocketIo();
  }

  protected async closeSocketIo(): Promise<void> {
    const io = this.io;
    if (!io) return;
    this.io = undefined;
    io.disconnectSockets(true);
    io.engine?.close();
  }

  /**
   * 把 Socket.IO `Socket` 包成 `WebsocketTransport`。
   * 入站用 `onAny`（忽略 ack 回调函数）；出站用 `emit`。
   * `request` 须已由 {@link acceptConnection} 提升。
   */
  protected createTransport(socket: Socket, request: BaseWebRequest): WebsocketTransport {
    let messageHandler: ((event: string, data: unknown) => void) | undefined;
    let closeHandler: (() => void) | undefined;

    socket.on('error', () => {
      // 避免未监听 error 变成未捕获异常
    });

    socket.onAny((event, ...args) => {
      if (typeof event === 'string' && event.length > MAX_EVENT_NAME_LENGTH) {
        // 与 ws 传输一致：超长事件名不进处理链，直接断开。
        socket.disconnect(true);
        return;
      }
      if (!messageHandler) return;
      if (typeof event !== 'string' || event.length === 0 || event.includes('\0')) {
        return;
      }
      // Socket.IO 允许 emit(event, ...args, ackFn)；ack 是末尾函数，不能当 payload
      const data = args.find((item) => typeof item !== 'function');
      messageHandler(event, data);
    });

    socket.on('disconnect', () => {
      closeHandler?.();
    });

    return {
      id: this.generateClientId(request),
      request,
      send(event, data) {
        socket.emit(event, data);
      },
      close(_code, _reason) {
        // Socket.IO 无 WS close code；close 参数仅保留接口对齐
        socket.disconnect(true);
      },
      terminate() {
        socket.disconnect(true);
      },
      onMessage(handler) {
        messageHandler = handler;
      },
      onClose(handler) {
        closeHandler = handler;
      },
    };
  }
}
