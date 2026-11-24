import {
  I18n,
  ensureI18nLanguage,
  type ComposeFn,
  type I18nLanguage,
} from '@aomex/common';
import type { WebsocketTransport } from '../adapters';
import {
  WebsocketClient,
  WebsocketAll,
  WebsocketRoom,
  type WebsocketBroadcastOptions,
} from './client';
import { WebsocketContext } from './context';
import type { WebsocketHubAdapter } from '../adapters/hub-adapter';
import type { WebApp } from '@aomex/web';
import { MemoryHub } from './memory-hub';
import type { WebsocketMetricHandler, WebsocketStats } from './metric';

import { i18n } from '../i18n';

export type EventHandlerMap = Map<string, ComposeFn>;

/** 未注册入站事件的处理策略 */
export type WebsocketUnknownEventMode = 'ignore' | 'error';

export interface WebsocketHubOptions {
  /**
   * 未注册事件：`ignore` 静默丢弃（默认）；`error` 回推 `{ event: 'error', data: { message } }`。
   * 在 `pipeline` 整链 `next()` 未消化时触发。
   */
  unknownEvent?: WebsocketUnknownEventMode;
  /**
   * 入站处理链（通常为 `WebsocketApp.mount` 的 `compose` 结果，内含 `channels()`）。
   */
  pipeline?: ComposeFn;
  /** 由 {@link WebsocketApp} 注入的指标回调 */
  onMetric?: WebsocketMetricHandler;
}

/**
 * 连接注册与事件分发；房间/广播一律委托 {@link WebsocketHubAdapter}。
 *
 * 一般由 `WebsocketApp` 内部创建；自定义传输在拿到 `transport` 后调用 `accept`。
 *
 * - 默认 `MemoryHub`（单机）
 * - 多机传入自定义 `hub`（与传输层 `transport` 正交）
 * - 每条连接自动加入以 `client.id` 为名的房间，便于点对点 `ctx.room(id).send`
 * - `join` / `leave` 返回 `Promise`，分布式 hub 可真正异步落库/发总线
 * - 入站经 `pipeline`（App `mount`）；未匹配事件在 `next` 时按 `unknownEvent` 处理
 *
 * ```ts
 * context.onConnection((transport) => {
 *   hub.accept(transport, language);
 * });
 * ```
 */
export class WebsocketHub {
  /** 本机连接（传输实例）；跨节点成员不在此表 */
  protected readonly clients = new Map<string, WebsocketClient>();
  /** 同一连接上的事件串行处理，避免并发改 `client.data` / room 竞态 */
  protected readonly dispatchQueues = new Map<string, Promise<void>>();
  protected pipeline: ComposeFn;
  protected readonly all = new WebsocketAll(this);
  protected readonly hub: WebsocketHubAdapter;
  protected readonly unknownEvent: WebsocketUnknownEventMode;
  /** 应用日志。接入、入站和移除失败都写到这里。 */
  protected logger!: WebApp.Logger;

  /**
   * @param hub 房间与广播；默认进程内 {@link MemoryHub}
   */
  constructor(
    hub: WebsocketHubAdapter = new MemoryHub(),
    options: WebsocketHubOptions = {},
  ) {
    this.hub = hub;
    this.unknownEvent = options.unknownEvent ?? 'ignore';
    this.pipeline = options.pipeline ?? (async (_ctx, next) => next?.());
    if (options.onMetric) {
      this.hub.bindMetric(options.onMetric);
    }
    this.hub.bind((clientId, event, data) => {
      return this.clients.get(clientId)?.send(event, data);
    });
  }

  /**
   * 确保 Hub 适配器已 `onInit`（可重入，重复等的是同一次初始化）。
   * 接入、进房、退房、断线和广播各自先等它：这些入口不经过同一次握手。
   */
  ensureReady(): Promise<void> {
    return this.hub.ensureReady();
  }

  /** 记下应用日志，并交给 Hub 适配器。扇出和订阅失败在适配器里写。 */
  bindLogger(logger: WebApp.Logger): void {
    this.logger = logger;
    this.hub.bindLogger(logger);
  }

