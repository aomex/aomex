import type { I18nLanguage } from '@aomex/common';
import type { BaseWebRequest } from '@aomex/web';
import type { WebsocketTransport } from '../adapters';
import type { WebsocketHub } from './hub';

export interface WebsocketBroadcastOptions {
  /**
   * 排除目标：连接实例（只需有 `id`）或 `client.id` 字符串。
   * 写成 `{ id: string }` 以便在 `emit()` 收窄 `ctx.client` 后仍可传入。
   *
   * ```ts
   * await ctx.room('lobby').send('chat.message', payload, { except: ctx.client });
   * await ctx.all.send('notice', { text: 'x' }, { except: someClientId });
   * ```
   */
  except?: { readonly id: string } | string;
}

/**
 * 当前 WebSocket 连接。业务里通过 `ctx.client` 使用。
 *
 * ```ts
 * await ctx.client.send('chat.ack', { ok: true });
 * await ctx.client.join('lobby');
 * await ctx.room('lobby').send('chat.message', { text: 'hi' }, { except: ctx.client });
 * await ctx.room(otherClientId).send('dm', { text: 'hi' });
 * ctx.client.data['userId'] = 'u1';
 * ```
 */
export class WebsocketClient {
  /**
   * 连接级业务数据，握手或首个事件里写入，后续事件读取。
   *
   * ```ts
   * ctx.client.data['userId'] = ctx.payload.userId;
   * const userId = ctx.client.data['userId'] as string | undefined;
   * ```
   */
  readonly data: Record<string, unknown> = {};

  constructor(
    protected readonly transport: WebsocketTransport,
    protected readonly hub: WebsocketHub,
    /**
     * 这条连接协商后的语言。
     * `fixed` 为应用配置；`dynamic` 按握手请求头协商，对不上时用 fallback。
     * 入站处理期间的翻译（错误帧、限流文案）使用它。
     */
    public readonly language: I18nLanguage,
  ) {}

  /**
   * 连接唯一 id（传输层 `generateClientId`，默认 256-bit CSPRNG / base64url）。
   *
   * ```ts
   * await ctx.room('lobby').send('member.joined', { id: ctx.client.id });
   * ```
   */
  get id(): string {
    return this.transport.id;
  }

  /**
   * 升级时的请求（{@link BaseWebRequest}），可读 Cookie、Query、IP 等。
   *
   * ```ts
   * const sid = ctx.client.request?.cookies['sid'];
   * const ip = ctx.client.request?.ip;
   * ```
   */
  get request(): BaseWebRequest | undefined {
    return this.transport.request;
  }

  /**
   * 当前已加入的房间名集合（经 `hub`，分布式下为异步）。
   * 至少包含自身 `id`（连接建立时自动加入）。
   *
   * ```ts
   * const rooms = await ctx.client.getRooms();
   * if (rooms.has('lobby')) { ... }
   * ```
   */
  getRooms(): Promise<ReadonlySet<string>> {
    return this.hub.getClientRooms(this.id);
  }

  /**
   * 只推给当前这一条连接（经传输层，可为异步）。
   *
   * **投递语义：** at-most-once。`await` 结束表示已交给传输层写出，不保证对端已收。
   *
   * ```ts
   * await ctx.client.send('chat.ack', { ok: true });
   * ```
   */
  async send(event: string, data?: unknown): Promise<void> {
    await this.transport.send(event, data);
  }

  /**
   * 加入房间（经 `hub`，分布式下为异步）。断线时会自动离开全部房间。
   *
   * ```ts
   * await ctx.client.join(ctx.payload.roomId);
   * await ctx.room(ctx.payload.roomId).send('room.joined', { id: ctx.client.id });
   * ```
   */
  join(room: string): Promise<void> {
    return this.hub.join(this, room);
  }

  /**
   * 离开指定房间（经 `hub`，分布式下为异步）。
   *
   * ```ts
   * await ctx.client.leave('lobby');
   * ```
   */
  leave(room: string): Promise<void> {
    return this.hub.leave(this, room);
  }

  /**
   * 离开所有房间并断开连接。
   *
   * ```ts
   * await ctx.client.close(4000, 'kicked');
   * ```
   */
  async close(code?: number, reason?: string): Promise<void> {
    await this.hub.removeClient(this);
    await this.transport.close(code, reason);
  }
}

/**
 * 全体在线连接的广播入口，对应 `ctx.all`（不是连接数组）。
 *
 * ```ts
 * await ctx.all.send('system.notice', { text: '维护 5 分钟' });
 * await ctx.all.send('system.notice', { text: '...' }, { except: ctx.client });
 * ```
 */
export class WebsocketAll {
  constructor(protected readonly hub: WebsocketHub) {}

  /**
   * 向所有在线连接推送（经 `hub`，分布式下为异步）。
   *
   * **投递语义：** at-most-once。`await` 结束表示已发布/扇出，不保证对端已收；
   * 无框架级 ack / 离线补发。详见 {@link WebsocketHub.broadcastAll}。
   */
  send(
    event: string,
    data?: unknown,
    options?: WebsocketBroadcastOptions,
  ): Promise<void> {
    return this.hub.broadcastAll(event, data, options);
  }
}

/**
 * 指定房间的广播入口，对应 `ctx.room(name)`。
 *
 * 默认含自己；排除自己时传 `{ except: ctx.client }`。
 *
 * ```ts
 * await ctx.room('lobby').send('chat.message', { text: 'hi' });
 * await ctx.room('lobby').send('chat.message', { text: 'hi' }, { except: ctx.client });
 * ```
 */
export class WebsocketRoom {
  constructor(
    protected readonly hub: WebsocketHub,
    protected readonly name: string,
  ) {}

  /**
   * 向本房间成员推送（经 `hub`，分布式下为异步）。
   *
   * **投递语义：** at-most-once。`await` 结束表示已发布/扇出，不保证对端已收；
   * 无框架级 ack / 离线补发。详见 {@link WebsocketHub.broadcast}。
   */
  send(
    event: string,
    data?: unknown,
    options?: WebsocketBroadcastOptions,
  ): Promise<void> {
    return this.hub.broadcast(this.name, event, data, options);
  }
}
