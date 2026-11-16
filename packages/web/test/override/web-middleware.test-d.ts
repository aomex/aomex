import { Middleware, type Next, middleware } from '@aomex/common';
import { expectType, type TypeEqual } from 'ts-expect';
import type { OpenApiInjector, WebContext, WebMiddleware } from '../../src';

// 整体类型
{
  const mdw = middleware.web(() => {});
  expectType<WebMiddleware<object>>(mdw);
}

// 参数
{
  middleware.web((ctx, next) => {
    expectType<TypeEqual<object & WebContext, typeof ctx>>(true);
    expectType<Next>(next);
  });

  middleware.web({
    fn: (ctx, next) => {
      expectType<TypeEqual<object & WebContext, typeof ctx>>(true);
      expectType<Next>(next);
    },
  });
}

// 泛型
{
  middleware.web<{ test: string }>((ctx) => {
    expectType<TypeEqual<WebContext & { test: string }, typeof ctx>>(true);
  });

  const md = middleware.web<{ readonly test?: string }>((ctx) => {
    expectType<TypeEqual<WebContext & { test?: string }, typeof ctx>>(true);
  });

  expectType<TypeEqual<WebMiddleware<{ readonly test?: string }>, typeof md>>(true);
}

// openapi
{
  const mdw = middleware.web(() => {});
  expectType<OpenApiInjector>(mdw['openapi']());

  middleware.web({
    fn: (ctx, next) => {
      expectType<TypeEqual<object & WebContext, typeof ctx>>(true);
      expectType<Next>(next);
    },
    openapi: {} as OpenApiInjector,
  });
}

// dependsOn：ctx 含上游 Props 与 WebContext，Infer 不含 dependsOn 的 Props
{
  const upstream = middleware.web<{ userId: number }>(() => {});
  const md = middleware.dependsOn(upstream).web((ctx) => {
    expectType<TypeEqual<WebContext & { userId: number }, typeof ctx>>(true);
  });
  expectType<TypeEqual<object, Middleware.Infer<typeof md>>>(true);
  expectType<WebMiddleware<object>>(md);

  md.skip((ctx) => {
    expectType<WebContext>(ctx);
    expectType<{ userId: number }>(ctx);
    return true;
  });

  // 对象形式
  middleware.dependsOn(upstream).web({
    fn: (ctx) => {
      expectType<TypeEqual<WebContext & { userId: number }, typeof ctx>>(true);
    },
  });

  // 工厂 / async 工厂
  middleware
    .dependsOn(() => upstream)
    .web((ctx) => {
      expectType<{ userId: number }>(ctx);
    });
  middleware
    .dependsOn(async () => upstream)
    .web((ctx) => {
      expectType<{ userId: number }>(ctx);
    });

  // 跨平台：dependsOn(mixin) 再 web；dependsOn(web) 再 mixin
  const mixinUpstream = middleware.mixin<{ token: string }>(() => {});
  middleware.dependsOn(mixinUpstream).web((ctx) => {
    expectType<WebContext>(ctx);
    expectType<{ token: string }>(ctx);
  });
  middleware.dependsOn(upstream).mixin((ctx) => {
    expectType<{ userId: number }>(ctx);
  });

  const chained = middleware
    .dependsOn(upstream)
    .dependsOn(middleware.web<{ role: string }>(() => {}))
    .web<{ extra: boolean }>((ctx) => {
      expectType<
        TypeEqual<
          WebContext & { userId: number; role: string; extra: boolean },
          typeof ctx
        >
      >(true);
    });

  const afterSkip = chained.skip((ctx) => {
    expectType<WebContext>(ctx);
    expectType<{ userId: number; role: string }>(ctx);
    return false;
  });

  // 第二次 skip 不再携带 dependsOn 的 Deps
  afterSkip.skip((ctx) => {
    // @ts-expect-error
    ctx.userId;
    // @ts-expect-error
    ctx.role;
    return true;
  });
}
