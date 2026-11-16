import { expectType, type TypeEqual } from 'ts-expect';
import { type Next, middleware, Middleware, MixinMiddleware } from '../src';

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

  const md3 = md1.skip(true);
  expectType<TypeEqual<MixinMiddleware<{ test: string }>, typeof md3>>(true);
  const md4 = md1.skip(false);
  expectType<TypeEqual<MixinMiddleware<{ test: string }>, typeof md4>>(true);
}

// skip上下文
{
  const md1 = middleware.mixin<{ test: string }>(() => {});
  md1.skip((ctx) => {
    expectType<TypeEqual<object, typeof ctx>>(true);
    return true;
  });
  md1.skip(async (ctx) => {
    expectType<TypeEqual<object, typeof ctx>>(true);
    return false;
  });

  class MyMiddleWare<Props extends object> extends Middleware<Props> {
    declare public _contextType: { foo: 'bar' };
  }

  const md2 = new MyMiddleWare(() => {});
  md2.skip((ctx) => {
    expectType<TypeEqual<{ foo: 'bar' }, typeof ctx>>(true);
    return true;
  });
}

// skip非法入参
{
  const md = middleware.mixin(() => {});
  // @ts-expect-error
  md.skip('yes');
  // @ts-expect-error
  md.skip(1);
  // @ts-expect-error
  md.skip(() => 'yes');
  // @ts-expect-error
  md.skip(async () => 1);
  // @ts-expect-error
  md.skip();
}

// dependsOn：直接传中间件，ctx 含其 Props；Infer 不含 dependsOn 的 Props
{
  const md1 = middleware.mixin<{ user: string }>(() => {});
  const md2 = middleware.dependsOn(md1).mixin((ctx) => {
    expectType<TypeEqual<{ user: string }, typeof ctx>>(true);
  });
  expectType<TypeEqual<object, Middleware.Infer<typeof md2>>>(true);
  expectType<MixinMiddleware<object>>(md2);

  md2.skip((ctx) => {
    // 与类声明交叉后为 object & Deps，用可赋值校验即可
    expectType<{ user: string }>(ctx);
    return true;
  });
}

// dependsOn：工厂
{
  const md1 = middleware.mixin<{ a: number }>(() => {});
  middleware
    .dependsOn(() => md1)
    .mixin((ctx) => {
      expectType<TypeEqual<{ a: number }, typeof ctx>>(true);
    });
  middleware
    .dependsOn((_x: string) => md1)
    .mixin((ctx) => {
      expectType<TypeEqual<{ a: number }, typeof ctx>>(true);
    });
}

// dependsOn：async 工厂
{
  const md1 = middleware.mixin<{ b: boolean }>(() => {});
  middleware
    .dependsOn(async () => md1)
    .mixin((ctx) => {
      expectType<TypeEqual<{ b: boolean }, typeof ctx>>(true);
    });
  middleware
    .dependsOn(async () => Promise.resolve(md1))
    .mixin((ctx) => {
      expectType<TypeEqual<{ b: boolean }, typeof ctx>>(true);
    });
}

// dependsOn：无限链式累积
{
  const md1 = middleware.mixin<{ x: 1 }>(() => {});
  const md2 = middleware.mixin<{ y: 'y' }>(() => {});
  middleware
    .dependsOn(md1)
    .dependsOn(md2)
    .mixin((ctx) => {
      expectType<TypeEqual<{ x: 1; y: 'y' }, typeof ctx>>(true);
    });
}

// dependsOn + 显式泛型
{
  const md1 = middleware.mixin<{ auth: { id: number } }>(() => {});
  const md2 = middleware.dependsOn(md1).mixin<{ extra: number }>((ctx) => {
    expectType<TypeEqual<{ auth: { id: number }; extra: number }, typeof ctx>>(true);
  });
  expectType<TypeEqual<{ extra: number }, Middleware.Infer<typeof md2>>>(true);

  const md3 = md2.skip((ctx) => {
    expectType<{ auth: { id: number } }>(ctx);
    return false;
  });
  expectType<TypeEqual<{ extra: number }, Middleware.Infer<typeof md3>>>(true);

  // 第二次 skip 不再携带 dependsOn 的 Deps
  md3.skip((ctx) => {
    // @ts-expect-error
    ctx.auth;
    return true;
  });
}

// dependsOn：上游 readonly / 全 optional / 空对象
{
  const readonlyMd = middleware.mixin<{ readonly id: number }>(() => {});
  middleware.dependsOn(readonlyMd).mixin((ctx) => {
    expectType<TypeEqual<{ id: number }, typeof ctx>>(true);
  });

  const optionalMd = middleware.mixin<{ name?: string }>(() => {});
  middleware.dependsOn(optionalMd).mixin((ctx) => {
    expectType<{ name?: string }>(ctx);
  });

  const emptyMd = middleware.mixin<{}>(() => {});
  middleware.dependsOn(emptyMd).mixin((ctx) => {
    expectType<object>(ctx);
  });
}

// Middleware.Infer：工厂 / Promise 工厂
{
  const md = middleware.mixin<{ z: string }>(() => {});
  expectType<TypeEqual<{ z: string }, Middleware.Infer<typeof md>>>(true);
  expectType<TypeEqual<{ z: string }, Middleware.Infer<() => typeof md>>>(true);
  expectType<TypeEqual<{ z: string }, Middleware.Infer<() => Promise<typeof md>>>>(true);
  expectType<TypeEqual<never, Middleware.Infer<() => string>>>(true);
}

// dependsOn 非法入参
{
  // @ts-expect-error
  middleware.dependsOn('yes');
  // @ts-expect-error
  middleware.dependsOn(1);
  // @ts-expect-error
  middleware.dependsOn({});
  // @ts-expect-error
  middleware.dependsOn(() => 'yes');
  // @ts-expect-error
  middleware.dependsOn(async () => 1);
  // @ts-expect-error
  middleware.dependsOn();
}

// 不能把 dependsOn 注册成平台
{
  class Fake extends Middleware {
    constructor() {
      super(() => {});
    }
  }
  // @ts-expect-error
  Middleware.register('dependsOn', Fake);
}
