import { type Next, middleware } from '@aomex/core';
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
