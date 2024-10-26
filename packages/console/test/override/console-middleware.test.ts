import { expect, test } from 'vitest';
import { ConsoleMiddleware } from '../../src';
import { middleware } from '@aomex/common';

test('文档', () => {
  class My extends ConsoleMiddleware {}
  const my = new My(() => {});
  expect(my['help']()).toMatchInlineSnapshot(`{}`);
});

test('快捷方式', () => {
  expect(middleware.console(() => {})).toBeInstanceOf(ConsoleMiddleware);
});
