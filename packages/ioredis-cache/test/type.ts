import { expectType, TypeEqual } from 'ts-expect';
import { RedisCache } from '../src';

const cache = new RedisCache({
  redis: {},
});

test('set', () => {
  const result = cache.set('x', 'y');
  expectType<TypeEqual<boolean, Awaited<typeof result>>>(true);
});

test('get', () => {
  const get1 = cache.get('x');
  expectType<
    TypeEqual<string | number | object | boolean | null, Awaited<typeof get1>>
  >(true);

  const get2 = cache.get('x', 20);
  expectType<TypeEqual<number, Awaited<typeof get2>>>(true);

  const get3 = cache.get('x', 'y');
  expectType<TypeEqual<string, Awaited<typeof get3>>>(true);

  const get4 = cache.get<string>('x');
  expectType<TypeEqual<string | null, Awaited<typeof get4>>>(true);
});

test('add', () => {
  const result = cache.add('x', 'y');
  expectType<TypeEqual<boolean, Awaited<typeof result>>>(true);
});

test('exists', () => {
  const result = cache.exists('x');
  expectType<TypeEqual<boolean, Awaited<typeof result>>>(true);
});

test('getOrSet', () => {
  const result = cache.getOrSet('x', () => 20);
  expectType<TypeEqual<20, Awaited<typeof result>>>(true);
});

test('delete', () => {
  const result = cache.delete('x');
  expectType<TypeEqual<boolean, Awaited<typeof result>>>(true);
});

test('invalid usage', () => {
  cache.get<number>('x', 20);
  cache.getOrSet<number>('x', () => 20);

  // @ts-expect-error
  cache.get<string>('x', 20);
  // @ts-expect-error
  cache.get<number>('x', true);
  // @ts-expect-error
  cache.getOrSet<number>('x', () => '20');
});
