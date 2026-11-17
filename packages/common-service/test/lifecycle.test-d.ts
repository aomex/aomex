import { expectType, type TypeEqual } from 'ts-expect';
import { registerLifecycle, type LifecycleHooks } from '../src';

expectType<
  TypeEqual<
    {
      onInit: () => void | Promise<void>;
      onDestroy: () => void | Promise<void>;
    },
    LifecycleHooks
  >
>(true);

const unregister = await registerLifecycle({
  onInit: () => {},
  onDestroy: () => {},
});
expectType<TypeEqual<() => void, typeof unregister>>(true);

await registerLifecycle({
  onInit: async () => {},
  onDestroy: async () => {},
});

// @ts-expect-error 空对象缺少必填钩子
await registerLifecycle({});

// @ts-expect-error 缺少 onDestroy
await registerLifecycle({ onInit: () => {} });

// @ts-expect-error 缺少 onInit
await registerLifecycle({ onDestroy: () => {} });

// @ts-expect-error 禁止多余字段
await registerLifecycle({ onInit: () => {}, onDestroy: () => {}, extra: 1 });

// @ts-expect-error onInit 不可为非函数
await registerLifecycle({ onInit: 1, onDestroy: () => {} });

// @ts-expect-error onDestroy 不可为非函数
await registerLifecycle({ onInit: () => {}, onDestroy: 'x' });

// @ts-expect-error 不可直接传 null
await registerLifecycle(null);
