import type http from 'node:http';
import type https from 'node:https';
import type { IncomingMessage } from 'node:http';
import { randomBytes } from 'node:crypto';
import {
  I18n,
  ensureI18nLanguage,
  registerLifecycle,
  type I18nLanguage,
} from '@aomex/common';
import { BaseWebRequest, statuses, type HttpErrorStatus, type WebApp } from '@aomex/web';
import { i18n } from '../i18n';

/**
 * 传输层单条连接抽象（标准 WS / Socket.IO 等）。
 * 自定义传输时实现本接口，再交给 `WebsocketHub.accept`。
 *
 * 房间与广播由 `WebsocketHubAdapter` 负责，传输层不要维护 room。
 *
 * ```ts
 * const transport: WebsocketTransport = {
 *   id: 'xxx',
 *   request: req,
 *   send(event, data) { socket.send(JSON.stringify({ event, data })); },
 *   close(code, reason) { socket.close(code, reason); },
 *   onMessage(handler) { ... },
 *   onClose(handler) { ... },
 * };
 * ```
 */
export interface WebsocketTransport {
  readonly id: string;
  /**
   * 升级时的请求（{@link BaseWebRequest}），供业务读 Cookie / Query / IP。
   * 对应 `ctx.client.request`。
   */
  readonly request?: BaseWebRequest;
  /** 向该连接推送 `{ event, data }`（可为异步） */
  send(event: string, data: unknown): void | Promise<void>;

  /** 优雅关闭（可为异步） */
  close(code?: number, reason?: string): void | Promise<void>;

  /**
   * 强制断开（半开连接、心跳失败）。
   * 对应 `ws.terminate()`；没有则可省略，Hub 只会调 `close`。
   */
  terminate?(): void;
  /** 注册入站消息回调：`(event, data) => void` */
  onMessage(handler: (event: string, data: unknown) => void): void;
  /** 注册连接关闭回调 */
  onClose(handler: () => void): void;
}

/**
 * 握手校验返回值：
 * - `true`：放行
 * - `false`：拒绝，HTTP 403
 * - {@link HttpErrorStatus}：拒绝，使用该状态码（文案取自 `statuses`）
 */
export type WebsocketTransportVerifyResult = boolean | HttpErrorStatus;

/**
 * 握手校验函数，在 upgrade 完成前调用，直接接收 {@link BaseWebRequest}。
 *
 * ```ts
 * const verify: WebsocketTransportVerify = (request) => {
 *   const origin = request.headers['origin'];
 *   if (origin && !String(origin).endsWith('example.com')) return false;
 *   if (!request.cookies['sid']) return 401;
 *   return true;
 * };
 * ```
 */
export type WebsocketTransportVerify = (
  request: BaseWebRequest,
) => WebsocketTransportVerifyResult | Promise<WebsocketTransportVerifyResult>;

/**
 * `transport.listen(server, context)` 的上下文，由 `WebsocketApp` 填好后传入。
 * 自定义传输按这些字段挂传输层即可。
 */
export interface WebsocketTransportListenContext {
  /** 所属 WebApp，用于给握手请求挂上 `proxyIP` 等配置 */
  app: WebApp;
  /** 升级路径，如 `/ws` */
  path: string;
  /** 单帧最大字节数 */
  maxPayload: number;
  /**
   * 握手校验。标准 `ws` 传输走 `verifyClient`；Socket.IO 传输走 `io.use`。
   */
  verify?: WebsocketTransportVerify;
  /**
   * 按握手请求协商这条连接的语言。
   * `WebsocketApp` 会传入；缺省时传输层按 `zh-CN`。
   */
  resolveLanguage?(request: BaseWebRequest): I18nLanguage;
  /**
   * 新连接建立后回调；传输应调用并传入 `WebsocketTransport`。
   *
   * ```ts
   * wss.on('connection', (socket, req) => {
   *   context.onConnection(createTransport(socket, req));
   * });
   * ```
   */
  onConnection(transport: WebsocketTransport): void;
}

/**
 * 传输基类：挂到 `http.Server` 并产出连接。
 * 首次 {@link ensureReady} 时登记生命周期；子类实现 `onInit` / `listen` / `onDestroy`，
 * 可选 override {@link onShutdown}（由 {@link shutdown} 调用，经 `WebsocketApp` → `WebApp.onShutdown`）。
 * `attach` 同步调用 {@link listen}，并触发一次 {@link ensureReady} 登记 `onDestroy`（不等待）。
 * 握手仍通过 {@link beforeHandshake} 等待这同一次初始化。
 * 房间广播由 `hub` 管理，不要在此维护 room。
 *
 * ```ts
 * class MyTransport extends WebsocketTransportAdapter {
 *   onInit() {}
 *   listen(server, context) {
 *     // 挂 upgrade；握手时调 beforeHandshake，再 onConnection
 *   }
 *   async onShutdown() {
 *     // 停握手、按协议关连
 *   }
 *   async onDestroy() {
 *     // 释放本传输资源
 *   }
 * }
 *
 * new WebsocketApp({ logger: services.logger, language: { mode: 'fixed', language: 'zh-CN' }, transport: new MyTransport(), mount: [channels('./src/channels')] }).attach(web, server);
 * ```
 */
export abstract class WebsocketTransportAdapter {
  protected readyPromise?: Promise<void>;
  protected shutdownPromise?: Promise<void>;
  /** 关停中：握手应拒绝新连接 */
  protected destroying = false;
  /** 由 {@link WebsocketApp} 在构造时注入的应用日志 */
  protected logger!: WebApp.Logger;

  /** 由 {@link WebsocketApp} 注入应用日志。校验抛错写到这里。 */
  bindLogger(logger: WebApp.Logger): void {
    this.logger = logger;
  }

