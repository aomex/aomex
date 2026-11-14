import { expectType, type TypeEqual } from 'ts-expect';
import type {
  CallSignatures,
  IsUnion,
  NonReadonly,
  Prettify,
  PromisifyFunction,
  Union2Intersection,
} from '../src';

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

// IsUnion
{
  expectType<TypeEqual<false, IsUnion<'a'>>>(true);
  expectType<TypeEqual<true, IsUnion<'a' | 'b'>>>(true);
  expectType<TypeEqual<false, IsUnion<string>>>(true);
}

// CallSignatures / PromisifyFunction（重载保留）
{
  type Overloaded = {
    (x: string): string;
    (x: number): number;
    (x: boolean): boolean;
  };

  type Sig = CallSignatures<Overloaded>;
  expectType<
    TypeEqual<
      true,
      Sig extends
        ((x: string) => string) | ((x: number) => number) | ((x: boolean) => boolean)
        ? true
        : false
    >
  >(true);

  type PF = PromisifyFunction<Overloaded>;
  expectType<
    TypeEqual<
      true,
      PF extends {
        (x: string): Promise<string>;
        (x: number): Promise<number>;
        (x: boolean): Promise<boolean>;
      }
        ? true
        : false
    >
  >(true);

  expectType<
    TypeEqual<(a: number) => Promise<string>, PromisifyFunction<(a: number) => string>>
  >(true);
  expectType<TypeEqual<() => Promise<'x'>, PromisifyFunction<() => Promise<'x'>>>>(true);
  expectType<TypeEqual<number, PromisifyFunction<number>>>(true);

  // 已返回 Promise 的泛型方法：原样保留（不经 CallSignatures 展开）
  type WB = <T>(cb: () => Promise<T>) => Promise<T>;
  expectType<TypeEqual<WB, PromisifyFunction<WB>>>(true);
}
