import { Middleware, type Next, middleware } from '@aomex/common';
import { expectType, type TypeEqual } from 'ts-expect';
import type { ConsoleContext, ConsoleHelpInjector, ConsoleMiddleware } from '../../src';

// 整体类型
{
  const mdw = middleware.console(() => {});
  expectType<ConsoleMiddleware<object>>(mdw);
}

// 参数
{
  middleware.console((ctx, next) => {
    expectType<TypeEqual<object & ConsoleContext, typeof ctx>>(true);
    expectType<Next>(next);
  });

  middleware.console({
    fn: (ctx, next) => {
      expectType<TypeEqual<object & ConsoleContext, typeof ctx>>(true);
      expectType<Next>(next);
    },
  });
}

// 泛型
{
  middleware.console<{ test: string }>((ctx) => {
    expectType<TypeEqual<ConsoleContext & { test: string }, typeof ctx>>(true);
  });

  const md = middleware.console<{ readonly test?: string }>((ctx) => {
    expectType<TypeEqual<ConsoleContext & { test?: string }, typeof ctx>>(true);
  });

  expectType<TypeEqual<ConsoleMiddleware<{ readonly test?: string }>, typeof md>>(true);
}

// openapi
{
  const mdw = middleware.console(() => {});
  expectType<ConsoleHelpInjector>(mdw['help']());

  middleware.console({
    fn: (ctx, next) => {
      expectType<TypeEqual<object & ConsoleContext, typeof ctx>>(true);
      expectType<Next>(next);
    },
    help: {},
  });
}

// dependsOn：ctx 含上游 Props 与 ConsoleContext，Infer 不含 dependsOn 的 Props
{
  const upstream = middleware.console<{ cmd: string }>(() => {});
  const md = middleware.dependsOn(upstream).console((ctx) => {
    expectType<TypeEqual<ConsoleContext & { cmd: string }, typeof ctx>>(true);
  });
  expectType<TypeEqual<object, Middleware.Infer<typeof md>>>(true);
  expectType<ConsoleMiddleware<object>>(md);

  md.skip((ctx) => {
    expectType<ConsoleContext>(ctx);
    expectType<{ cmd: string }>(ctx);
    return true;
  });

  // 对象形式
  middleware.dependsOn(upstream).console({
    fn: (ctx) => {
      expectType<TypeEqual<ConsoleContext & { cmd: string }, typeof ctx>>(true);
    },
  });

  // 工厂 / async 工厂
  middleware
    .dependsOn(() => upstream)
    .console((ctx) => {
      expectType<{ cmd: string }>(ctx);
    });
  middleware
    .dependsOn(async () => upstream)
    .console((ctx) => {
      expectType<{ cmd: string }>(ctx);
    });

  // 跨平台：dependsOn(mixin) 再 console
  const mixinUpstream = middleware.mixin<{ flag: boolean }>(() => {});
  middleware.dependsOn(mixinUpstream).console((ctx) => {
    expectType<ConsoleContext>(ctx);
    expectType<{ flag: boolean }>(ctx);
  });

  // 链式 + 显式泛型
  const chained = middleware
    .dependsOn(upstream)
    .dependsOn(middleware.console<{ scope: 'a' }>(() => {}))
    .console<{ extra: number }>((ctx) => {
      expectType<
        TypeEqual<ConsoleContext & { cmd: string; scope: 'a'; extra: number }, typeof ctx>
      >(true);
    });
  expectType<TypeEqual<{ extra: number }, Middleware.Infer<typeof chained>>>(true);

  const afterSkip = chained.skip((ctx) => {
    expectType<ConsoleContext>(ctx);
    expectType<{ cmd: string; scope: 'a' }>(ctx);
    return false;
  });

  // 第二次 skip 不再携带 dependsOn 的 Deps
  afterSkip.skip((ctx) => {
    // @ts-expect-error
    ctx.cmd;
    // @ts-expect-error
    ctx.scope;
    return true;
  });
}

// 跨平台：dependsOn(console) 再 mixin
{
  const consoleMd = middleware.console<{ fromConsole: true }>(() => {});
  middleware.dependsOn(consoleMd).mixin((ctx) => {
    expectType<{ fromConsole: true }>(ctx);
  });
}
