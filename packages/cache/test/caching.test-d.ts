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

// 装饰器
{
  class MyClass {
    @caching.decorate({ duration: 1 })
    async getData0() {
      return 'ok';
    }

    @caching.decorate({ key: 'key', duration: 1 })
    async getData1() {
      return 'ok';
    }

    // @ts-expect-error
    @caching.decorate({ key: 'key' })
    async getData1_1() {
      return 'ok';
    }

    @caching.decorate({
      key: (id, time) => {
        expectType<number>(id);
        expectType<string>(time);
        return `key_${id}_${time}`;
      },
      duration: 1,
    })
    async getData2(id: number, time: string) {
      return 'ok' + id + time;
    }

    @caching.decorate({ key: 'key', duration: 60_000 })
    async getData3() {
      return 'ok';
    }

    @caching.decorate({ key: 'key', duration: 1 })
    getData4() {
      return Promise.resolve('ok');
    }

    @caching.decorate({ key: 'key', duration: 1 })
    getData5() {
      return Promise.resolve('ok');
    }

    @caching.decorate({ key: 'key', duration: 1 })
    getData6() {
      return Promise.resolve('ok');
    }

    @caching.decorate({ key: 'key', duration: 1 })
    async getDate7() {
      return null;
    }

    @caching.decorate({ key: 'key', defaultValue: 'okay', duration: 1 })
    async getDate8() {
      if (Math.random() > 0.5) return 'ok';
      return null;
    }

    @caching.decorate({ key: 'key', defaultValue: 123, duration: 1 })
    async getDate9() {
      if (Math.random() > 0.5) return 'ok';
      return null;
    }
  }

  const data = await new MyClass().getData2(2, 'x');
  expectType<string>(data);
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
