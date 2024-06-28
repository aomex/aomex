import { type TypeEqual, expectType } from 'ts-expect';
import { ConsoleApp, ConsoleContext } from '../../src';
import { middleware } from '@aomex/core';

const app = new ConsoleApp();

// 挂载
{
  new ConsoleApp({ mount: undefined });
  new ConsoleApp({ mount: [] });
  new ConsoleApp({ mount: [middleware.console(() => {}), middleware.mixin(() => {})] });
  // @ts-expect-error
  new ConsoleApp({ mount: {} });
}

// 事件
{
  app.on('error', (err, ctx, level) => {
    expectType<TypeEqual<Error, typeof err>>(true);
    expectType<TypeEqual<ConsoleContext & ConsoleApp.Props, typeof ctx>>(true);
    expectType<TypeEqual<number, typeof level>>(true);
  });

  // @ts-expect-error
  app.on('error1', () => {});
}

// 执行
{
  app.run();
  app.run('--foo', 'bar');
  // @ts-expect-error
  app.run([]);
}

// 结果
{
  const code = await app.run();
  expectType<TypeEqual<0 | 1, typeof code>>(true);
}
