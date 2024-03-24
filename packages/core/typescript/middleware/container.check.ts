import { type TypeEqual, expectType } from 'ts-expect';
import { Container, MixinContainer, container, middleware } from '../../src';

// 分割结果检测
{
  const c1 = container.mixin;
  const c2 = c1['split']();
  expectType<TypeEqual<MixinContainer, typeof c2>>(true);
}

// 泛型传递
{
  type type1 = { test1: 'a' };
  type type2 = { test2: 'b' };
  const md1 = middleware.mixin<type1>(() => {});
  const md2 = middleware.mixin<type2>(() => {});
  const c = container.mixin.mount(md1).mount(md2).mount(null);
  expectType<TypeEqual<object & type1 & type2, Container.Infer<typeof c>>>(
    true,
  );
}
