import { expect, test } from 'vitest';
import { mdchain, middleware } from '../../src';

const md1 = middleware.mixin(() => {});
const md2 = middleware.mixin(() => {});
const md3 = middleware.mixin(() => {});
const md4 = middleware.mixin(() => {});

test('挂载中间件', () => {
  const c = mdchain.mixin.mount(md1).mount(md2);
  expect(c['middlewareList']).toStrictEqual([md1, md2]);
});

test('挂载空值', () => {
  const c = mdchain.mixin.mount(md1).mount(null);
  expect(c['middlewareList']).toStrictEqual([md1]);
});

test('挂载组会被拍平为中间件', () => {
  const c1 = mdchain.mixin.mount(md1);
  const c2 = mdchain.mixin.mount(md2).mount(c1);
  expect(c2['middlewareList']).toStrictEqual([md2, md1]);
});

test('每次挂载都会创建新的实例', () => {
  const c1 = mdchain.mixin.mount(md1);
  const c2 = c1.mount(md2);
  const c3 = c1.mount(md2);
  expect(c2).not.toBe(c1);
  expect(c2).not.toBe(c3);
});

test('创建分割点', () => {
  const c1 = mdchain.mixin.mount(md1).mount(md2).mount(md2).mount(md1);
  const p1 = c1['createPoint']();
  expect(p1).toBeTypeOf('string');
});

test('按分割点切出新的组', () => {
  const c1 = mdchain.mixin.mount(md1).mount(md2);
  const p1 = c1['createPoint']();
  const c2 = c1.mount(md3).mount(md4);
  const c3 = c2['split'](p1);
  expect(c3['middlewareList']).toStrictEqual([md3, md4]);
});

test('提供多个分割点时，以最后一个分割点为准', () => {
  const c1 = mdchain.mixin.mount(md1);
  const c2 = c1.mount(md2);
  const c3 = c2.mount(md3).mount(md4);
  const p1 = c2['createPoint']();
  const p2 = c1['createPoint']();
  expect(c3['split'](p2)['middlewareList']).toStrictEqual([md2, md3, md4]);
  expect(c3['split']([p1, p2])['middlewareList']).toStrictEqual([md3, md4]);
});

test('分割点不存在时，返回自身', () => {
  const c1 = mdchain.mixin.mount(md1).mount(md2);
  const c2 = c1['split']('abc');
  expect(c2).toBe(c1);
});
