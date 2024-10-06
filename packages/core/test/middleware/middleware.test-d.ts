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
    TypeEqual<{ readonly test1: 'a'; test2: boolean }, Middleware.Infer<typeof mdx>>
  >(true);
}

// skip返回值
{
  const md1 = middleware.mixin<{ test: string }>(() => {});
  const md2 = md1.skip(() => true);
  expectType<TypeEqual<MixinMiddleware<{ test: string }>, typeof md2>>(true);
  expectType<TypeEqual<Middleware<object>, typeof md2>>(false);
}

// skip上下文
{
  const md1 = middleware.mixin<{ test: string }>(() => {});
  md1.skip((ctx) => {
    expectType<TypeEqual<object, typeof ctx>>(true);
    return true;
  });

  class MyMiddleWare<Props extends object> extends Middleware<Props> {
    public declare _contextType: { foo: 'bar' };
  }

  const md2 = new MyMiddleWare(() => {});
  md2.skip((ctx) => {
    expectType<TypeEqual<{ foo: 'bar' }, typeof ctx>>(true);
    return true;
  });
}
