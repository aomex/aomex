import { mdchain, middleware } from '@aomex/core';
import { Commander } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';
import type { ConsoleContext } from '@aomex/console';

// 创建实例
{
  new Commander();
  new Commander({});
  new Commander({ prefix: '/' });
  new Commander({ mount: mdchain.console });
  // @ts-expect-error
  new Commander({ mount: mdchain.mixin });
  // @ts-expect-error
  new Commander({ mount: mdchain.web });
  // @ts-expect-error
  new Commander({ mount: middleware.console(() => {}) });
}

// 创建路由
{
  const commander = new Commander();
  commander.create('', {
    action: (ctx) => {
      expectType<ConsoleContext>(ctx);
    },
  });
  // @ts-expect-error
  commander.create('/', {});
}

// 中间件
{
  const commander = new Commander({
    mount: mdchain.console.mount(middleware.console<{ x: { y: 'z' } }>(() => {})),
  });

  commander.create('/', {
    mount: [
      middleware.console<{ a: boolean }>(() => {}),
      middleware.console<{ b: string | undefined }>(() => {}),
    ],
    action: (ctx) => {
      const x = ctx.x;
      expectType<TypeEqual<{ y: 'z' }, typeof x>>(true);
      expectType<boolean>(ctx.a);
      expectType<string | undefined>(ctx.b);
    },
  });

  commander.create('', {
    mount: [
      middleware.console(() => {}),
      middleware.mixin(() => {}),
      mdchain.console,
      mdchain.mixin,
    ],
    action: () => {},
  });

  commander.create('', {
    // @ts-expect-error
    mount: [middleware.web(() => {})],
    action: () => {},
  });

  commander.create('', {
    // @ts-expect-error
    mount: [mdchain.web(() => {})],
    action: () => {},
  });
}

// Data Transfer Object (DTO)
{
  const commander = new Commander({
    mount: mdchain.console.mount(middleware.console<{ x: { y: 'z' } }>(() => {})),
  });

  class Test {
    declare test1: number;
  }

  const dto = commander.create('/', {
    mount: [
      middleware.console<{ a: Test }>(() => {}),
      middleware.console<{ b: string | undefined }>(() => {}),
    ],
    action: () => {},
  });

  expectType<TypeEqual<Test, (typeof dto)['a']>>(true);
  expectType<string | undefined>(dto.b);
}
