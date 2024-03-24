import { expect, test } from 'vitest';
import { middleware } from '../../src';

test('包含一个函数', () => {
  const fn = () => {};
  const mdx = middleware.mixin(fn);
  expect(mdx['fn']).toBe(fn);
});
