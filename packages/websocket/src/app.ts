import {
  compose,
  ensureI18nLanguage,
  resolveI18nLanguage,
  type I18nLanguage,
} from '@aomex/common';
import { type BaseWebRequest, type WebApp } from '@aomex/web';
import type http from 'node:http';
import type https from 'node:https';
import type { SocketMiddlewareToken } from './channel';
import {
  WebsocketHub,
  WebsocketAll,
  MemoryHub,
  type WebsocketRoom,
  type WebsocketUnknownEventMode,
  type WebsocketMetricHandler,
  type WebsocketStats,
} from './core';
import {
  type WebsocketTransportAdapter,
  type WebsocketTransportVerify,
  type WebsocketHubAdapter,
} from './adapters';
import { i18n } from './i18n';

/** 默认单帧上限 1MiB，防止大包占满内存 */
const DEFAULT_MAX_PAYLOAD = 1024 * 1024;

export interface WebsocketAppOptions<
  T extends SocketMiddlewareToken[] | [] = SocketMiddlewareToken[] | [],
> {
  /**
   * 升级路径，客户端连 `ws://host:port{path}`。默认：`/ws`
   *
   * ```ts
   * new WebsocketApp({ logger, language, path: '/realtime', transport, mount: [channels('./src/channels')] });
   * // 浏览器：new WebSocket('ws://localhost:3000/realtime')
   * ```
   */
  path?: string;
  /**
   * 语言。
   *
   * - `fixed`：这条连接上的翻译都用 `language`。
   * - `dynamic`：按握手请求头协商。`zh_CN`、`zh-cn` 等别名归一到规范码；都不中则用 `fallback`。
   *   `header` 默认 `accept-language`（按 q 排序）；其它头按逗号分隔、忽略 q。
   *
   * 作用在握手失败日志、非法帧的关闭原因，以及这条连接的入站处理（错误帧、限流文案）。
   * HTTP 路由里的 `room().send()` 仍跟随该 HTTP 请求的语言。
   *
   * ```ts
   * language: { mode: 'fixed', language: 'zh-CN' }
   * language: { mode: 'dynamic', fallback: 'zh-CN' }
   * language: { mode: 'dynamic', header: 'x-language', fallback: 'en-US' }
   * ```
   */
  language: WebApp.LanguageOption;
  /**
   * 全局 Socket 中间件链（对齐 `WebApp.mount`）。
   * 通常包含 `channels(...)`，其前可挂鉴权 / 限流等；仅 `middleware.socket` / `mixin`。
   *
   * ```ts
   * new WebsocketApp({
   *   logger,
   *   language,
   *   transport,
   *   mount: [
   *     middleware.socket(async (ctx, next) => next()),
   *     channels('./src/channels'),
   *   ],
   * });
   * ```
   */
  mount?: T;
  /**
   * 单帧最大字节。默认：`1_048_576`（1MiB）。超限由底层断开连接。
   *
   * ```ts
   * new WebsocketApp({
   *   logger,
   *   language,
   *   transport,
   *   maxPayload: 256 * 1024,
   *   mount: [channels('./src/channels')],
   * });
   * ```
   */
  maxPayload?: number;
  /**
   * 握手校验：入参为 `BaseWebRequest`；`true` 放行，`false` → 403，或返回 `HttpErrorStatus`。
   *
   * ```ts
   * new WebsocketApp({
   *   logger,
   *   language,
   *   transport,
   *   mount: [channels('./src/channels')],
   *   verify: (request) => (request.cookies['sid'] ? true : 401),
   * });
   * ```
   */
  verify?: WebsocketTransportVerify;
  /**
   * 传输层（必填）：挂 upgrade、收发帧。标准 WS 用 `@aomex/websocket-ws-transport`，
   * Socket.IO 用 `@aomex/websocket-socket-io-transport`。
   *
   * ```ts
   * import { WsTransport } from '@aomex/websocket-ws-transport';
   * new WebsocketApp({ logger, language, transport: new WsTransport(), mount: [channels('./src/channels')] });
   * ```
   */
  transport: WebsocketTransportAdapter;
  /**
   * 房间与广播（可选）。默认 `new MemoryHub()`，只覆盖本进程里的连接。
   * 多机，或 console 等其它进程要推给已连接客户端时，用 `@aomex/websocket-redis-hub`，
   * 且 Redis 与 `channel` 前缀必须和持有连接的进程一致。与 `transport` 正交。
   *
   * ```ts
   * import { RedisHub } from '@aomex/websocket-redis-hub';
   *
   * new WebsocketApp({
   *   logger,
   *   language,
   *   transport: new WsTransport(),
   *   hub: new RedisHub({ host: '127.0.0.1', port: 6379 }),
   *   mount: [channels('./src/channels')],
   * });
   * ```
   */
  hub?: WebsocketHubAdapter;
  /**
   * 未注册入站事件：`ignore` 静默丢弃（默认）；`error` 回推 error 帧。
   * 在整条 `mount` 链都 `next()` 未消化时触发（通常即 `channels()` 未匹配）。
   *
   * ```ts
   * new WebsocketApp({
   *   logger,
   *   language,
   *   transport,
   *   mount: [channels('./src/channels')],
   *   unknownEvent: 'error',
   * });
   * ```
   */
  unknownEvent?: WebsocketUnknownEventMode;
  /**
   * 可观测回调（本机：在线数、入站成败、扇出耗时与失败数、Redis publish/订阅等）。
   * 抛错会记一条 warn 日志，不影响收发主路径。
   *
   * ```ts
   * new WebsocketApp({
   *   logger,
   *   language,
   *   transport,
   *   mount: [channels('./src/channels')],
   *   onMetric: (e) => {
   *     if (e.type === 'online') console.log('online', e.online);
   *   },
   * });
   * ```
   */
  onMetric?: WebsocketMetricHandler;
  /**
   * 应用日志（必填）。与 `WebApp` / `ConsoleApp` 传入同一个 `services.logger`。
   * 传输初始化、扇出、订阅对齐等后台失败都写到这里。
   * HTTP 与 console 是两个进程，各自构造时传本进程的 logger。
   */
  logger: WebApp.Logger;
}

