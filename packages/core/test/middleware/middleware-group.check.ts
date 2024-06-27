import { type TypeEqual, expectType } from 'ts-expect';
import { MiddlewareChain, MixinMiddlewareChain, mdchain, middleware } from '../../src';

// 分割结果检测
{
  const c1 = mdchain.mixin;
  const c2 = c1['split']();
  expectType<TypeEqual<MixinMiddlewareChain, typeof c2>>(true);
}

// 泛型传递
{
  type type1 = { test1: 'a' };
  type type2 = { test2: 'b' };
  const md1 = middleware.mixin<type1>(() => {});
  const md2 = middleware.mixin<type2>(() => {});
  const c = mdchain.mixin.mount(md1).mount(md2).mount(null);
  expectType<TypeEqual<object & type1 & type2, MiddlewareChain.Infer<typeof c>>>(true);
}
