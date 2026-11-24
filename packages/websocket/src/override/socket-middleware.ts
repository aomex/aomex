import { Middleware, MixinMiddleware, type Next } from '@aomex/common';
import type { NonReadonly } from '@aomex/internal-tools';
import type { WebsocketContext } from '../core/context';
import type { AsyncAPI } from '@aomex/common';

export type SocketMiddlewareToken<P extends object = object> =
  SocketMiddleware<P> | MixinMiddleware<P>;

declare module '@aomex/common' {
  export interface MiddlewarePlatform<Deps extends object = object> {
    readonly socket: <Props extends object = object>(
      fn:
        | SocketMiddlewareArguments<Middleware.MergeDeps<Props, Deps>>['fn']
        | SocketMiddlewareArguments<Middleware.MergeDeps<Props, Deps>>,
    ) => object extends Deps
      ? SocketMiddleware<Props>
      : SocketMiddleware<Props> & {
          _contextType: Middleware.WithDeps<WebsocketContext, Deps>;
        };
  }
}

/**
 * 单个入站事件扫描时的注入上下文（对齐 OpenAPI `onMethod` 的 `methodItem`）。
 * channel / message / operation 骨架由生成器建好；中间件只填鸭。
 */
export interface AsyncApiEventContext {
  document: AsyncAPI.Document;
  /** 当前正在扫描的入站事件名（`Channel.on`） */
  event: string;
  /** 入站 channel 骨架 */
  channel: AsyncAPI.ChannelObject;
  /** 入站 message 骨架（`components.messages[event]`） */
  message: AsyncAPI.MessageObject;
  /** 入站 `action: receive` 的 operation 骨架 */
  operation: AsyncAPI.OperationObject;
  /**
   * 声明一条出站 send（对齐 `response` 往 `methodItem.responses` 塞状态码）。
   * 结构由本方法创建；`fill` 只改 message / operation 字段。
   */
  addSend(
    event: string,
    fill?: (message: AsyncAPI.MessageObject, operation: AsyncAPI.OperationObject) => void,
  ): void;
}

/**
 * AsyncAPI 注入点（对齐 Web 中间件的 `openapi()`）。
 * 生成器遍历 `Channel.on` 时按中间件链调用；中间件只填鸭，不拼凑全量结构。
 */
export interface AsyncApiInjector {
  onDocument?: (document: AsyncAPI.Document) => void;
  postDocument?: AsyncApiInjector['onDocument'];

  /**
   * 处理某个入站事件时的注入。
   * - `payload`：填入站 `message.payload`
   * - `emit`：经 `addSend` 声明出站 message / operation
   */
  onEvent?: (ctx: AsyncApiEventContext) => void;
  /** 倒序调用，供外层中间件收口（对齐 OpenAPI 的 `postMethod`） */
  postEvent?: AsyncApiInjector['onEvent'];
}

interface SocketMiddlewareArguments<T extends object> {
  fn: (ctx: NonReadonly<T> & WebsocketContext, next: Next) => any;
  asyncapi?: AsyncApiInjector;
}

/**
 * WebSocket / Channel 专用中间件；`WebsocketApp.mount` / `Channel.mount` 仅允许本类或 `mixin`。
 */
export class SocketMiddleware<Props extends object = object> extends Middleware<Props> {
  declare public _contextType: WebsocketContext;
  declare protected _socket_middleware_: 'socket-middleware';
  private readonly asyncapiInjector: AsyncApiInjector;

  constructor(
    args: SocketMiddlewareArguments<Props>['fn'] | SocketMiddlewareArguments<Props>,
  ) {
    const { fn, asyncapi = {} } =
      typeof args === 'function'
        ? ({ fn: args } satisfies SocketMiddlewareArguments<Props>)
        : args;
    super(fn);
    this.asyncapiInjector = asyncapi;
  }

  protected asyncapi(): AsyncApiInjector {
    return this.asyncapiInjector;
  }
}

Middleware.register('socket', SocketMiddleware);
