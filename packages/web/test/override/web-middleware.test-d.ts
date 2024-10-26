import { type Next, middleware } from '@aomex/common';
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
