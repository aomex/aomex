import { afterEach, beforeEach, expect, test, vitest, type MockInstance } from 'vitest';
import sleep from 'sleep-promise';
import { Caching, createRemember } from '../src';
import { CacheMemoryAdapter } from '../src/adapters/cache-memory-adapter';
import { MockStore } from './mock/cache.mock';

const cache = new Caching(new MockStore());
const remember = createRemember(cache);

let deleteSpy: MockInstance;
let existSpy: MockInstance;
let setNxSpy: MockInstance;

beforeEach(async () => {
  // 跟随 remember 流程：winner 删除 waiting key 后，waiter 才能结束轮询
  existSpy = vitest.spyOn(cache, 'exists').mockResolvedValue(true);
  const currentExistSpy = existSpy;
  deleteSpy = vitest.spyOn(cache, 'delete').mockImplementation(async () => {
    currentExistSpy.mockResolvedValue(false);
    return true;
  });
  setNxSpy = vitest
    .spyOn(cache, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);
});

afterEach(async () => {
  deleteSpy.mockRestore();
  existSpy.mockRestore();
  setNxSpy.mockRestore();
});

test('不同 Caching 的 remember 互不影响', async () => {
  const cacheA = new Caching(new MockStore());
  const cacheB = new Caching(new MockStore());
  const rememberA = createRemember(cacheA);
  const rememberB = createRemember(cacheB);

  const getA = vitest.spyOn(cacheA, 'get').mockResolvedValue(null);
  const setA = vitest.spyOn(cacheA, 'set').mockResolvedValue(true);
  const setNxA = vitest.spyOn(cacheA, 'setNX').mockResolvedValue(true);
  const deleteA = vitest.spyOn(cacheA, 'delete').mockResolvedValue(true);
  const getB = vitest.spyOn(cacheB, 'get').mockResolvedValue(null);
  const setB = vitest.spyOn(cacheB, 'set').mockResolvedValue(true);
  const setNxB = vitest.spyOn(cacheB, 'setNX').mockResolvedValue(true);
  const deleteB = vitest.spyOn(cacheB, 'delete').mockResolvedValue(true);

  class HostA {
    @rememberA({ key: 'a', duration: 1000 })
    async load() {
      return 'a';
    }
  }
  class HostB {
    @rememberB({ key: 'b', duration: 1000 })
    async load() {
      return 'b';
    }
  }

  await expect(new HostA().load()).resolves.toBe('a');
  await expect(new HostB().load()).resolves.toBe('b');
  expect(getA).toHaveBeenCalled();
  expect(getB).toHaveBeenCalled();
  expect(setA).toHaveBeenCalledWith('a', 'a', 1000);
  expect(setB).toHaveBeenCalledWith('b', 'b', 1000);

  getA.mockRestore();
  setA.mockRestore();
  setNxA.mockRestore();
  deleteA.mockRestore();
  getB.mockRestore();
  setB.mockRestore();
  setNxB.mockRestore();
  deleteB.mockRestore();
});

test('没有缓存时请求原始数据', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockImplementation(async () => null);
  const setSpy = vitest.spyOn(cache, 'set').mockImplementation(async () => true);
  const setNxSpyLocal = vitest
    .spyOn(cache, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      return 'foo-bar';
    }
  }
  const my = new MyClass();
  const result = await my.getData();
  expect(result).toBe('foo-bar');
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(getSpy).toHaveBeenCalledWith('key');
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenCalledWith('key', 'foo-bar', 1000);

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpyLocal.mockRestore();
});

test('有缓存时直接用缓存', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockImplementation(async () => 'foo');
  const setSpy = vitest.spyOn(cache, 'set').mockImplementation(async () => true);
  const spy = vitest.fn();

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      spy();
      return 'foo-bar';
    }
  }
  const my = new MyClass();
  const result = await my.getData();
  expect(result).toBe('foo');
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(getSpy).toHaveBeenCalledWith('key');
  expect(setSpy).toHaveBeenCalledTimes(0);
  expect(spy).toHaveBeenCalledTimes(0);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('并发调用时，只获取一次数据源', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(cache, 'set').mockImplementation(async () => {
    getSpy.mockResolvedValue('a-foo');
    return true;
  });
  const spy = vitest.fn();

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      await sleep(50);
      spy();
      return 'foo-bar';
    }
  }
  const my = new MyClass();

  const result = await Promise.all([my.getData(), my.getData(), my.getData()]);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(result).toMatchObject(['foo-bar', 'a-foo', 'a-foo']);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('不同客户端并发调用时，只获取一次数据源', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(cache, 'set').mockImplementation(async () => {
    getSpy.mockResolvedValue('a-foo');
    return true;
  });
  const spy1 = vitest.fn();
  const spy2 = vitest.fn();

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      await sleep(50);
      spy1();
      return 'foo-bar';
    }

    @remember({ key: 'key', duration: 1200 })
    async getData1() {
      await sleep(50);
      spy2();
      return 'bar';
    }
  }
  const my = new MyClass();

  const result = await Promise.all([
    my.getData(),
    my.getData1(),
    my.getData(),
    my.getData1(),
  ]);

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(0);
  expect(setSpy).toHaveBeenCalledTimes(1);
  expect(result).toMatchObject(['foo-bar', 'a-foo', 'a-foo', 'a-foo']);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('动态键', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(cache, 'set').mockResolvedValue(true);
  const spy = vitest.fn().mockImplementation(() => 'x');

  class MyClass {
    @remember({ key: spy, duration: 1000 })
    async getData(id: number | string) {
      await sleep(1500);
      return 'foo-bar-' + id;
    }
  }
  const my = new MyClass();
  await Promise.all([my.getData(1), my.getData(2), my.getData(3), my.getData('abc')]);

  expect(spy).toHaveBeenCalledTimes(4);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(2);
  expect(spy).toHaveBeenCalledWith(3);
  expect(spy).toHaveBeenCalledWith('abc');

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('默认值', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(cache, 'set').mockResolvedValue(true);

  class MyClass {
    @remember({ key: 'key', defaultValue: 'foo', duration: 1000 })
    async getData() {
      return null;
    }
  }
  const my = new MyClass();
  const result = await my.getData();
  expect(result).toBe('foo');
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(setSpy).toHaveBeenCalledTimes(0);

  getSpy.mockRestore();
  setSpy.mockRestore();
});

