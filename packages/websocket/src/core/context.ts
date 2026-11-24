import type { WebsocketAll, WebsocketClient, WebsocketRoom } from './client';

export declare namespace WebsocketContext {
  /**
   * 模块扩充点，可挂连接级推断类型：
   *
   * ```ts
   * declare module '@aomex/websocket' {
   *   namespace WebsocketContext {
   *     interface Props {
   *       userId: string;
   *     }
   *   }
   * }
   * ```
   */
  export interface Props {}
}

/**
 * 单条入站事件的处理上下文（不对齐 `WebContext`）。
 * 在 `Channel.on` 的 `action` 里作为 `ctx` 使用。
 *
 * ```ts
 * channel.on('chat.send', {
 *   mount: [payload({ text: rule.string() })],
 *   action: async (ctx) => {
 *     ctx.event;        // 'chat.send'
 *     ctx.payload;      // 校验后的消息体
 *     ctx.rawPayload;   // 原始入站 data（未校验）
 *     ctx.client;       // 当前连接
 *     ctx.all;          // 全体在线广播（句柄，非数组）
 *     await ctx.send('ack', { ok: true }); // 等同 ctx.client.send
 *     ctx.room('lobby').send('chat.message', ctx.payload);
 *   },
 * });
 * ```
 */
export class WebsocketContext {
  /**
   * 经 `payload()` 校验后的消息体。
   * 未挂 `payload()` 时类型为 `unknown`，运行时可能未赋值。
   *
   * ```ts
   * mount: [payload({ text: rule.string() })],
   * action: async (ctx) => {
   *   ctx.payload.text; // string
   * },
   * ```
   */
  declare payload: unknown;

  constructor(
    /**
     * 当前入站事件名（帧里的 `event` 字段）。
     *
     * ```ts
     * ctx.event; // 'chat.send'
     * ```
     */
    public readonly event: string,
    /**
     * 当前连接：回推、进房、踢人、读写 `client.data`。
     *
     * ```ts
     * ctx.client.send('ack', { ok: true });
     * // 或：await ctx.send('ack', { ok: true });
     * ```
     */
    public readonly client: WebsocketClient,
    /**
     * 全体在线广播入口（句柄，不是连接列表）。
     *
     * ```ts
     * await ctx.all.send('broadcast', { text: 'hello all' });
     * ```
     */
    public readonly all: WebsocketAll,
    protected readonly resolveRoom: (name: string) => WebsocketRoom,
    /**
     * 入站帧 `data` 字段的原始值（未校验）。
     *
     * ```ts
     * // 无 payload() 时也可直接用
     * await ctx.send('echo', ctx.rawPayload);
     * ```
     */
    public readonly rawPayload: unknown,
  ) {}

  /**
   * 只推给当前连接（`ctx.client.send` 的快捷写法）。
   *
   * **投递语义：** at-most-once，与 `client.send` 相同。
   *
   * ```ts
   * await ctx.send('chat.ack', { ok: true });
   * ```
   */
  send(event: string, data?: unknown): Promise<void> {
    return this.client.send(event, data);
  }

  /**
   * 按房间名取广播目标（默认含自己；排除自己传 `{ except: ctx.client }`）。
   *
   * ```ts
   * ctx.room('lobby').send('chat.message', {
   *   from: ctx.client.id,
   *   text: 'hi',
   * });
   * ctx.room('lobby').send('chat.message', payload, { except: ctx.client });
   * ```
   */
  room(name: string): WebsocketRoom {
    return this.resolveRoom(name);
  }
}
