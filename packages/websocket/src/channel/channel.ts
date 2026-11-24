import { Middleware, compose, middleware, type ComposeFn } from '@aomex/common';
import type { Union2Intersection } from '@aomex/internal-tools';
import type { WebsocketContext } from '../core/context';
import type { WebsocketClient, WebsocketAll, WebsocketRoom } from '../core/client';
import {
  type CollectEmitMap,
  type EmitBroadcastSender,
  type EmitPointSendOverloads,
  type EmitPointSender,
} from '../middleware/emit';
import { type SocketMiddlewareToken } from '../override';
import { i18n } from '../i18n';
import '../override/socket-middleware.js';

export type { SocketMiddlewareToken };

export interface ChannelOptions<T extends SocketMiddlewareToken[] | [] = any[]> {
  /**
   * 本 Channel 下所有事件共用的中间件（先于事件级 `mount` 执行）。
   * 仅 `middleware.socket` / `middleware.mixin`。
   *
   * ```ts
   * new Channel({
   *   mount: [payload({ token: rule.string().optional() })],
   * });
   * ```
   */
  mount?: T;
}

export interface ChannelHandlerOptions<
  Props extends object | unknown,
  T extends SocketMiddlewareToken[] | [],
> {
  /**
   * 为 `true` 时不注册该事件（便于按环境开关）。
   *
   * ```ts
   * channel.on('debug.dump', {
   *   disabled: process.env.NODE_ENV === 'production',
   *   action: async (ctx) => { ... },
   * });
   * ```
   */
  disabled?: boolean;
  /**
   * 仅本事件的中间件，常用于 `payload()` 校验。
   * 仅 `middleware.socket` / `middleware.mixin`。
   *
   * ```ts
   * mount: [payload({ text: rule.string().max(2000) })],
   * ```
   */
  mount?: T;
  /**
   * 事件处理函数；`ctx` 类型会合并 Channel / 事件级 `mount` 的 Props。
   * 若挂了 `emit()`，`ctx.send` / `client` / `all` / `room` 的 `send` 会按事件收窄。
   *
   * ```ts
   * action: async (ctx) => {
   *   await ctx.send('chat.ack', { ok: true });
   *   await ctx.room('lobby').send(
   *     'chat.message',
   *     { from: ctx.client.id, text: ctx.payload.text },
   *     { except: ctx.client },
   *   );
   * },
   * ```
   */
  action: (ctx: Channel.Context<Props, T>) => any;
}

export declare namespace Channel {
  export type Interface<
    Props extends object | unknown,
    T extends SocketMiddlewareToken[] | [],
  > = Props & Union2Intersection<Middleware.CollectArrayType<T[number]>>;

  /**
   * 有 `emit()` 契约时，收窄出站 `send`（含 `ctx.send`）；否则保留 `WebsocketContext` 上的宽松发送面。
   */
  export type WithEmitSenders<M extends Record<string, unknown>> = [keyof M] extends [
    never,
  ]
    ? Pick<WebsocketContext, 'client' | 'all' | 'room' | 'send'>
    : {
        send: EmitPointSendOverloads<M>;
        client: Omit<WebsocketClient, 'send'> & EmitPointSender<M>;
        all: Omit<WebsocketAll, 'send'> & EmitBroadcastSender<M>;
        room(name: string): Omit<WebsocketRoom, 'send'> & EmitBroadcastSender<M>;
      };

  /**
   * 事件 mount 的 Props 覆盖同名上下文字段（如 `payload`）；
   * `__emitContracts` 不出现在业务 ctx 上。
   */
  export type Context<
    Props extends object | unknown,
    T extends SocketMiddlewareToken[] | [],
  > = Omit<
    WebsocketContext,
    'client' | 'all' | 'room' | 'send' | keyof Interface<Props, T> | '__emitContracts'
  > &
    Omit<Interface<Props, T>, '__emitContracts'> &
    WithEmitSenders<CollectEmitMap<Interface<Props, T>>>;
}

/**
 * WebSocket 事件处理器集合（代码组织单位，≠ 运行时 `room`）。
 *
 * 一个文件导出一个 `Channel`，用 `channels()` 挂到 `WebsocketApp.mount`，类似 `routers()`。
 *
 * ```ts
 * // src/channels/chat.channel.ts
 * import { Channel, emit, payload } from '@aomex/websocket';
 * import { rule } from '@aomex/common';
 *
 * export const channel = new Channel();
 *
 * channel.on('room.join', {
 *   mount: [payload({ roomId: rule.string() })],
 *   action: async (ctx) => {
 *     await ctx.client.join(ctx.payload.roomId);
 *     await ctx.room(ctx.payload.roomId).send('room.joined', { id: ctx.client.id });
 *   },
 * });
 *
 * channel.on('chat.send', {
 *   mount: [
 *     payload({
 *       roomId: rule.string(),
 *       text: rule.string().max(2000),
 *     }),
 *     emit({
 *       event: 'chat.message',
 *       data: { from: rule.string(), text: rule.string() },
 *     }),
 *   ],
 *   action: async (ctx) => {
 *     await ctx.room(ctx.payload.roomId).send(
 *       'chat.message',
 *       { from: ctx.client.id, text: ctx.payload.text },
 *       { except: ctx.client },
 *     );
 *   },
 * });
 * ```
 *
 * 客户端帧约定：`{ "event": "chat.send", "data": { ... } }`。
 */
export class Channel<
  T extends SocketMiddlewareToken[] | [] = any[],
  Props extends object | unknown = WebsocketContext.Props &
    Union2Intersection<Middleware.CollectArrayType<T[number]>>,
> {
  protected readonly middlewareList: SocketMiddlewareToken[];
  protected readonly handlers = new Map<
    string,
    { middlewareList: SocketMiddlewareToken[]; action: (ctx: any) => any }
  >();

  /**
   * @param opts.mount 本 Channel 全局中间件
   *
   * ```ts
   * export const channel = new Channel({
   *   mount: [requireLogin()],
   * });
   * ```
   */
  constructor(protected readonly opts: ChannelOptions<T> = {}) {
    this.middlewareList = opts.mount || [];
  }

  /**
   * 注册入站事件。同一 `Channel` 内及跨 Channel 事件名均不可重复。
   *
   * @param event 事件名，对应客户端帧的 `event` 字段
   * @param options `mount` + `action`；可用 `disabled` 跳过注册
   *
   * ```ts
   * channel.on('ping', {
   *   action: async (ctx) => {
   *     await ctx.send('pong', Date.now());
   *   },
   * });
   * ```
   */
  public on<M extends SocketMiddlewareToken[] | []>(
    event: string,
    options: ChannelHandlerOptions<Props, M>,
  ): void {
    if (typeof event !== 'string' || event.length === 0 || event.includes('\0')) {
      throw new Error(i18n.t('invalid_event_name'));
    }
    if (options.disabled === true) return;
    if (this.handlers.has(event)) {
      throw new Error(i18n.t('duplicate_event', { event }));
    }
    this.handlers.set(event, {
      middlewareList: options.mount || [],
      action: options.action,
    });
  }

  /** 收集本 Channel 的事件 → compose 链（供 `channels()` 合并） */
  protected collect(): Map<string, ComposeFn> {
    const map = new Map<string, ComposeFn>();
    for (const [event, handler] of this.handlers) {
      const list = [
        ...this.middlewareList,
        ...handler.middlewareList,
        middleware.socket((ctx, _) => handler.action(ctx as any)),
      ];
      map.set(event, compose(list));
    }
    return map;
  }
}
