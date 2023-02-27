import { test } from 'vitest';
import {
  chain as origin,
  Chain,
  middleware,
  Middleware,
  ChainPlatform,
  PureMiddleware,
  PureChain,
} from '../src';

// NOTICE: Do not declare global module like this
// declare module '../src' {}

interface MockChainPlatform extends ChainPlatform {
  testMe: TestMeChain;
  testMe2: TestMeChain;
}

const chain = origin as unknown as MockChainPlatform;

class TestMeChain<Props extends object = object> extends Chain<Props> {
  declare mount: {
    <P extends object>(middleware: Middleware<P> | null): TestMeChain<
      Props & P
    >;
  };
}

test('register a chain creator', () => {
  expect(chain.testMe).toBeUndefined();
  Chain.register('testMe' as any, TestMeChain);
  expect(chain.testMe).toBeInstanceOf(TestMeChain);
});

describe('Chain.flatten', () => {
  let m1: Middleware, m2: Middleware;

  beforeAll(() => {
    Chain.register('testMe2' as any, TestMeChain);
    m1 = middleware.pure(() => {});
    m2 = middleware.pure(() => {});
  });

  const expectAllIsMiddleware = (list: Middleware[], length: number) => {
    expect(Array.isArray(list)).toBeTruthy();
    expect(list).toHaveLength(length);
    expect(list.every((item) => item instanceof PureMiddleware));
  };

  test('input null', () => {
    expect(Chain.flatten(null)).toHaveLength(0);
  });

  test('input middleware', () => {
    expectAllIsMiddleware(Chain.flatten(m1), 1);
  });

  test('input chain', () => {
    expectAllIsMiddleware(
      Chain.flatten(chain.testMe2.mount(m1).mount(m2).mount(m1)),
      3,
    );
  });

  test('input array', () => {
    expectAllIsMiddleware(
      Chain.flatten([null, m1, m2, chain.testMe2.mount(m1)]),
      3,
    );
    expectAllIsMiddleware(
      Chain.flatten([
        chain.testMe2.mount(m1),
        chain.testMe2.mount(m1).mount(m2),
      ]),
      3,
    );
  });
});

describe('Chain.createPoint', () => {
  const m1 = middleware.pure(() => {});
  const m2 = middleware.pure(() => {});

  test('create point', () => {
    const c1 = chain.pure.mount(m1).mount(m2).mount(m1);
    const c2 = c1.mount(m1).mount(m2);

    const point = Chain.createSplitPoint(c1);
    expect(point).toBeTypeOf('string');
    expect(Chain.split(c2)).toBe(c2);
    expect(Chain.split(c2, 'random..')).toBe(c2);

    const c3 = Chain.split(c2, point);
    expect(c3).toBeInstanceOf(PureChain);
    expect(c3).not.toBe(c2);
    expect(Chain.flatten(c3)).toHaveLength(2);
  });

  test('get rid of the longest chain with multiple points', () => {
    const c1 = chain.pure.mount(m1).mount(m2).mount(m1);
    const c2 = c1.mount(m1).mount(m2);
    const c3 = c2.mount(m1).mount(m2).mount(m1);
    const p1 = Chain.createSplitPoint(c1);
    const p2 = Chain.createSplitPoint(c2);
    const c4 = Chain.split(c3, [p1, p2]);
    expect(Chain.flatten(c4)).toHaveLength(3);
  });

  test('returning original chain without point', () => {
    const c1 = chain.pure.mount(m1);
    const c2 = c1.mount(m2);
    Chain.createSplitPoint(c1);
    expect(Chain.split(c2)).toBe(c2);
    expect(Chain.split(c2, [])).toBe(c2);
  });
});
