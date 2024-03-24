import { expectType, type TypeEqual } from 'ts-expect';
import { type Next, middleware, Middleware, MixinMiddleware } from '../../src';

// 默认类型
{
  const mdx = middleware.mixin((ctx, next) => {
    expectType<object>(ctx);
    expectType<Next>(next);
  });
  expectType<TypeEqual<MixinMiddleware, typeof mdx>>(true);
}

// 泛型
middleware.mixin<{ test1: 'a'; test2: boolean }>((ctx) => {
  expectType<TypeEqual<{ test1: 'a'; test2: boolean }, typeof ctx>>(true);
});

// 只读属性在函数里需转换成可写
{
  interface MyType {
    readonly test1: 'a';
    test2: boolean;
  }
  const mdx = middleware.mixin<MyType>((ctx) => {
    expectType<TypeEqual<{ test1: 'a'; test2: boolean }, typeof ctx>>(true);
  });
  expectType<
    TypeEqual<
      { readonly test1: 'a'; test2: boolean },
      Middleware.Infer<typeof mdx>
    >
  >(true);
}
