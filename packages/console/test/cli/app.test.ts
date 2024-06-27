import { afterAll, expect, test, vitest } from 'vitest';
import { ConsoleApp } from '../../src';
import { flattenMiddlewareToken, i18n, mdchain, middleware } from '@aomex/core';

let consoleSpy = vitest.spyOn(console, 'error').mockImplementation(() => {});

afterAll(() => {
  consoleSpy.mockReset();
});

test('挂载全局中间件', () => {
  const m1 = middleware.mixin(() => {});
  const m2 = middleware.mixin(() => {});
  const appChain = mdchain.console.mount(m1).mount(m2).mount(m2);

  const app = new ConsoleApp({ mount: appChain });
  expect(app['middlewareList']).toStrictEqual([m1, m2, m2]);
});

test('生成断点', () => {
  const m1 = middleware.mixin(() => {});
  const m2 = middleware.mixin(() => {});
  const m3 = middleware.mixin(() => {});
  const appChain = mdchain.console.mount(m1).mount(m2);

  const app = new ConsoleApp({ mount: appChain });
  const customChain = appChain.mount(m3).mount(m2);
  expect(flattenMiddlewareToken(customChain['split'](app['point']))).toStrictEqual([
    m3,
    m2,
  ]);
});

test('执行指令', async () => {
  const app = new ConsoleApp();
  const code = await app.run('foo');
  expect(code).toBe(1);
});

test('找到指令', async () => {
  const app = new ConsoleApp({
    mount: mdchain.console.mount(
      middleware.console((ctx) => {
        ctx.commandMatched = true;
      }),
    ),
  });
  const code = await app.run('foo');
  expect(code).toBe(0);
});

test('参数从指令获取', async () => {
  const originArgv = process.argv;
  process.argv = ['node', 'bin', 'foo', '--bar', 'baz', '-f', 'k'];

  const spy = vitest.fn();
  const app = new ConsoleApp({
    mount: mdchain.console.mount(
      middleware.console((ctx) => {
        ctx.commandMatched = true;
        spy(...ctx.input.argv);
      }),
    ),
  });
  await app.run();
  expect(spy).toHaveBeenCalledWith('foo', '--bar', 'baz', '-f', 'k');
  process.argv = originArgv;
});

test('深层指令', async () => {
  const app = new ConsoleApp();
  expect(app.level).toBe(0);
  const p1 = app.run('foo');
  expect(app.level).toBe(1);
  app.run('bar');
  expect(app.level).toBe(2);
  app.run('baz');
  expect(app.level).toBe(3);
  await p1;
  expect(app.level).toBe(0);
});

test('报错日志', async () => {
  const app = new ConsoleApp();
  let msg = '';
  const spy = vitest.spyOn(app, 'log').mockImplementation((err) => {
    msg = err.message;
  });
  await app.run('foo');
  expect(spy).toHaveBeenCalledOnce();
  expect(msg).toMatchInlineSnapshot(`"指令"foo"不存在"`);
});

test('自定义报错回调', async () => {
  const app = new ConsoleApp();
  let msg = '';
  app.on('error', (err) => {
    msg = err.message;
  });
  await app.run('foo');
  expect(msg).toMatchInlineSnapshot(`"指令"foo"不存在"`);
});

test('设置语言', () => {
  new ConsoleApp({ locale: 'zh_CN' });
  expect(i18n.getLocale()).toBe('zh_CN');
  new ConsoleApp({ locale: 'en_US' });
  expect(i18n.getLocale()).toBe('en_US');
});
