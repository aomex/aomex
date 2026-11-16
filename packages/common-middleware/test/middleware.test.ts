import { describe, expect, test, vitest } from 'vitest';
import { MixinMiddleware, middleware, type Next, compose, Middleware } from '../src';

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

  test('直接传boolean跳过中间件', async () => {
    const spy = vitest.fn((_, next: Next) => {
      return next();
    });

    const md = middleware.mixin(spy);

    await compose([md.skip(true)])({});
    expect(spy).toHaveBeenCalledTimes(0);

    await compose([md.skip(false)])({});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('异步判断函数', async () => {
    const spy = vitest.fn((_, next: Next) => {
      return next();
    });

    const md = middleware.mixin(spy);

    await compose([md.skip(async () => true)])({});
    expect(spy).toHaveBeenCalledTimes(0);

    await compose([md.skip(async () => false)])({});
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

describe('dependsOn', () => {
  test('返回同一 middleware 引用并可链式', () => {
    const md = middleware.mixin(() => {});
    expect(middleware.dependsOn(md)).toBe(middleware);
    expect(middleware.dependsOn(md).dependsOn(md)).toBe(middleware);
  });

  test('不执行被 dependsOn 的中间件', async () => {
    const otherSpy = vitest.fn((_, next: Next) => next());
    const fnSpy = vitest.fn((_, next: Next) => next());
    const other = middleware.mixin(otherSpy);
    const md = middleware.dependsOn(other).mixin(fnSpy);

    await compose([md])({});
    expect(otherSpy).toHaveBeenCalledTimes(0);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  test('工厂入参不会被调用', async () => {
    const factory = vitest.fn(() => middleware.mixin(() => {}));
    const fnSpy = vitest.fn((_, next: Next) => next());
    const md = middleware.dependsOn(factory).mixin(fnSpy);

    await compose([md])({});
    expect(factory).toHaveBeenCalledTimes(0);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  test('async 工厂入参不会被调用', async () => {
    const factory = vitest.fn(async () => middleware.mixin(() => {}));
    const fnSpy = vitest.fn((_, next: Next) => next());
    const md = middleware.dependsOn(factory).mixin(fnSpy);

    await compose([md])({});
    expect(factory).toHaveBeenCalledTimes(0);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });
});