/**
 * 与 {@link WebApp} 同级的 WebSocket 应用：经 {@link attach} 挂到指定 HTTP Server。
 *
 * 同一个进程里必须是同一个实例。放在独立模块里导出，HTTP 入口只 {@link attach} 一次；
 * 路由、console 指令 import 这份实例，用 {@link all} / {@link room} 推送。
 * 不要在模块顶层调用 `attach`：console 是另一个进程，import 时会再构造一份。
 *
 * 默认 {@link MemoryHub} 的连接表不出进程。console 或其它进程要打到 Web 上的连接，
 * 构造时换成 `RedisHub`，Redis 与频道前缀和 Web 进程相同。
 *
 * **投递语义：** 出站均为 at-most-once（尽力写出 / Pub/Sub 发布），
 * 不提供框架级 ack、离线队列或全集群有序；重要状态请落库并由业务补洞。
 *
 * ```ts
 * // src/ws.ts
 * import { WebsocketApp, channels } from '@aomex/websocket';
 * import { WsTransport } from '@aomex/websocket-ws-transport';
 * import { RedisHub } from '@aomex/websocket-redis-hub';
 *
 * export const ws = new WebsocketApp({
 *   logger: services.logger,
 *   language: { mode: 'dynamic', fallback: 'zh-CN' },
 *   path: '/ws',
 *   transport: new WsTransport(),
 *   hub: new RedisHub({ host: '127.0.0.1', port: 6379, channel: 'aomex:websocket:hub' }),
 *   mount: [channels('./src/channels')],
 * });
 *
 * // HTTP 入口
 * import { ws } from './ws';
 * const server = web.http({});
 * ws.attach(web, server); // 立刻挂 upgrade，不挡 listen
 * server.listen(3000);
 *
 * // 路由或 console 指令：落库成功后推给已 join 的连接
 * import { ws } from './ws';
 * await ws.room(`order:${order.id}`).send('order.updated', order);
 * ```
 */
export class WebsocketApp<T extends SocketMiddlewareToken[] | [] = any[]> {
  protected readonly path: string;
  protected readonly maxPayload: number;
  protected readonly verify?: WebsocketTransportVerify;
  protected readonly transport: WebsocketTransportAdapter;
  protected readonly hub: WebsocketHub;
  protected readonly middlewareList: SocketMiddlewareToken[];
  protected attached = false;
  /**
   * 全体在线广播入口（句柄，不是连接列表）。
   * 路由或 console 指令 import 同一份 `ws` 后调用。
   * HTTP 写库成功后推给所有已连接客户端：
   *
   * ```ts
   * await ws.all.send('order.updated', order);
   * await ws.all.send('order.updated', order, { except: clientId });
   * ```
   *
   * 投递为 at-most-once：`await` 结束表示已交给 Hub 或已发布到总线，不表示对端已收到。
   * 发送前会等 Hub 就绪。没连上的客户端收不到，下次用 HTTP 读取补齐。
   */
  readonly all: WebsocketAll;

  constructor(protected readonly options: WebsocketAppOptions<T>) {
    this.path = this.normalizePath(options.path ?? '/ws');
    this.maxPayload = this.resolveMaxPayload(options.maxPayload);
    this.verify = options.verify;
    this.transport = options.transport;
    this.middlewareList = [...(options.mount ?? [])];
    this.hub = new WebsocketHub(options.hub ?? new MemoryHub(), {
      unknownEvent: options.unknownEvent,
      pipeline: compose(this.middlewareList),
      onMetric: options.onMetric,
    });
    this.all = new WebsocketAll(this.hub);
    this.hub.bindLogger(options.logger);
    this.transport.bindLogger(options.logger);
  }

