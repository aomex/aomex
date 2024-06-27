import { type TypeEqual, expectType } from 'ts-expect';
import { Caching } from '../src';

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
  expectType<boolean>(await caching.add('', ''));
  await caching.add('', 1);
  await caching.add('', {});
  await caching.add('', []);
  await caching.add('', false);
  await caching.add('', '', 100);
  // @ts-expect-error
  await caching.add('', '', '100');
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

// getOrSet
{
  expectType<string>(await caching.getOrSet('', () => ''));
  expectType<string>(await caching.getOrSet('', async () => ''));
  expectType<number>(await caching.getOrSet('', () => Promise.resolve(123)));
  expectType<string>(await caching.getOrSet('', () => '', 100));
}

// getAndDelete
{
  const result1 = await caching.getAndDelete('');
  expectType<TypeEqual<Caching.Types | null, typeof result1>>(true);

  const result2 = await caching.getAndDelete('', 1);
  expectType<TypeEqual<number, typeof result2>>(true);

  const result3 = await caching.getAndDelete<string>('');
  expectType<TypeEqual<string | null, typeof result3>>(true);
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
  const result = await caching.expires('', 20);
  expectType<TypeEqual<boolean, typeof result>>(true);
}
