import { type TypeEqual, expectType } from 'ts-expect';
import { CacheKey } from '../src/cache-key';
import { Caching } from '../src/caching';

let caching!: Caching;
const cacheKey = new CacheKey().key('foo', 1);

// get
{
  const result1 = await caching.get('');
  expectType<TypeEqual<Caching.Types | null, typeof result1>>(true);

  const result2 = await caching.get('', 1);
  expectType<TypeEqual<number, typeof result2>>(true);

  const result3 = await caching.get<string>('');
  expectType<TypeEqual<string | null, typeof result3>>(true);

  const result4 = await caching.get(cacheKey);
  expectType<TypeEqual<Caching.Types | null, typeof result4>>(true);

  const result5 = await caching.get(cacheKey, 1);
  expectType<TypeEqual<number, typeof result5>>(true);
}

// getAndDelete
{
  const result1 = await caching.getAndDelete('');
  expectType<TypeEqual<Caching.Types | null, typeof result1>>(true);

  const result2 = await caching.getAndDelete('', 1);
  expectType<TypeEqual<number, typeof result2>>(true);

  const result3 = await caching.getAndDelete<string>('');
  expectType<TypeEqual<string | null, typeof result3>>(true);

  const result4 = await caching.getAndDelete(cacheKey);
  expectType<TypeEqual<Caching.Types | null, typeof result4>>(true);

  const result5 = await caching.getAndDelete(cacheKey, 1);
  expectType<TypeEqual<number, typeof result5>>(true);

  // @ts-expect-error
  await caching.getAndDelete(1);
}

// set
{
  expectType<boolean>(await caching.set('', ''));
  await caching.set('', 1);
  await caching.set('', {});
  await caching.set('', []);
  await caching.set('', false);
  await caching.set('', '', 100);
  await caching.set('', '', '1 day');
  await caching.set('', '', '30m');
  await caching.set('', '', '1.5 hours');
  await caching.set('', '', '500ms');
  await caching.set(cacheKey, 'v');
  await caching.set(cacheKey, 'v', 100);
  await caching.set(cacheKey, 'v', '1 week');
  // @ts-expect-error 无单位的数字字符串不是 DurationInput
  await caching.set('', '', '100');
  // @ts-expect-error
  await caching.set('', '', 'abc');
  // @ts-expect-error
  await caching.set('', '', true);
  // @ts-expect-error
  await caching.set(1, '');
}

// add
{
  expectType<boolean>(await caching.setNX('', ''));
  await caching.setNX('', 1);
  await caching.setNX('', {});
  await caching.setNX('', []);
  await caching.setNX('', false);
  await caching.setNX('', '', 100);
  await caching.setNX('', '', '20 seconds');
  await caching.setNX(cacheKey, 'v');
  await caching.setNX(cacheKey, 'v', '1 minute');
  // @ts-expect-error
  await caching.setNX('', '', '100');
  // @ts-expect-error
  await caching.setNX('', '', false);
}

// delete
{
  expectType<boolean>(await caching.delete(''));
  expectType<boolean>(await caching.delete(cacheKey));
  // @ts-expect-error
  await caching.delete('', '');
}

// deleteAll
{
  expectType<boolean>(await caching.deleteAll());
  // @ts-expect-error
  await caching.deleteAll('');
}

// exists
{
  expectType<boolean>(await caching.exists(''));
  expectType<boolean>(await caching.exists(cacheKey));
}

// increase
{
  const result = await caching.increment('a');
  expectType<TypeEqual<number, typeof result>>(true);
  expectType<TypeEqual<number, Awaited<ReturnType<typeof caching.increment>>>>(true);
  await caching.increment(cacheKey);
}

// decrease
{
  const result = await caching.decrement('a');
  expectType<TypeEqual<number, typeof result>>(true);
  await caching.decrement(cacheKey);
}

// expires
{
  const result = await caching.expire('', 20);
  expectType<TypeEqual<boolean, typeof result>>(true);
  await caching.expire(cacheKey, 20);
  await caching.expire('', '1 minute');
  await caching.expire(cacheKey, '2 months');
  // @ts-expect-error
  await caching.expire('', '100');
  // @ts-expect-error
  await caching.expire('', true);
  // @ts-expect-error duration 必填
  await caching.expire('');
}

// ttl / leftPush / rightPop 接受 CacheKey
{
  await caching.ttl(cacheKey);
  await caching.leftPush(cacheKey, 'a');
  await caching.rightPop(cacheKey);
}

// singleFlight
{
  const r1 = await caching.singleFlight('k', async (): Promise<string> => 'x');
  expectType<TypeEqual<string, typeof r1>>(true);

  const r2 = await caching.singleFlight('k', async () => 1 as const);
  expectType<TypeEqual<1, typeof r2>>(true);

  const r3 = await caching.singleFlight('k', async () => null);
  expectType<TypeEqual<null, typeof r3>>(true);

  const r4 = await caching.singleFlight(cacheKey, async () => ({ a: 1 }));
  expectType<TypeEqual<{ a: number }, typeof r4>>(true);

  const r5 = await caching.singleFlight('k', async (): Promise<string | null> => 'a');
  expectType<TypeEqual<string | null, typeof r5>>(true);

  const r6 = await caching.singleFlight('k', async () => 'literal');
  expectType<TypeEqual<'literal', typeof r6>>(true);

  // @ts-expect-error key 必须是 Caching.Key
  await caching.singleFlight(1, async () => 'x');

  // @ts-expect-error factory 必须返回 Promise
  await caching.singleFlight('k', () => 'x');

  // @ts-expect-error 返回值须为 Caching.Types | null
  await caching.singleFlight('k', async () => undefined);

  // @ts-expect-error 缺少 factory
  await caching.singleFlight('k');
}

// 手动指定类型
{
  await caching.get<object | string>('foo');
  await caching.get<any[] | string>('foo');
  await caching.get<string[] | string>('foo');
  await caching.get<File[] | string>('foo');
  await caching.get<unknown[] | string>('foo');
  await caching.get<object>('foo');
}
