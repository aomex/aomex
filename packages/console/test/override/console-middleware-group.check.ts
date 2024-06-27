import { mdchain, middleware } from '@aomex/core';
import { expectType, type TypeEqual } from 'ts-expect';
import { ConsoleMiddlewareChain } from '../../src';
import type { Prettify } from '@aomex/internal-tools';

// 初始类型
{
  expectType<ConsoleMiddlewareChain>(mdchain.console);
}

// 泛型
{
  const c = mdchain.console
    .mount(middleware.console<{ test: 'foo' }>(() => {}))
    .mount(middleware.console<{ test1: 'bar' }>(() => {}));
  expectType<TypeEqual<ConsoleMiddlewareChain<object>, typeof c>>(false);
  type Props = typeof c extends ConsoleMiddlewareChain<infer T> ? T : never;
  expectType<TypeEqual<{ test: 'foo'; test1: 'bar' }, Prettify<Props>>>(true);
}

// 支持传递中间件和组
{
  mdchain.console
    .mount(middleware.console(() => {}))
    .mount(middleware.mixin(() => {}))
    .mount(mdchain.console)
    .mount(mdchain.mixin)
    .mount(null);

  // @ts-expect-error
  mdchain.console.mount('123');
  // @ts-expect-error
  mdchain.console.mount(() => {});
}
