import { type TypeEqual, expectType } from 'ts-expect';
import { CacheKey } from '../src';

{
  const key = new CacheKey();
  expectType<TypeEqual<CacheKey, ReturnType<typeof key.key>>>(true);
  expectType<TypeEqual<CacheKey, ReturnType<typeof key.keyHash>>>(true);
  expectType<TypeEqual<CacheKey, ReturnType<typeof key.toHash>>>(true);

  key.key('a', 1, 'b');
  key.keyHash('a', 1);
  key.keyHash('x');
  key.toHash();

  // @ts-expect-error 不接受 boolean
  key.key(true);
  // @ts-expect-error 不接受 boolean
  key.keyHash(false);
  // @ts-expect-error 不接受 object
  key.keyHash({ a: 1 });
  // @ts-expect-error 不接受数组
  key.key(['a']);
  // @ts-expect-error toHash 无参数
  key.toHash('x');
  // @ts-expect-error 已移除 hash
  key.hash('x');
}

{
  expectType<TypeEqual<never, keyof CacheKey & 'value'>>(true);
  expectType<TypeEqual<never, keyof CacheKey & 'md5'>>(true);
  expectType<TypeEqual<never, keyof CacheKey & 'hash'>>(true);
  expectType<TypeEqual<never, keyof CacheKey & 'toString'>>(true);
  const key = new CacheKey();
  // @ts-expect-error value 为 protected
  key.value;
  // @ts-expect-error md5 为 protected
  key.md5('x');
  // @ts-expect-error toString 为 protected
  key.toString();
}
