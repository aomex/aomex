import { expect, test } from 'vitest';
import { Service, combineServices } from '../src';
import sleep from 'sleep-promise';

const load =
  <C>(Ctor: C) =>
  async () =>
    Ctor;

class MyService1 extends Service {
  data = '';

  protected override async onInit() {
    await sleep(50);
    this.data = '123';
  }

  action1() {
    return 'action1';
  }

  getData() {
    return this.data;
  }

  callSelf() {
    return this.action1();
  }
}

class MyService2 extends Service {
  action2() {
    return 'action2';
  }
}

test('组合服务返回 Promise', async () => {
  const promise = combineServices({
    s1: load(MyService1),
    s2: load(MyService2),
  });
  expect(promise).toBeInstanceOf(Promise);
  const services = await promise;
  expect(await services.s1.action1()).toBe('action1');
  expect(await services.s2.action2()).toBe('action2');
});

test('方法一律返回 Promise', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  const result = services.s1.action1();
  expect(result).toBeInstanceOf(Promise);
  await expect(result).resolves.toBe('action1');
});

test('懒加载后执行 onInit', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  expect(await services.s1.getData()).toBe('123');
});

test('eager 在返回前预先 onInit', async () => {
  let inits = 0;
  class EagerService extends Service {
    protected override async onInit() {
      inits += 1;
    }
    ping() {
      return inits;
    }
  }

  expect(inits).toBe(0);
  const services = await combineServices(
    { e: async () => EagerService, lazy: async () => MyService2 },
    { eager: ['e'] },
  );
  expect(inits).toBe(1);
  expect(await services.e.ping()).toBe(1);
  expect(inits).toBe(1);
});

test('未列入 eager 的服务仍懒加载', async () => {
  let eagerInits = 0;
  let lazyInits = 0;
  class EagerService extends Service {
    protected override async onInit() {
      eagerInits += 1;
    }
    ping() {
      return 'e';
    }
  }
  class LazyService extends Service {
    protected override async onInit() {
      lazyInits += 1;
    }
    ping() {
      return 'l';
    }
  }

  const services = await combineServices(
    { e: async () => EagerService, l: async () => LazyService },
    { eager: ['e'] },
  );
  expect(eagerInits).toBe(1);
  expect(lazyInits).toBe(0);
  await expect(services.l.ping()).resolves.toBe('l');
  expect(lazyInits).toBe(1);
});

test('eager 按数组顺序依次初始化', async () => {
  const order: string[] = [];
  class A extends Service {
    protected override async onInit() {
      order.push('a');
    }
    ping() {
      return 'a';
    }
  }
  class B extends Service {
    protected override async onInit() {
      order.push('b');
    }
    ping() {
      return 'b';
    }
  }

  await combineServices({ a: async () => A, b: async () => B }, { eager: ['b', 'a'] });
  expect(order).toEqual(['b', 'a']);
});

test('eager 中 onInit 失败则 combineServices 失败', async () => {
  class Bad extends Service {
    protected override async onInit() {
      throw new Error('init-fail');
    }
    ping() {
      return 'x';
    }
  }
  await expect(
    combineServices({ bad: async () => Bad }, { eager: ['bad'] }),
  ).rejects.toThrow('init-fail');
});

test('同一服务单例', async () => {
  let inits = 0;
  class CounterService extends Service {
    protected override async onInit() {
      inits += 1;
    }
    ping() {
      return inits;
    }
  }

  const services = await combineServices({ c: load(CounterService) });
  expect(await services.c.ping()).toBe(1);
  expect(await services.c.ping()).toBe(1);
  expect(inits).toBe(1);
});

test('并发首次调用共用 pending', async () => {
  let inits = 0;
  class SlowService extends Service {
    protected override async onInit() {
      inits += 1;
      await sleep(30);
    }
    ping() {
      return 'ok';
    }
  }

  const services = await combineServices({ s: load(SlowService) });
  const [a, b] = await Promise.all([services.s.ping(), services.s.ping()]);
  expect(a).toBe('ok');
  expect(b).toBe('ok');
  expect(inits).toBe(1);
});

test('未调用的服务不加载', async () => {
  let loaded = false;
  class LazyService extends Service {
    protected override async onInit() {
      loaded = true;
    }
    ping() {
      return 1;
    }
  }

  const services = await combineServices({
    a: load(MyService2),
    b: load(LazyService),
  });
  await services.a.action2();
  expect(loaded).toBe(false);
  await services.b.ping();
  expect(loaded).toBe(true);
});

test('类内部 this 调用保持同步语义', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  expect(await services.s1.callSelf()).toBe('action1');
});

test('禁止读取字段', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  await expect((services.s1 as any).data()).rejects.toThrow(
    /not a function|is not a function/,
  );
});

test('Proxy：symbol / then / 写入陷阱', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  const proxy = services.s1 as any;
  expect(proxy[Symbol.toStringTag]).toBeUndefined();
  expect(proxy.then).toBeUndefined();
  expect(Reflect.set(proxy, 'x', 1)).toBe(false);
  expect(Reflect.deleteProperty(proxy, 'action1')).toBe(false);
  expect(Reflect.defineProperty(proxy, 'z', { value: 1 })).toBe(false);
  await expect(Promise.resolve(proxy)).resolves.toBe(proxy);
});

test('组合结果不可改', async () => {
  const services = await combineServices({
    s1: load(MyService1),
    s2: load(MyService2),
  });

  expect(() => {
    // @ts-expect-error
    services['a'] = 1;
  }).toThrow(/not extensible|Cannot add property/);
  expect(() => {
    // @ts-expect-error
    delete services.s1;
  }).toThrow(/Cannot delete|Cannot remove/);
  expect(() => {
    // @ts-expect-error
    services.s1 = 'x' as any;
  }).toThrow(/read only|Cannot assign/);
});