  /**
   * 按房间名取广播目标。路由和 console 都调用这一份 `ws.room`。
   * 连接须先在 Channel 里 `ctx.client.join(name)`，否则收不到。
   * 连接建立时只会自动加入名为 `client.id` 的房间。
   *
   * ```ts
   * await ws.room(`order:${order.id}`).send('order.updated', order);
   * await ws.room(clientId).send('dm', { text: 'hi' });
   * ```
   *
   * 空房间名、含 `\\0` 的房间名会同步抛错。投递语义同 {@link all}。
   */
  room(name: string): WebsocketRoom {
    return this.hub.room(name);
  }

  /**
   * 本机可观测快照（拉模式，非集群汇总）。
   * 适合探针 / 定时 scrape；瞬时事件仍用 `onMetric`。
   *
   * ```ts
   * setInterval(async () => {
   *   const s = await ws.stats();
   *   gauge.set({ online: s.online, rooms: s.rooms });
   * }, 10_000);
   * ```
   */
  stats(): Promise<WebsocketStats> {
    return this.hub.stats();
  }

  /**
   * 挂到指定 HTTP(S) Server 的 upgrade（须在 `server.listen` 之前调用）。
   * 只在 HTTP 入口对导出的那一个实例调用一次；模块顶层和 console 进程不要调用。
   * `web` 供握手请求挂 `req.app`；`server` 一般为 `web.http()` / `https()` 的返回值。
   * 同步返回，并立刻把 upgrade 挂到 `server` 上。
   * Hub 不在这里初始化：HTTP / console 的 `room().send()` 不经过 `attach`，
   * 接入、进房、退房和广播各自等待同一次 `ensureReady`。
   * 传输的 `listen` 已经创建了升级服务器，所以这里触发一次传输 `ensureReady` 来登记 `onDestroy`，
   * 不等待。握手仍会等这同一次 promise。
   */
  attach(web: WebApp, server: http.Server | https.Server): this {
    if (this.attached) {
      throw new Error(i18n.t('already_attached', undefined, this.resolveLanguage()));
    }
    this.attached = true;
    // 关停前半：经 WebApp 与 server.close 并行排空传输（不走 registerLifecycle）
    web.onShutdown(() => this.transport.shutdown());
    this.transport.listen(server, {
      app: web,
      path: this.path,
      maxPayload: this.maxPayload,
      verify: this.verify,
      resolveLanguage: (request) => this.resolveLanguage(request),
      onConnection: (connection) => {
        this.hub.accept(connection, this.resolveLanguage(connection.request));
      },
    });
    // listen 已经挂上 upgrade。接着登记传输生命周期，进程关停才能关掉它。
    // 不 await：不挡住 HTTP listen。初始化失败在这里记一条，握手拿到 503。
    void this.transport.ensureReady().catch(async (err: unknown) => {
      const language = this.resolveLanguage();
      await ensureI18nLanguage(language);
      void this.options.logger.error(
        err,
        i18n.t('transport_init_failed', undefined, language),
      );
    });
    return this;
  }

  /**
   * `fixed` 直接返回配置语言；`dynamic` 从握手请求头协商。
   * 没有请求时用 `dynamic` 的 fallback。
   */
  protected resolveLanguage(request?: BaseWebRequest): I18nLanguage {
    const option = this.options.language;
    if (option.mode === 'fixed') return option.language;
    if (!request) return option.fallback;

    const headerName = (option.header ?? 'accept-language').toLowerCase();
    const accepted =
      headerName === 'accept-language'
        ? request.accept.languages()
        : this.readLanguageHeader(request, headerName);
    const tags = Array.isArray(accepted) ? accepted : [];

    // 请求头不可信，只接受能归一到内置语言码的标签。
    for (const tag of tags) {
      if (!tag || tag === '*') continue;
      const resolved = resolveI18nLanguage(tag);
      if (resolved) return resolved;
    }
    return option.fallback;
  }

  /** 非 `accept-language` 的头：逗号分隔，丢掉 q 值。 */
  protected readLanguageHeader(request: BaseWebRequest, name: string): string[] {
    const raw = request.headers[name];
    if (!raw) return [];
    const value = Array.isArray(raw) ? raw.join(',') : raw;
    return value
      .split(',')
      .map((part) => part.split(';')[0]?.trim() ?? '')
      .filter((tag) => tag.length > 0);
  }

  /** 升级路径补前导 `/`，并去掉末尾 `/`（根路径 `/` 保留）。 */
  protected normalizePath(path: string): string {
    if (!path.startsWith('/')) return `/${path}`;
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  }

  /** 单帧上限。缺省、非有限数或非正数时用默认 1MiB。 */
  protected resolveMaxPayload(value: number | undefined): number {
    if (value === undefined) return DEFAULT_MAX_PAYLOAD;
    if (!Number.isFinite(value) || value <= 0) return DEFAULT_MAX_PAYLOAD;
    return value;
  }
}
