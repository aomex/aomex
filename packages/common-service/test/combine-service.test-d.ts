import { expectType, type TypeEqual } from 'ts-expect';
import { Service, combineServices, type PromisifiedService } from '../src';

class MyService1 extends Service {
  data = '';

  action1() {
    return 'action1' as const;
  }

  async actionAsync() {
    return 1 as const;
  }
}

class MyService2 extends Service {
  action2(name: string) {
    return name;
  }
}

const services = await combineServices({
  s1: async () => MyService1,
  s2: async () => MyService2,
});

expectType<
  TypeEqual<
    {
      readonly s1: PromisifiedService<MyService1>;
      readonly s2: PromisifiedService<MyService2>;
    },
    typeof services
  >
>(true);

// 同步方法 → Promise
expectType<TypeEqual<() => Promise<'action1'>, typeof services.s1.action1>>(true);
// 已是 async → 仍是一层 Promise
expectType<TypeEqual<() => Promise<1>, typeof services.s1.actionAsync>>(true);
// 参数保留
expectType<TypeEqual<(name: string) => Promise<string>, typeof services.s2.action2>>(
  true,
);

// 字段禁用
expectType<TypeEqual<never, keyof typeof services.s1 & 'data'>>(true);
// @ts-expect-error 字段不存在
services.s1.data;
// @ts-expect-error 生命周期钩子不暴露
services.s1.onInit;
// @ts-expect-error
services.s1.onDestroy;

class PublicLifecycle extends Service {
  // 故意不加 protected
  override async onInit() {}
  override async onDestroy() {}
  ping() {
    return 'ok' as const;
  }
}

const withPublicHooks = await combineServices({
  p: async () => PublicLifecycle,
});
expectType<TypeEqual<() => Promise<'ok'>, typeof withPublicHooks.p.ping>>(true);
// @ts-expect-error 即便 public override 也不暴露
withPublicHooks.p.onInit;
// @ts-expect-error
withPublicHooks.p.onDestroy;

// @ts-expect-error 不允许直接传 Class
await combineServices({ bad: MyService1 });

// @ts-expect-error loader 必须返回 Promise，同步工厂不行
await combineServices({ bad: () => MyService1 });

{
  const withEager = await combineServices(
    {
      s1: async () => MyService1,
      s2: async () => MyService2,
    },
    { eager: ['s1'] },
  );
  expectType<TypeEqual<() => Promise<'action1'>, typeof withEager.s1.action1>>(true);
  expectType<TypeEqual<(name: string) => Promise<string>, typeof withEager.s2.action2>>(
    true,
  );

  await combineServices(
    {
      s1: async () => MyService1,
      s2: async () => MyService2,
    },
    // @ts-expect-error eager 只能写已有服务 key
    { eager: ['missing'] },
  );

  await combineServices(
    {
      s1: async () => MyService1,
    },
    // @ts-expect-error eager 元素类型必须是服务 key
    { eager: [1] },
  );

  await combineServices(
    {
      s1: async () => MyService1,
      s2: async () => MyService2,
    },
    { eager: [] },
  );

  await combineServices(
    {
      s1: async () => MyService1,
      s2: async () => MyService2,
    },
    { eager: ['s1', 's1'] },
  );
}

// 属性只读
expectType<
  TypeEqual<
    {
      s1: PromisifiedService<MyService1>;
      s2: PromisifiedService<MyService2>;
    },
    typeof services
  >
>(false);

const fromImport = await combineServices({
  named: () => import('./fixture/named-only.service.js'),
  withDefault: () => import('./fixture/with-default.service.js'),
  picked: () =>
    import('./fixture/with-default.service.js').then((m) => m.WithDefaultService),
});

expectType<TypeEqual<() => Promise<string>, typeof fromImport.named.ping>>(true);
expectType<TypeEqual<() => Promise<string>, typeof fromImport.withDefault.ping>>(true);
expectType<TypeEqual<() => Promise<string>, typeof fromImport.picked.ping>>(true);

const multi = await combineServices({
  // 多个 Service：实例推断为 never，无方法
  bad: () => import('./fixture/multi.service.js'),
});
expectType<TypeEqual<{}, typeof multi.bad>>(true);
