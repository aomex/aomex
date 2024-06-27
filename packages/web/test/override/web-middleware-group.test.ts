import { expect, test } from 'vitest';
import { WebMiddlewareChain } from '../../src';
import { mdchain, middleware } from '@aomex/core';

test('快捷方式', () => {
  expect(mdchain.web).toBeInstanceOf(WebMiddlewareChain);
  expect(mdchain.web.mount(middleware.mixin(() => {}))).toBeInstanceOf(
    WebMiddlewareChain,
  );
});
