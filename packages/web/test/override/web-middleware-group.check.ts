import { mdchain, middleware } from '@aomex/core';
import { expectType, type TypeEqual } from 'ts-expect';
import { WebMiddlewareChain } from '../../src';
import type { Prettify } from '@aomex/internal-tools';

// 初始类型
{
  expectType<WebMiddlewareChain>(mdchain.web);
}

// 泛型
{
  const c = mdchain.web
    .mount(middleware.web<{ test: 'foo' }>(() => {}))
    .mount(middleware.web<{ test1: 'bar' }>(() => {}));
  expectType<TypeEqual<WebMiddlewareChain<object>, typeof c>>(false);
  type Props = typeof c extends WebMiddlewareChain<infer T> ? T : never;
  expectType<TypeEqual<{ test: 'foo'; test1: 'bar' }, Prettify<Props>>>(true);
}

// 支持传递中间件和组
{
  mdchain.web
    .mount(middleware.web(() => {}))
    .mount(middleware.mixin(() => {}))
    .mount(mdchain.web)
    .mount(mdchain.mixin)
    .mount(null);

  // @ts-expect-error
  mdchain.web.mount('123');
  // @ts-expect-error
  mdchain.web.mount(() => {});
}
