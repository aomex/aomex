import { type TypeEqual, expectType } from 'ts-expect';
import { CacheKey, Caching } from '../src';

let cache!: Caching;
const cacheKey = CacheKey.key('foo', 1);

// get
{
  const result1 = await cache.get('');
  expectType<TypeEqual<Caching.Types | null, typeof result1>>(true);

  const result2 = await cache.get('', 1);
  expectType<TypeEqual<number, typeof result2>>(true);

  const result3 = await cache.get<string>('');
  expectType<TypeEqual<string | null, typeof result3>>(true);

  const result4 = await cache.get(cacheKey);
  expectType<TypeEqual<Caching.Types | null, typeof result4>>(true);

  const result5 = await cache.get(cacheKey, 1);
  expectType<TypeEqual<number, typeof result5>>(true);
}

// getAndDelete
{
  const result1 = await cache.getAndDelete('');
  expectType<TypeEqual<Caching.Types | null, typeof result1>>(true);

  const result2 = await cache.getAndDelete('', 1);
  expectType<TypeEqual<number, typeof result2>>(true);

  const result3 = await cache.getAndDelete<string>('');
  expectType<TypeEqual<string | null, typeof result3>>(true);

  const result4 = await cache.getAndDelete(cacheKey);
  expectType<TypeEqual<Caching.Types | null, typeof result4>>(true);

  const result5 = await cache.getAndDelete(cacheKey, 1);
  expectType<TypeEqual<number, typeof result5>>(true);

  // @ts-expect-error
  await cache.getAndDelete(1);
}

// set
{
  expectType<boolean>(await cache.set('', ''));
  await cache.set('', 1);
  await cache.set('', {});
  await cache.set('', []);
  await cache.set('', false);
  await cache.set('', '', 100);
  await cache.set('', '', '1 day');
  await cache.set('', '', '30m');
  await cache.set('', '', '1.5 hours');
  await cache.set('', '', '500ms');
  await cache.set(cacheKey, 'v');
  await cache.set(cacheKey, 'v', 100);
  await cache.set(cacheKey, 'v', '1 week');
  // @ts-expect-error 无单位的数字字符串不是 DurationInput
  await cache.set('', '', '100');
  // @ts-expect-error
  await cache.set('', '', 'abc');
  // @ts-expect-error
  await cache.set('', '', true);
  // @ts-expect-error
  await cache.set(1, '');
}

// add
{
  expectType<boolean>(await cache.setNX('', ''));
  await cache.setNX('', 1);
  await cache.setNX('', {});
  await cache.setNX('', []);
  await cache.setNX('', false);
  await cache.setNX('', '', 100);
  await cache.setNX('', '', '20 seconds');
  await cache.setNX(cacheKey, 'v');
  await cache.setNX(cacheKey, 'v', '1 minute');
  // @ts-expect-error
  await cache.setNX('', '', '100');
  // @ts-expect-error
  await cache.setNX('', '', false);
}

// delete
{
  expectType<boolean>(await cache.delete(''));
  expectType<boolean>(await cache.delete(cacheKey));
  // @ts-expect-error
  await cache.delete('', '');
}

// deleteAll
{
  expectType<boolean>(await cache.deleteAll());
  // @ts-expect-error
  await cache.deleteAll('');
}

// exists
{
  expectType<boolean>(await cache.exists(''));
  expectType<boolean>(await cache.exists(cacheKey));
}

// increase
{
  const result = await cache.increment('a');
  expectType<TypeEqual<number, typeof result>>(true);
  expectType<TypeEqual<number, Awaited<ReturnType<typeof cache.increment>>>>(true);
  await cache.increment(cacheKey);
}

// decrease
{
  const result = await cache.decrement('a');
  expectType<TypeEqual<number, typeof result>>(true);
  await cache.decrement(cacheKey);
}

// expires
{
  const result = await cache.expire('', 20);
  expectType<TypeEqual<boolean, typeof result>>(true);
  await cache.expire(cacheKey, 20);
  await cache.expire('', '1 minute');
  await cache.expire(cacheKey, '2 months');
  // @ts-expect-error
  await cache.expire('', '100');
  // @ts-expect-error
  await cache.expire('', true);
  // @ts-expect-error duration 必填
  await cache.expire('');
}

// ttl / leftPush / rightPop 接受 CacheKey
{
  await cache.ttl(cacheKey);
  await cache.leftPush(cacheKey, 'a');
  await cache.rightPop(cacheKey);
}

// singleFlight
{
  const r1 = await cache.singleFlight('k', async (): Promise<string> => 'x');
  expectType<TypeEqual<string, typeof r1>>(true);

  const r2 = await cache.singleFlight('k', async () => 1 as const);
  expectType<TypeEqual<1, typeof r2>>(true);

  const r3 = await cache.singleFlight('k', async () => null);
  expectType<TypeEqual<null, typeof r3>>(true);

  const r4 = await cache.singleFlight(cacheKey, async () => ({ a: 1 }));
  expectType<TypeEqual<{ a: number }, typeof r4>>(true);

  const r5 = await cache.singleFlight('k', async (): Promise<string | null> => 'a');
  expectType<TypeEqual<string | null, typeof r5>>(true);

  const r6 = await cache.singleFlight('k', async () => 'literal');
  expectType<TypeEqual<'literal', typeof r6>>(true);

  // @ts-expect-error key 必须是 Caching.Key
  await cache.singleFlight(1, async () => 'x');

  // @ts-expect-error factory 必须返回 Promise
  await cache.singleFlight('k', () => 'x');

  // @ts-expect-error 返回值须为 Caching.Types | null
  await cache.singleFlight('k', async () => undefined);

  // @ts-expect-error 缺少 factory
  await cache.singleFlight('k');
}

// 手动指定类型
{
  await cache.get<object | string>('foo');
  await cache.get<any[] | string>('foo');
  await cache.get<string[] | string>('foo');
  await cache.get<File[] | string>('foo');
  await cache.get<unknown[] | string>('foo');
  await cache.get<object>('foo');
}

// key / keyHash
{
  expectType<TypeEqual<CacheKey, ReturnType<Caching['key']>>>(true);
  expectType<TypeEqual<CacheKey, ReturnType<Caching['keyHash']>>>(true);
  cache.key('a', 1);
  cache.keyHash('a', 1);
  cache.key();
  // @ts-expect-error
  cache.key(true);
  // @ts-expect-error
  cache.keyHash(false);
  // @ts-expect-error ensureReady 为 protected
  cache.ensureReady;
}
