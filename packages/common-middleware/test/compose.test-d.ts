import { type ComposeFn, compose, middleware } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

// 结果检测
{
  const fn = compose([]);
  expectType<TypeEqual<ComposeFn, typeof fn>>(true);
}

// 传参检测
{
  compose([middleware.mixin(() => {})]);
  // @ts-expect-error
  compose({});
  // @ts-expect-error
  compose(middleware.mixin(() => {}));
  // @ts-expect-error
  compose([{}]);
}