  /**
   * 载入握手请求对应的语言包。
   * 没有 {@link WebsocketTransportListenContext.resolveLanguage} 时用 `zh-CN`。
   */
  protected async prepareLanguage(
    context: WebsocketTransportListenContext,
    req: IncomingMessage,
  ): Promise<I18nLanguage> {
    const language =
      context.resolveLanguage?.(this.ensureRequest(req, context.app)) ?? 'zh-CN';
    await ensureI18nLanguage(language);
    return language;
  }

  /**
   * 握手校验抛错：先载入语言包，再按协商语言记一条，然后由传输层拒绝。
   */
  protected async failHandshake(
    context: WebsocketTransportListenContext,
    req: IncomingMessage,
    err: unknown,
  ): Promise<void> {
    const language = await this.prepareLanguage(context, req);
    void this.logger.error(err, i18n.t('handshake_failed', undefined, language));
  }

  /**
   * 确保已完成生命周期 `onInit`（可重入）。内部调用 `registerLifecycle`。
   * `attach` 在 `listen` 之后触发一次以登记 `onDestroy`；握手 {@link beforeHandshake} 等待同一次 promise。
   */
  ensureReady(): Promise<void> {
    this.readyPromise ??= registerLifecycle({
      onInit: () => this.onInit(),
      onDestroy: () => this.onDestroy(),
    }).then(() => undefined);
    return this.readyPromise;
  }

  /**
   * 关停前半段：停握手并排空连接。由 `WebsocketApp.attach` 挂到 `WebApp.onShutdown`。
   * 可重入；与 `registerLifecycle` 的 `onDestroy` 无关。
   */
  shutdown(): Promise<void> {
    if (!this.shutdownPromise) {
      this.destroying = true;
      this.shutdownPromise = Promise.resolve(this.onShutdown());
    }
    return this.shutdownPromise;
  }

  /**
   * 生命周期初始化。传输资源通常在 {@link listen} 时创建，此处可为空操作。
   */
  abstract onInit(): void | Promise<void>;

  /**
   * 在已有 HTTP(S) Server 上监听升级 / 握手。
   * 由 `WebsocketApp.attach` 调用；握手内须 {@link beforeHandshake}，以便就绪门闩生效。
   */
  abstract listen(
    server: http.Server | https.Server,
    context: WebsocketTransportListenContext,
  ): void | Promise<void>;

  /**
   * 关停前半段实现：由 {@link shutdown} 调用。
   * 默认空操作；标准传输应在此停握手并优雅关连。
   */
  protected onShutdown(): void | Promise<void> {}

  /**
   * 释放传输资源（幂等）。进程关停后半段由 `registerLifecycle` 自动调用。
   */
  abstract onDestroy(): void | Promise<void>;

  /**
   * 生成连接 id，写入 `WebsocketTransport.id` / `ctx.client.id`。
   * 默认：`crypto.randomBytes(32)`（256-bit CSPRNG）再 `base64url`，碰撞可忽略。
   * 子类可 override（勿用业务主键）。
   */
  protected generateClientId(_request: BaseWebRequest): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * 校验并归一拒绝结果；放行返回 `null`。不含就绪等待。
   * 无 `verify` 或返回 `true` 放行；`false` → 403；数字 → 对应状态码与文案。
   */
  protected async rejectIfDenied(
    context: WebsocketTransportListenContext,
    req: IncomingMessage,
  ): Promise<{ statusCode: number; message: string } | null> {
    if (!context.verify) return null;
    const result = await context.verify(this.ensureRequest(req, context.app));
    if (result === true) return null;
    if (result === false) {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return {
      statusCode: result,
      message: String(statuses.message[result] ?? 'Forbidden'),
    };
  }

  /**
   * 握手前门闩：先 {@link ensureReady}，再可选 `verify`。
   * 初始化失败或关停中返回 503。子类在 `verifyClient` / `io.use` 中调用。
   */
  protected async beforeHandshake(
    context: WebsocketTransportListenContext,
    req: IncomingMessage,
  ): Promise<{ statusCode: number; message: string } | null> {
    const unavailable = { statusCode: 503, message: 'Service Unavailable' };
    try {
      await this.ensureReady();
    } catch {
      // 初始化失败已由 attach 记一条日志。这里直接拒绝，不再抛出去当成握手异常。
      return unavailable;
    }
    if (this.destroying) return unavailable;
    const language = await this.prepareLanguage(context, req);
    return I18n.provider(language, () => this.rejectIfDenied(context, req));
  }

  /**
   * 建连入口：先 {@link ensureRequest}，再 `create` + `onConnection`。
   * 子类不要自己 `ensureRequest` 后再挂 transport。
   */
  protected acceptConnection(
    context: WebsocketTransportListenContext,
    req: IncomingMessage,
    create: (request: BaseWebRequest) => WebsocketTransport,
  ): void {
    context.onConnection(create(this.ensureRequest(req, context.app)));
  }

  /**
   * 把 upgrade 的 `IncomingMessage` 提升为 {@link BaseWebRequest} 并挂上 `app` / `req`。
   * - `WebApp.http()`：已是 `WebRequest`，补 `app` 与自引用 `req`（upgrade 不走 WebContext）
   * - 其它：改原型为 {@link BaseWebRequest}
   *
   * 一般用 {@link rejectIfDenied} / {@link acceptConnection}；自定义握手路径才直接调。
   */
  protected ensureRequest(req: IncomingMessage, app: WebApp): BaseWebRequest {
    if (!(req instanceof BaseWebRequest)) {
      Object.setPrototypeOf(req, BaseWebRequest.prototype);
    }
    const base = req as BaseWebRequest;
    base.app = app;
    base.req = base;
    return base;
  }
}
