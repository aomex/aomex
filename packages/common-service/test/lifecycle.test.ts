import { afterEach, expect, test } from 'vitest';
import sleep from 'sleep-promise';
import {
  Service,
  combineServices,
  internalDestroyServices,
  registerLifecycle,
} from '../src';

afterEach(async () => {
  await internalDestroyServices([]);
});

const noop = () => {};

test('registerLifecycle：onInit 在返回前执行', async () => {
  const order: string[] = [];
  const unregister = await registerLifecycle({
    onInit: async () => {
      await sleep(10);
      order.push('init');
    },
    onDestroy: () => {
      order.push('destroy');
    },
  });
  expect(order).toEqual(['init']);
  unregister();
  await internalDestroyServices([]);
  expect(order).toEqual(['init']);
});

test('registerLifecycle：onInit 失败不登记 onDestroy', async () => {
  let destroyed = 0;
  await expect(
    registerLifecycle({
      onInit: async () => {
        throw new Error('init-fail');
      },
      onDestroy: () => {
        destroyed += 1;
      },
    }),
  ).rejects.toThrow('init-fail');
  await internalDestroyServices([]);
  expect(destroyed).toBe(0);
});

test('registerLifecycle：unregister 后不再 onDestroy', async () => {
  let destroyed = 0;
  const unregister = await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      destroyed += 1;
    },
  });
  unregister();
  unregister(); // 幂等
  await internalDestroyServices([]);
  expect(destroyed).toBe(0);
});

test('internalDestroyServices：空数组仍执行 lifecycle', async () => {
  let destroyed = 0;
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      destroyed += 1;
    },
  });
  await internalDestroyServices([]);
  expect(destroyed).toBe(1);
});

test('internalDestroyServices：与服务 onDestroy 一并执行', async () => {
  const order: string[] = [];
  class A extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      order.push('service');
    }
  }
  await registerLifecycle({
    onInit: noop,
    onDestroy: async () => {
      await sleep(5);
      order.push('lifecycle');
    },
  });
  const services = await combineServices({ a: async () => A });
  await services.a.ping();
  await internalDestroyServices([services]);
  expect(order).toContain('service');
  expect(order).toContain('lifecycle');
  expect(order).toHaveLength(2);
});

test('internalDestroyServices：lifecycle 只执行一次且登记被移除', async () => {
  let destroyed = 0;
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      destroyed += 1;
    },
  });
  await internalDestroyServices([]);
  await internalDestroyServices([]);
  expect(destroyed).toBe(1);
});

test('internalDestroyServices：并发只执行一次 lifecycle onDestroy', async () => {
  let destroyed = 0;
  await registerLifecycle({
    onInit: noop,
    onDestroy: async () => {
      await sleep(30);
      destroyed += 1;
    },
  });
  await Promise.all([internalDestroyServices([]), internalDestroyServices([])]);
  expect(destroyed).toBe(1);
});

test('registerLifecycle：多个钩子均触发', async () => {
  const destroyed: number[] = [];
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      destroyed.push(1);
    },
  });
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      destroyed.push(2);
    },
  });
  await internalDestroyServices([]);
  expect(destroyed.sort()).toEqual([1, 2]);
});

test('destroy 清空后可重新登记', async () => {
  let first = 0;
  let second = 0;
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      first += 1;
    },
  });
  await internalDestroyServices([]);
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      second += 1;
    },
  });
  await internalDestroyServices([]);
  expect(first).toBe(1);
  expect(second).toBe(1);
});

test('onDestroy 抛错仍移除登记', async () => {
  let second = 0;
  await registerLifecycle({
    onInit: noop,
    onDestroy: async () => {
      throw new Error('destroy-fail');
    },
  });
  await expect(internalDestroyServices([])).rejects.toThrow('destroy-fail');
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      second += 1;
    },
  });
  await internalDestroyServices([]);
  expect(second).toBe(1);
});

test('非 combine 结果与 lifecycle 可同时处理', async () => {
  let destroyed = 0;
  await registerLifecycle({
    onInit: noop,
    onDestroy: () => {
      destroyed += 1;
    },
  });
  await internalDestroyServices([{}]);
  expect(destroyed).toBe(1);
});
