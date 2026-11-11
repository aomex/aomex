import { expect, test } from 'vitest';
import sleep from 'sleep-promise';
import { Service, combineServices, internalDestroyServices } from '../src';

test('internalDestroyServices：非 combine 结果直接忽略', async () => {
  await expect(internalDestroyServices([{}])).resolves.toBeUndefined();
});

test('internalDestroyServices 触发已加载实例的 onDestroy', async () => {
  let destroyed = 0;
  class A extends Service {
    ping() {
      return 'a';
    }
    protected override async onDestroy() {
      destroyed += 1;
    }
  }
  class B extends Service {
    ping() {
      return 'b';
    }
    protected override async onDestroy() {
      destroyed += 1;
    }
  }

  const services = await combineServices({
    a: async () => A,
    b: async () => B,
  });
  await services.a.ping();
  await internalDestroyServices([services]);
  expect(destroyed).toBe(1);
  await internalDestroyServices([services]); // 幂等
  expect(destroyed).toBe(1);
});

test('internalDestroyServices 支持多组', async () => {
  let destroyed = 0;
  class A extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      destroyed += 1;
    }
  }
  class B extends Service {
    ping() {
      return 2;
    }
    protected override async onDestroy() {
      destroyed += 1;
    }
  }

  const s1 = await combineServices({ a: async () => A });
  const s2 = await combineServices({ b: async () => B });
  await s1.a.ping();
  await s2.b.ping();
  await internalDestroyServices([s1, s2]);
  expect(destroyed).toBe(2);
});

test('internalDestroyServices 并发调用只执行一次 onDestroy', async () => {
  let destroyed = 0;
  class A extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      await sleep(30);
      destroyed += 1;
    }
  }

  const services = await combineServices({ a: async () => A });
  await services.a.ping();
  await Promise.all([
    internalDestroyServices([services]),
    internalDestroyServices([services]),
  ]);
  expect(destroyed).toBe(1);
});