test('默认的键', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  class MyClass {
    @remember({ duration: 1000 })
    async getData() {
      return null;
    }

    @remember({ duration: 1000 })
    async getData2(_a: string, _b: number, _c: object) {
      return null;
    }
  }
  const my = new MyClass();
  await my.getData();
  expect(getSpy).toHaveBeenLastCalledWith('MyClass-getData-[]');

  await my.getData2('abcd', 123, { hello: 'world', foo: 'bar' });
  expect(getSpy).toHaveBeenLastCalledWith(
    'MyClass-getData2-["abcd",123,{"hello":"world","foo":"bar"}]',
    null,
  );

  getSpy.mockRestore();
});

test('只传数字等同于 duration', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockImplementation(async () => null);
  const setSpy = vitest.spyOn(cache, 'set').mockImplementation(async () => true);
  const setNxSpyLocal = vitest
    .spyOn(cache, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);

  class MyClass {
    @remember(1000)
    async getData() {
      return 'foo-bar';
    }
  }
  const my = new MyClass();
  await expect(my.getData()).resolves.toBe('foo-bar');
  expect(setSpy).toHaveBeenCalledWith('MyClass-getData-[]', 'foo-bar', 1000);

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpyLocal.mockRestore();
});

test('只传时长字符串等同于 duration，options 亦可传字符串', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockImplementation(async () => null);
  const setSpy = vitest.spyOn(cache, 'set').mockImplementation(async () => true);
  const setNxSpyLocal = vitest
    .spyOn(cache, 'setNX')
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValue(false);

  class MyClass {
    @remember('1 minute')
    async byString() {
      return 'a';
    }
    @remember({ key: 'k', duration: '30m' })
    async byOpts() {
      return 'b';
    }
  }
  const my = new MyClass();
  await expect(my.byString()).resolves.toBe('a');
  expect(setSpy).toHaveBeenCalledWith('MyClass-byString-[]', 'a', '1 minute');
  await expect(my.byOpts()).resolves.toBe('b');
  expect(setSpy).toHaveBeenCalledWith('k', 'b', '30m');

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpyLocal.mockRestore();
});

test('默认键优先使用 displayName', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  class MyClass {
    displayName = 'Alias';
    @remember({ duration: 1000 })
    async getData() {
      return null;
    }
  }
  await new MyClass().getData();
  expect(getSpy).toHaveBeenLastCalledWith('Alias-getData-[]');
  getSpy.mockRestore();
});

test('返回 null 且无 defaultValue 时不写入缓存', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(cache, 'set').mockResolvedValue(true);
  const setNxSpyLocal = vitest.spyOn(cache, 'setNX').mockResolvedValue(true);

  class MyClass {
    @remember({ key: 'key', duration: 1000 })
    async getData() {
      return null;
    }
  }
  await expect(new MyClass().getData()).resolves.toBeNull();
  expect(setSpy).not.toHaveBeenCalled();

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpyLocal.mockRestore();
});

test('原方法抛错时仍清理 waiting key', async () => {
  const getSpy = vitest.spyOn(cache, 'get').mockResolvedValue(null);
  const setSpy = vitest.spyOn(cache, 'set').mockResolvedValue(true);
  const setNxSpyLocal = vitest.spyOn(cache, 'setNX').mockResolvedValue(true);
  const deleteSpyLocal = vitest.spyOn(cache, 'delete').mockResolvedValue(true);

  class MyClass {
    @remember({ key: 'boom', duration: 1000 })
    async getData(): Promise<string> {
      throw new Error('boom');
    }
  }
  await expect(new MyClass().getData()).rejects.toThrow('boom');
  expect(setSpy).not.toHaveBeenCalled();
  expect(deleteSpyLocal).toHaveBeenCalledWith('boom:$#_waiting_#$');

  getSpy.mockRestore();
  setSpy.mockRestore();
  setNxSpyLocal.mockRestore();
  deleteSpyLocal.mockRestore();
});

test('connect 失败时 ensureReady 可重试', async () => {
  let fail = true;
  let connects = 0;
  class FlakyAdapter extends CacheMemoryAdapter {
    override async connect() {
      connects += 1;
      if (fail) throw new Error('connect-boom');
    }
  }
  const flaky = new Caching(new FlakyAdapter());
  const flakyRemember = createRemember(flaky);
  class Host {
    @flakyRemember({ key: 'retry', duration: 1000 })
    async load() {
      return 'ok';
    }
  }

  await expect(new Host().load()).rejects.toThrow('connect-boom');
  expect(connects).toBe(1);
  expect(flaky['ready']).toBeUndefined();

  fail = false;
  await expect(new Host().load()).resolves.toBe('ok');
  expect(connects).toBe(2);
});