  /**
   * 让随后的翻译使用这条连接的语言。
   * 只包接入失败、断线清理和入站处理；HTTP 里的 `room().send()` 不经过这里。
   */
  protected inLanguage<T>(language: I18nLanguage, task: () => Promise<T>): Promise<T> {
    return ensureI18nLanguage(language).then(() => I18n.provider(language, task));
  }

  /**
   * 接纳一条新连接：登记、加入名为 `client.id` 的个人房间、监听消息与关闭。
   * 个人房间的登记会先等 Hub 初始化，不依赖 `attach` 提前连上。
   *
   * 个人房间订上之后这条连接才留在在线表里。订不上就关掉并移除。
   * 否则人还在 `clients` 中，`room(client.id)` 却没有订阅，点对点会静默丢消息。
   *
   * @param language 这条连接协商后的语言。入站处理包在该语言的上下文里。
   */
  accept(transport: WebsocketTransport, language: I18nLanguage): void {
    const client = new WebsocketClient(transport, this, language);
    this.clients.set(client.id, client);
    this.reportOnline();

    const ready = (async () => {
      await this.ensureReady();
      await this.hub.addClient(client.id);
      await this.join(client, client.id);
    })();
    void ready.catch((err) => {
      void this.inLanguage(language, async () => {
        void this.logger.error(err, i18n.t('accept_failed'));
        await this.dropFailedAccept(client, transport);
      });
    });

    transport.onMessage((event, data) => {
      this.enqueue(client.id, async () => {
        try {
          await ready;
        } catch {
          // 个人房间没订上。连接会在 accept 里关掉，这条消息不再分发。
          // 拒绝必须在这里接住，否则入站队列的 promise 没有人 await，会变成未处理 rejection。
          return;
        }
        await this.inLanguage(language, () => this.dispatch(client, event, data));
      });
    });
    transport.onClose(() => {
      void ready
        .catch(() => {
          // 接入失败已经记过日志，并且会关掉连接。断线时仍要把人从在线表拿掉。
        })
        .then(() => this.inLanguage(language, () => this.removeClient(client)))
        .finally(() => {
          this.dispatchQueues.delete(client.id);
        });
    });
  }

  /**
   * 个人房间登记失败：清掉这个人，再断开传输。
   * `removeClient` 自己把在线表和房间成员清完，这里不再包一层。
   */
  protected async dropFailedAccept(
    client: WebsocketClient,
    transport: WebsocketTransport,
  ): Promise<void> {
    await this.removeClient(client);
    try {
      await transport.close();
    } catch (err) {
      void this.logger.warn(err, i18n.t('close_connection_failed'));
    }
  }

  /**
   * 查询某连接已加入的房间（供 `client.getRooms()`）。
   */
  getClientRooms(clientId: string): Promise<ReadonlySet<string>> {
    return Promise.resolve(this.hub.getClientRooms(clientId));
  }

  /**
   * 将连接加入房间。通常经 `await ctx.client.join(room)` 调用。
   */
  async join(client: WebsocketClient, room: string): Promise<void> {
    const name = this.normalizeRoom(room);
    await this.ensureReady();
    await this.hub.join(client.id, name);
  }

  /**
   * 将连接移出房间。通常经 `await ctx.client.leave(room)` 调用。
   */
  async leave(client: WebsocketClient, room: string): Promise<void> {
    const name = this.normalizeRoom(room);
    await this.ensureReady();
    await this.hub.leave(client.id, name);
  }

  /**
   * 从本机在线表移除连接（断线或 `client.close()` 时）。
   * 适配器抛错时仍清掉它的本地成员。本方法不往外抛。
   */
  async removeClient(client: WebsocketClient): Promise<void> {
    try {
      await this.ensureReady();
      await this.hub.removeClient(client.id);
    } catch (err) {
      // 适配器若在清成员表之前抛错，这个人还会留在在线表和房间里，之后的广播仍会算上他。
      void this.logger.warn(err, i18n.t('remove_client_failed'));
      try {
        this.hub['forgetLocalClient'](client.id);
      } catch (forgetErr) {
        void this.logger.warn(forgetErr, i18n.t('remove_client_failed'));
      }
    } finally {
      this.clients.delete(client.id);
      this.reportOnline();
    }
  }

  protected reportOnline(): void {
    this.hub['reportMetric']({ type: 'online', online: this.clients.size });
  }

