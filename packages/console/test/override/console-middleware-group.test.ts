import { expect, test } from 'vitest';
import { ConsoleMiddlewareChain } from '../../src';
import { mdchain, middleware } from '@aomex/core';

test('快捷方式', () => {
  expect(mdchain.console).toBeInstanceOf(ConsoleMiddlewareChain);
  expect(mdchain.console.mount(middleware.mixin(() => {}))).toBeInstanceOf(
    ConsoleMiddlewareChain,
  );
});
