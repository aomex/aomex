import { expectType, type TypeEqual } from 'ts-expect';
import type { NonReadonly, Union2Intersection } from '../src';

{
  type A = { test: 'abc'; test1: 'cde' };
  type B = { readonly test: 'abc'; test1: 'cde' };
  type C = { readonly test: 'abc'; readonly test1: 'cde' };

  expectType<TypeEqual<A, NonReadonly<A>>>(true);
  expectType<TypeEqual<A, NonReadonly<B>>>(true);
  expectType<TypeEqual<B, NonReadonly<B>>>(false);
  expectType<TypeEqual<A, NonReadonly<C>>>(true);
}

{
  type A = { test1: 'a'; test2: 'b' };
  type B = { test3: 'c'; test4: 'd' };
  expectType<TypeEqual<A & B, Union2Intersection<A | B>>>(true);
}
