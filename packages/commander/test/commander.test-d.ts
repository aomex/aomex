import { middleware } from '@aomex/core';
import { Commander } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';
import { ConsoleApp, type ConsoleContext } from '@aomex/console';

// 创建实例
{
  new Commander();
  new Commander({});
  new Commander({ prefix: '/' });
  new Commander({ mount: [] });
  new Commander({ mount: [middleware.console(() => {})] });
  // @ts-expect-error
  new Commander({ mount: {} });
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
declare module '@aomex/console' {
  namespace ConsoleApp {
    type T = ConsoleApp.Infer<typeof app>;
    interface Props extends T {}
  }
}
const app = new ConsoleApp({
  mount: [
    middleware.console<{ abcde: boolean }>(() => {}),
    middleware.console<{ foo?: string }>(() => {}),
  ],
});
{
  const commander = new Commander({
    mount: [middleware.console<{ x: { y: 'z' } }>(() => {})],
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
      expectType<boolean>(ctx.abcde);
      expectType<string | undefined>(ctx.foo);
    },
  });

  commander.create('', {
    mount: [middleware.console(() => {}), middleware.mixin(() => {})],
    action: () => {},
  });

  commander.create('', {
    // @ts-expect-error
    mount: [middleware.web(() => {})],
    action: () => {},
  });

  commander.create('', {
    // @ts-expect-error
    mount: [middleware.web(() => {})],
    action: () => {},
  });
}

// Data Transfer Object (DTO)
{
  const commander = new Commander({
    mount: [middleware.console<{ x: { y: 'z' } }>(() => {})],
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
