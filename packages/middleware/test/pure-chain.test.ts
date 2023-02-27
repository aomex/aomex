import { test } from 'vitest';
import { Chain, chain, middleware, PureChain } from '../src';

const m1 = middleware.pure(() => {});
const m2 = middleware.pure(() => {});

test('create pure chain', () => {
  expect(chain.pure).toBeInstanceOf(PureChain);
});

test('mount middleware', () => {
  const c1 = chain.pure.mount(m1).mount(m2);
  expect(c1).toBeInstanceOf(PureChain);

  const list = Chain.flatten(c1);
  expect(list).toHaveLength(2);
  expect(list[0]).toBe(m1);
  expect(list[1]).toBe(m2);
});

test('[immutable] mount() method returning a new instance every time', () => {
  const c1 = chain.pure;
  const c2 = c1.mount(m1);
  const c3 = c2.mount(m1).mount(m2);
  expect(c1).not.toBe(c2);
  expect(c2).not.toBe(c3);
  expect(c1).not.toBe(c3);
  expect(Chain.flatten(c1)).toHaveLength(0);
  expect(Chain.flatten(c2)).toHaveLength(1);
  expect(Chain.flatten(c3)).toHaveLength(3);
});
