import { expect, test } from 'vitest';
import { mdchain, flattenMiddlewareToken, middleware } from '../../src';

test('单个中间件', () => {
  const mdw = middleware.mixin(() => {});
  expect(flattenMiddlewareToken(mdw)).toStrictEqual([mdw]);
});

test('中间件数组', () => {
  const mdw = [middleware.mixin(() => {}), middleware.mixin(() => {})];
  expect(flattenMiddlewareToken(mdw)).toStrictEqual(mdw);
});

test('空值', () => {
  expect(flattenMiddlewareToken(null)).toStrictEqual([]);
  expect(flattenMiddlewareToken([null])).toStrictEqual([]);
});

test('空值和中间件组合', () => {
  const mdw = middleware.mixin(() => {});
  expect(flattenMiddlewareToken([null, mdw])).toStrictEqual([mdw]);
});

test('中间件组', () => {
  const md1 = middleware.mixin(() => {});
  const md2 = middleware.mixin(() => {});
  const myChain = mdchain.mixin.mount(md1).mount(md2);
  expect(flattenMiddlewareToken(myChain)).toStrictEqual([md1, md2]);
  expect(flattenMiddlewareToken([null, myChain])).toStrictEqual([md1, md2]);
  expect(flattenMiddlewareToken([null, md1, myChain])).toStrictEqual([md1, md1, md2]);
});
