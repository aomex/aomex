import { test } from 'vitest';
import { middleware, PureMiddleware } from '../src';

test('create pure middleware', () => {
  const pure = middleware.pure(() => {});
  expect(pure).toBeInstanceOf(PureMiddleware);
});
