import { expectType, type TypeEqual } from 'ts-expect';
import type { NonReadonly, Prettify, Union2Intersection } from '../src';

// NonReadonly
{
  type A = { test: 'abc'; test1: 'cde' };
  type B = { readonly test: 'abc'; test1: 'cde' };
  type C = { readonly test: 'abc'; readonly test1: 'cde' };

  expectType<TypeEqual<A, NonReadonly<A>>>(true);
  expectType<TypeEqual<A, NonReadonly<B>>>(true);
  expectType<TypeEqual<B, NonReadonly<B>>>(false);
  expectType<TypeEqual<A, NonReadonly<C>>>(true);
}

// Union2Intersection
{
  type A = { test1: 'a'; test2: 'b' };
  type B = { test3: 'c'; test4: 'd' };
  expectType<TypeEqual<A & B, Union2Intersection<A | B>>>(true);
}

// Prettify
{
  type A = { test1: 'a'; test2: 'b' };
  type B = { test3: 'c'; test4: 'd' };
  expectType<
    TypeEqual<{ test1: 'a'; test2: 'b'; test3: 'c'; test4: 'd' }, Prettify<A & B>>
  >(true);
}
