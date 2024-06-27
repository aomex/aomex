import { expect, test, vitest } from 'vitest';
import { traceMiddleware, type AsyncTraceRecord } from '../src';
import { MixinMiddleware, compose, middleware } from '@aomex/core';

test('中间件', async () => {
  expect(traceMiddleware('label')).toBeInstanceOf(MixinMiddleware);
});

test('向后执行', async () => {
  const spy = vitest.fn();
  const fn = compose([traceMiddleware('label'), middleware.mixin(spy)]);
  await fn({});
  expect(spy).toBeCalledTimes(1);
});

test('获取记录', async () => {
  let snapshot!: AsyncTraceRecord;
  const fn = compose([
    traceMiddleware('label-foo', (record) => {
      snapshot = record;
    }),
  ]);
  await fn({});
  expect(snapshot).toMatchObject({
    label: 'label-foo',
  });
});

test('执行后获得 ctx.asyncTrace.record', async () => {
  const ctx = {};
  let snapshot!: AsyncTraceRecord;
  const fn = compose([
    traceMiddleware('label', (record) => {
      snapshot = record;
    }),
    middleware.mixin((ctx) => {
      expect(ctx).not.toHaveProperty('asyncTrace');
    }),
  ]);
  await fn(ctx);
  expect(ctx).toHaveProperty('asyncTrace', { record: snapshot });
});
