import { test } from 'vitest';
import { middleware as origin, Middleware, MiddlewarePlatform } from '../src';

// NOTICE: Do not declare global module like this
// declare module '../src' {}

interface MockMiddlewarePlatform extends MiddlewarePlatform {
  readonly testMe: (fn: Middleware.Fn) => TestMiddleware;
}

const middleware = origin as unknown as MockMiddlewarePlatform;

class TestMiddleware extends Middleware {}

test('register a middleware creator', () => {
  expect(middleware.testMe).toBeUndefined();
  Middleware.register('testMe' as any, TestMiddleware);
  expect(middleware.testMe(() => {})).toBeInstanceOf(TestMiddleware);
});
