import { type TypeEqual, expectType } from 'ts-expect';
import { Caching } from '../src/caching';

let caching!: Caching;

// get
{
  const result1 = await caching.get('');
  expectType<TypeEqual<Caching.Types | null, typeof result1>>(true);

  const result2 = await caching.get('', 1);
  expectType<TypeEqual<number, typeof result2>>(true);

  const result3 = await caching.get<string>('');
  expectType<TypeEqual<string | null, typeof result3>>(true);
}

// set
{
  expectType<boolean>(await caching.set('', ''));
  await caching.set('', 1);
  await caching.set('', {});
  await caching.set('', []);
  await caching.set('', false);
  await caching.set('', '', 100);
  // @ts-expect-error
  await caching.set('', '', '100');
}

// add
{
  expectType<boolean>(await caching.setNX('', ''));
  await caching.setNX('', 1);
  await caching.setNX('', {});
  await caching.setNX('', []);
  await caching.setNX('', false);
  await caching.setNX('', '', 100);
  // @ts-expect-error
  await caching.setNX('', '', '100');
}

// delete
{
  expectType<boolean>(await caching.delete(''));
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
}

// increase
{
  const result = await caching.increment('a');
  expectType<TypeEqual<number, typeof result>>(true);
}

// decrease
{
  const result = await caching.decrement('a');
  expectType<TypeEqual<number, typeof result>>(true);
}

// expires
{
  const result = await caching.expire('', 20);
  expectType<TypeEqual<boolean, typeof result>>(true);
}
