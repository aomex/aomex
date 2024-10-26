import { expect, test } from 'vitest';
import { compose, middleware } from '../src';

test('组合所有中间件', () => {
  expect(compose([middleware.mixin(() => {})])).toBeInstanceOf(Function);
});

test('按顺序执行组合', async () => {
  let str = '';
  await compose([
    middleware.mixin(async (_, next) => {
      str += '1';
      await next();
      str += '4';
    }),
    middleware.mixin(async (_, next) => {
      str += '2';
      await next();
      str += '3';
    }),
  ])({});
  expect(str).toBe('1234');
});

test('不可重复执行next函数', async () => {
  const fn = compose([
    middleware.mixin(async (_, next) => {
      await next();
      await next();
    }),
    middleware.mixin(async (_, next) => {
      await next();
    }),
  ]);
  await expect(fn({})).rejects.toThrowError('next()');
});

test('新函数允许传递额外的ctx上下文', async () => {
  const fn = compose([
    middleware.mixin<{ count: number }>(async (ctx, next) => {
      ctx.count += 1;
      return next();
    }),
    middleware.mixin<{ count: number }>(async (_, next) => {
      ctx.count += 10;
      return next();
    }),
  ]);
  const ctx = { count: 0 };
  await fn(ctx);
  expect(ctx.count).toBe(11);
});

test('新函数允许传递额外的next函数', async () => {
  let str = '';
  const fn = compose([
    middleware.mixin(async (_, next) => {
      str += '1';
      await next();
      str += '5';
    }),
    middleware.mixin(async (_, next) => {
      str += '2';
      await next();
      str += '4';
    }),
  ]);
  await fn({}, async () => {
    str += '3';
  });
  expect(str).toBe('12345');
});
