import { expect, test } from 'vitest';
import { middleware } from '@aomex/common';
import { SocketMiddleware } from '../../src';
import '../../src/override/socket-middleware.js';

test('middleware.socket 产出 SocketMiddleware', () => {
  const md = middleware.socket(async (_ctx, next) => next());
  expect(md).toBeInstanceOf(SocketMiddleware);
});

test('middleware.socket 对象形式与 asyncapi()', () => {
  const md = middleware.socket({
    fn: async (_ctx, next) => next(),
    asyncapi: {},
  });
  expect(md).toBeInstanceOf(SocketMiddleware);
  expect(md['asyncapi']()).toEqual({});
});

test('skip 仍可用', async () => {
  let ran = false;
  const md = middleware
    .socket(async (_ctx, next) => {
      ran = true;
      return next();
    })
    .skip(true);
  await md['fn']({} as any, async () => {});
  expect(ran).toBe(false);
});
