import { describe, expect, test, vitest } from 'vitest';
import { MixinMiddleware, middleware, type Next, compose, Middleware } from '../../src';

test('包含一个函数', () => {
  const fn = () => {};
  const mdx = middleware.mixin(fn);
  expect(mdx['fn']).toBe(fn);
});

describe('skip', () => {
  test('继承mixin中间件', () => {
    const md = middleware.mixin(() => {}).skip(() => true);
    expect(md).toBeInstanceOf(MixinMiddleware);
  });

  test('运行时跳过中间件', async () => {
    const spy = vitest.fn((_, next: Next) => {
      return next();
    });

    const md = middleware.mixin(spy);

    await compose([md.skip(() => true)])({});
    expect(spy).toHaveBeenCalledTimes(0);

    await compose([md.skip(() => false)])({});
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

test('注册时可传递多个参数', () => {
  const key = Math.random().toString();
  class MyMiddleware extends Middleware {
    public readonly args: any[];
    constructor(...args: any[]) {
      super(() => {});
      this.args = args;
    }
  }

  // @ts-expect-error
  Middleware.register(key, MyMiddleware);
  // @ts-expect-error
  const md = middleware[key](1, 2, 3, 4, 5) as MyMiddleware;
  expect(md.args).toStrictEqual([1, 2, 3, 4, 5]);
});
