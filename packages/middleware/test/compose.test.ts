import { test } from 'vitest';
import { chain, compose, middleware, Next } from '../src';

test('input chain or middleware', async () => {
  const spyLog = vitest.spyOn(console, 'log');
  spyLog.mockImplementation(() => {});
  const m1 = middleware.pure((_, next) => {
    console.log('');
    return next();
  });
  await compose([m1, chain.pure.mount(m1)])({});
  expect(spyLog).toBeCalledTimes(2);
  spyLog.mockRestore();
});

test('run middleware step by step', async () => {
  let msg = '';
  const m1 = middleware.pure((_, next) => {
    msg += 'm1';
    return next();
  });
  const m2 = middleware.pure((_, next) => {
    msg += 'm2';
    return next();
  });
  await compose([m1, m2])({});
  expect(msg).toBe('m1m2');
});

test('reverse middleware after latest `next()` called', async () => {
  let msg = '';
  const m1 = middleware.pure(async (_, next) => {
    msg += 'm1';
    await next();
    msg += 'w1';
  });
  const m2 = middleware.pure(async (_, next) => {
    msg += 'm2';
    await next();
    msg += 'w2';
  });
  await compose([m1, m2])({});
  expect(msg).toBe('m1m2w2w1');
});

test('interrupt rest middleware if `next()` is not called', async () => {
  let msg = '';
  const m1 = middleware.pure(async (_, next) => {
    msg += 'm1';
    await next();
    msg += 'w1';
  });
  const m2 = middleware.pure(async (_, _next) => {
    msg += 'm2';
    // no next()
  });
  const m3 = middleware.pure(async (_, next) => {
    msg += 'm3';
    await next();
    msg += 'w3';
  });
  await compose([m1, m2, m3])({});
  expect(msg).toBe('m1m2w1');
});

test('next() can not called multiple times', async () => {
  const m1 = middleware.pure(async (_, next) => {
    await next();
    await next();
  });
  await expect(compose([m1])({})).rejects.toThrowError();
});

test('compose fn is middleware-like', async () => {
  let msg = '';
  const m1 = middleware.pure(async (_, next) => {
    msg += 'm1';
    await next();
    msg += 'w1';
  });
  const callback: Next = async () => {
    msg += 'm2';
  };
  await compose([m1])({}, callback);
  expect(msg).toBe('m1m2w1');
});
