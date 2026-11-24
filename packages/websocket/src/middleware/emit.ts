import {
  middleware,
  toDocument,
  type Validator,
  type ValidatorToken,
} from '@aomex/common';
import type { Union2Intersection } from '@aomex/internal-tools';
import type { WebsocketBroadcastOptions } from '../core/client';
import type { SocketMiddleware } from '../override';
import '../override/socket-middleware.js';

/**
 * `emit()` 写入的契约字段（仅类型用，运行时不会出现在业务逻辑里）。
 * 多个 `emit()` 交叉后合并为完整的「事件名 → 载荷」表。
 */
export type EmitContracts<M extends Record<string, unknown>> = {
  readonly __emitContracts: M;
};

export type CollectEmitMap<Props extends object | unknown> = Props extends {
  __emitContracts: infer M;
}
  ? M extends Record<string, unknown>
    ? M
    : {}
  : {};

type EmitPointOverload<E extends string, Data> = [Data] extends [void]
  ? (event: E, data?: undefined) => Promise<void>
  : undefined extends Data
    ? (event: E, data?: Data) => Promise<void>
    : (event: E, data: Data) => Promise<void>;

type EmitBroadcastOverload<E extends string, Data> = [Data] extends [void]
  ? {
      (event: E): Promise<void>;
      (event: E, data?: undefined, options?: WebsocketBroadcastOptions): Promise<void>;
    }
  : undefined extends Data
    ? (event: E, data?: Data, options?: WebsocketBroadcastOptions) => Promise<void>
    : (event: E, data: Data, options?: WebsocketBroadcastOptions) => Promise<void>;

/**
 * 点对点 `send` 重载（`client.send`，无 `except`）。
 */
export type EmitPointSendOverloads<M extends Record<string, unknown>> = [
  keyof M,
] extends [never]
  ? never
  : Union2Intersection<
      {
        [E in keyof M]-?: EmitPointOverload<E & string, M[E]>;
      }[keyof M]
    >;

/**
 * 广播 `send` 重载（`all.send` / `room().send`，可带 `except`）。
 */
export type EmitBroadcastSendOverloads<M extends Record<string, unknown>> = [
  keyof M,
] extends [never]
  ? never
  : Union2Intersection<
      {
        [E in keyof M]-?: EmitBroadcastOverload<E & string, M[E]>;
      }[keyof M]
    >;

export type EmitPointSender<M extends Record<string, unknown>> = [keyof M] extends [never]
  ? never
  : {
      send: EmitPointSendOverloads<M>;
    };

export type EmitBroadcastSender<M extends Record<string, unknown>> = [keyof M] extends [
  never,
]
  ? never
  : {
      send: EmitBroadcastSendOverloads<M>;
    };

export interface EmitOptions<
  Event extends string = string,
  Data extends ValidatorToken | undefined = undefined,
> {
  /** 出站事件名，对应帧里的 `event` */
  event: Event;
  /**
   * 载荷校验器（字段表 / `rule.*` / schema）。省略表示无载荷。
   */
  data?: Data;
  /** 事件说明（文档用，对齐 HTTP `response({ description })`） */
  description?: string;
}

/**
 * 声明可出站事件及其载荷形状（类型约束，运行时空转，对齐 HTTP `response()`）。
 *
 * 挂上后，`ctx.send` / `ctx.client.send` / `ctx.all.send` / `ctx.room().send`
 * 会按事件名收窄 `data`。
 *
 * AsyncAPI：经 `addSend` 声明出站 message（只填鸭；骨架由生成器创建）。
 *
 * ```ts
 * channel.on('chat.send', {
 *   mount: [
 *     payload({ text: rule.string() }),
 *     emit({
 *       event: 'chat.message',
 *       description: '房间内聊天消息',
 *       data: {
 *         from: rule.string(),
 *         text: rule.string(),
 *       },
 *     }),
 *     emit({ event: 'chat.ack', description: '发送确认' }),
 *   ],
 *   action: async (ctx) => {
 *     await ctx.room('lobby').send(
 *       'chat.message',
 *       { from: ctx.client.id, text: ctx.payload.text },
 *       { except: ctx.client },
 *     );
 *     await ctx.send('chat.ack');
 *     // @ts-expect-error 事件未声明
 *     await ctx.send('unknown', {});
 *   },
 * });
 * ```
 */
export function emit<const Event extends string>(
  options: EmitOptions<Event, undefined>,
): SocketMiddleware<EmitContracts<{ [K in Event]: void }>>;
export function emit<const Event extends string, Data extends ValidatorToken>(
  options: EmitOptions<Event, Data> & { data: Data },
): SocketMiddleware<EmitContracts<{ [K in Event]: Validator.Infer<Data> }>>;
export function emit(
  options: EmitOptions,
): SocketMiddleware<EmitContracts<Record<string, unknown>>> {
  return middleware.socket({
    fn: async (_ctx, next) => next(),
    asyncapi: {
      onEvent({ addSend }) {
        addSend(options.event, (message, operation) => {
          if (options.description !== undefined) {
            message.description = options.description;
            operation.description = options.description;
          }
          if (options.data !== undefined) {
            message.payload = {
              schemaFormat: 'application/vnd.oai.openapi;version=3.0.0',
              schema: toDocument(options.data).schema,
            };
          }
        });
      },
    },
  });
}