  /** 入站处理链结束时上报。耗时不含失败后的错误帧回推。 */
  protected reportInbound(ok: boolean, started: number): void {
    this.hub['reportMetric']({
      type: 'inbound',
      ok,
      durationMs: performance.now() - started,
    });
  }

  /**
   * 向房间广播。Socket 里用 `await ctx.room(name).send`，HTTP 里用 `await ws.room(name).send`。
   * 排除某个连接时加 `{ except }`。
   *
   * 先等 Hub 初始化（多机时即 Redis 已连上），再写出。
   * **投递语义：** at-most-once。`await` 结束表示已交给 Hub 写出或已发布到总线，
   * **不表示**对端已收到；无框架级 ack / 离线队列。详见 {@link WebsocketHubAdapter.broadcast}。
   */
  async broadcast(
    room: string,
    event: string,
    data?: unknown,
    options?: WebsocketBroadcastOptions,
  ): Promise<void> {
    const name = this.normalizeRoom(room);
    const exceptId = this.resolveExceptId(options?.except);
    await this.ensureReady();
    await this.hub.broadcast(name, event, data, { exceptId });
  }

  /**
   * 向全体在线连接广播。Socket 里用 `await ctx.all.send`，HTTP 里用 `await ws.all.send`。
   * 先等 Hub 初始化。投递语义同 {@link broadcast}（at-most-once）。
   */
  async broadcastAll(
    event: string,
    data?: unknown,
    options?: WebsocketBroadcastOptions,
  ): Promise<void> {
    const exceptId = this.resolveExceptId(options?.except);
    await this.ensureReady();
    await this.hub.broadcastAll(event, data, { exceptId });
  }

  /**
   * 本机快照：`online` 对齐传输连接表（与 `onMetric` 的 online 同源），
   * `rooms` / `subscribedRooms` 来自 Hub 适配器。
   * 只读内存表，不触发 Hub 初始化。
   */
  async stats(): Promise<WebsocketStats> {
    const hubStats = await this.hub.stats();
    return {
      online: this.clients.size,
      rooms: hubStats.rooms,
      subscribedRooms: hubStats.subscribedRooms,
    };
  }

  /**
   * 取得房间广播句柄。通常用 `ctx.room(name)`。
   */
  room(name: string): WebsocketRoom {
    return new WebsocketRoom(this, this.normalizeRoom(name));
  }

  protected resolveExceptId(
    except: WebsocketBroadcastOptions['except'],
  ): string | undefined {
    if (!except) return undefined;
    return typeof except === 'string' ? except : except.id;
  }

  protected normalizeRoom(room: string): string {
    if (typeof room !== 'string' || room.length === 0 || room.includes('\0')) {
      throw new Error(i18n.t('invalid_room_name'));
    }
    return room;
  }

  protected enqueue(clientId: string, task: () => Promise<void>): void {
    const prev = this.dispatchQueues.get(clientId) ?? Promise.resolve();
    const next = prev
      .then(task, task)
      .catch((err) => {
        // 这条链没有外部 await。拒绝留在日志里，后面的消息继续处理。
        void this.logger.error(err, i18n.t('inbound_task_failed'));
      })
      .finally(() => {
        if (this.dispatchQueues.get(clientId) === next) {
          this.dispatchQueues.delete(clientId);
        }
      });
    this.dispatchQueues.set(clientId, next);
  }

  protected async dispatch(
    client: WebsocketClient,
    event: string,
    data: unknown,
  ): Promise<void> {
    const started = performance.now();
    const ctx = new WebsocketContext(
      event,
      client,
      this.all,
      (name) => this.room(name),
      data,
    );

    try {
      await this.pipeline(ctx, async () => {
        if (this.unknownEvent === 'error') {
          await client.send('error', {
            message: i18n.t('unknown_event', { event }),
          });
        }
      });
      this.reportInbound(true, started);
    } catch (err) {
      this.reportInbound(false, started);
      void this.logger.error(err, i18n.t('inbound_task_failed'));
      const message = err instanceof Error ? err.message : i18n.t('handler_error');
      try {
        await client.send('error', { message });
      } catch (sendErr) {
        // 连接已经写不出去。这次失败不能再抛回入站队列。
        void this.logger.warn(sendErr, i18n.t('error_frame_failed'));
      }
    }
  }
}
