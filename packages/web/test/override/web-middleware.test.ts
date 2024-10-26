import { expect, test } from 'vitest';
import { WebMiddleware } from '../../src';
import { middleware } from '@aomex/common';

test('文档', () => {
  class My extends WebMiddleware {}
  const my = new My(() => {});
  expect(my['openapi']()).toMatchInlineSnapshot(`{}`);
});

test('快捷方式', () => {
  expect(middleware.web(() => {})).toBeInstanceOf(WebMiddleware);
});
