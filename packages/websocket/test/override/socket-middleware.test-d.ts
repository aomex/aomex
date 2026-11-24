import { Middleware, type Next, middleware } from '@aomex/common';
import { expectType, type TypeEqual } from 'ts-expect';
import {
  Channel,
  SocketMiddleware,
  type AsyncApiEventContext,
  type AsyncApiInjector,
  type SocketMiddlewareToken,
  type WebsocketContext,
} from '../../src';

// 整体类型
{
  const mdw = middleware.socket(() => {});
  expectType<SocketMiddleware<object>>(mdw);
}

// 参数：ctx 为 WebsocketContext
{
  middleware.socket((ctx, next) => {
    expectType<TypeEqual<object & WebsocketContext, typeof ctx>>(true);
    expectType<Next>(next);
    ctx.event;
    ctx.client;
    ctx.rawPayload;
  });

  middleware.socket({
    fn: (ctx, next) => {
      expectType<TypeEqual<object & WebsocketContext, typeof ctx>>(true);
      expectType<Next>(next);
    },
  });
}

// 泛型 Props
{
  middleware.socket<{ userId: string }>((ctx) => {
    expectType<TypeEqual<WebsocketContext & { userId: string }, typeof ctx>>(true);
  });

  const md = middleware.socket<{ readonly role?: string }>((ctx) => {
    expectType<TypeEqual<WebsocketContext & { role?: string }, typeof ctx>>(true);
  });
  expectType<TypeEqual<SocketMiddleware<{ readonly role?: string }>, typeof md>>(true);
}

// asyncapi 注入点（填鸭上下文）
{
  const mdw = middleware.socket(() => {});
  expectType<AsyncApiInjector>(mdw['asyncapi']());

  middleware.socket({
    fn: () => {},
    asyncapi: {
      onEvent(ctx) {
        expectType<AsyncApiEventContext>(ctx);
        ctx.message.payload;
        ctx.addSend('out', (message, operation) => {
          message.description = 'x';
          operation.description = 'x';
        });
      },
    },
  });
}

// dependsOn
{
  const upstream = middleware.socket<{ userId: number }>(() => {});
  const md = middleware.dependsOn(upstream).socket((ctx) => {
    expectType<TypeEqual<WebsocketContext & { userId: number }, typeof ctx>>(true);
  });
  expectType<TypeEqual<object, Middleware.Infer<typeof md>>>(true);
  expectType<SocketMiddleware<object>>(md);
}

// Channel 只接受 socket | mixin
{
  const okSocket = middleware.socket(() => {});
  const okMixin = middleware.mixin(() => {});
  new Channel({ mount: [okSocket, okMixin] });
  new Channel().on('x', {
    mount: [okSocket],
    action: async () => {},
  });

  const web = middleware.web(() => {});
  // @ts-expect-error Channel 不能挂 web 中间件
  new Channel({ mount: [web] });
  // @ts-expect-error
  new Channel().on('y', { mount: [web], action: async () => {} });
}

// Token 联合
{
  type T = SocketMiddlewareToken<{ a: 1 }>;
  expectType<
    TypeEqual<
      SocketMiddleware<{ a: 1 }> | import('@aomex/common').MixinMiddleware<{ a: 1 }>,
      T
    >
  >(true);
}