test('动态 import：唯一命名导出', async () => {
  const services = await combineServices({
    named: () => import('./fixture/named-only.service.js'),
  });
  expect(await services.named.ping()).toBe('named-only');
});

test('动态 import：default', async () => {
  const services = await combineServices({
    d: () => import('./fixture/with-default.service.js'),
  });
  expect(await services.d.ping()).toBe('with-default');
});

test('动态 import：then 指定类', async () => {
  const services = await combineServices({
    d: () =>
      import('./fixture/with-default.service.js').then((m) => m.WithDefaultService),
  });
  expect(await services.d.ping()).toBe('with-default');
});

test('动态 import：多个 Service 报错', async () => {
  const services = await combineServices({
    multi: () => import('./fixture/multi.service.js'),
  });
  await expect((services.multi as any).ping()).rejects.toThrow(
    /expected a Service class/,
  );
});

test('动态 import：没有 Service 报错', async () => {
  const services = await combineServices({
    bad: () => import('./fixture/no-service.module.js') as any,
  });
  await expect((services.bad as any).helper()).rejects.toThrow(
    /expected a Service class/,
  );
});

test('onInit 失败可重试', async () => {
  let attempts = 0;
  class FlakyService extends Service {
    protected override async onInit() {
      attempts += 1;
      if (attempts === 1) throw new Error('boom');
    }
    ping() {
      return attempts;
    }
  }

  const services = await combineServices({ f: load(FlakyService) });
  await expect(services.f.ping()).rejects.toThrow('boom');
  expect(await services.f.ping()).toBe(2);
});

test('onInit 期间可调用其它服务', async () => {
  class MyService3 extends Service {
    froms2data = '';

    protected override async onInit(): Promise<void> {
      this.froms2data = await services.s2.action2();
    }

    getFrom() {
      return this.froms2data;
    }
  }

  const services = await combineServices({
    s1: load(MyService1),
    s2: load(MyService2),
    s3: load(MyService3),
  });

  expect(await services.s3.getFrom()).toBe('action2');
});

test('onInit 期间经 proxy 调自身同 key 不死锁', async () => {
  class SelfInitService extends Service {
    value = '';

    protected override async onInit(): Promise<void> {
      // 走 proxy 再入同 key：依赖先登记再 onInit，否则会卡在 pending
      this.value = await services.self.read();
    }

    read() {
      return 'ready';
    }

    getValue() {
      return this.value;
    }
  }

  const services = await combineServices({
    self: load(SelfInitService),
  });

  expect(await services.self.getValue()).toBe('ready');
});

test('方法参数原样转发', async () => {
  class ArgService extends Service {
    join(a: string, b: number, c: boolean) {
      return `${a}-${b}-${c}`;
    }
  }

  const services = await combineServices({ a: load(ArgService) });
  expect(await services.a.join('x', 2, true)).toBe('x-2-true');
});

test('方法抛错经 proxy 透传', async () => {
  class ThrowService extends Service {
    fail() {
      throw new Error('method-boom');
    }
    async failAsync() {
      throw new Error('async-boom');
    }
  }

  const services = await combineServices({ t: load(ThrowService) });
  await expect(services.t.fail()).rejects.toThrow('method-boom');
  await expect(services.t.failAsync()).rejects.toThrow('async-boom');
});

test('async 方法只包一层 Promise', async () => {
  class AsyncService extends Service {
    async ping() {
      return 'pong' as const;
    }
  }

  const services = await combineServices({ a: load(AsyncService) });
  const result = services.a.ping();
  expect(result).toBeInstanceOf(Promise);
  // 若被再包一层，await result 会得到 Promise 而非字符串
  expect(await result).toBe('pong');
  expect(await await result).toBe('pong');
});

test('原型链继承方法可调用', async () => {
  class Base extends Service {
    base() {
      return 'base';
    }
  }
  class Child extends Base {
    child() {
      return 'child';
    }
  }

  const services = await combineServices({ c: load(Child) });
  expect(await services.c.base()).toBe('base');
  expect(await services.c.child()).toBe('child');
});

test('不存在的方法调用报错', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  await expect((services.s1 as any).noSuchMethod()).rejects.toThrow(
    /not a function|is not a function/,
  );
});

test('getter 非函数属性经 proxy 调用报错', async () => {
  class GetterService extends Service {
    get label() {
      return 'L';
    }
  }

  const services = await combineServices({ g: load(GetterService) });
  await expect((services.g as any).label()).rejects.toThrow(
    /not a function|is not a function/,
  );
});

test('loader 只执行一次', async () => {
  let loads = 0;
  class OnceService extends Service {
    ping() {
      return loads;
    }
  }

  const services = await combineServices({
    o: async () => {
      loads += 1;
      return OnceService;
    },
  });
  expect(await services.o.ping()).toBe(1);
  expect(await services.o.ping()).toBe(1);
  expect(loads).toBe(1);
});

test('Proxy：更多 symbol 与 in/ownKeys 默认行为', async () => {
  const services = await combineServices({ s1: load(MyService1) });
  const proxy = services.s1 as any;

  expect(proxy[Symbol.iterator]).toBeUndefined();
  expect(proxy[Symbol.asyncIterator]).toBeUndefined();
  expect(proxy[Symbol.hasInstance]).toBeUndefined();
  // 目标是空对象，未设 has/ownKeys trap
  expect('action1' in proxy).toBe(false);
  expect(Reflect.ownKeys(proxy)).toEqual([]);
});
