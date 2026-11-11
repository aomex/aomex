import { expectType, type TypeEqual } from 'ts-expect';
import type {
  CtorFromResolved,
  InferLoaderCtor,
  InferLoaderInstance,
  PromisifiedService,
  UniqueServiceCtor,
} from '../src';
import { Service } from '../src';

class A extends Service {
  sync(): number {
    return 1;
  }
  async asyncMethod(): Promise<'x'> {
    return 'x';
  }
  field = 1;
}

type PA = PromisifiedService<A>;
expectType<TypeEqual<() => Promise<number>, PA['sync']>>(true);
expectType<TypeEqual<() => Promise<'x'>, PA['asyncMethod']>>(true);
expectType<TypeEqual<never, keyof PA & 'field'>>(true);

// 重载：各签名分别 Promise 化，而不是塌成最后一个
class Overloaded extends Service {
  foo(x: string): string;
  foo(x: number): number;
  foo(x: boolean): boolean;
  foo(x: string | number | boolean): string | number | boolean {
    return x;
  }
}
type OF = PromisifiedService<Overloaded>['foo'];
expectType<
  TypeEqual<
    true,
    OF extends {
      (x: string): Promise<string>;
      (x: number): Promise<number>;
      (x: boolean): Promise<boolean>;
    }
      ? true
      : false
  >
>(true);
declare const overloadedFoo: OF;
expectType<Promise<string>>(overloadedFoo('a'));
expectType<Promise<number>>(overloadedFoo(1));
expectType<Promise<boolean>>(overloadedFoo(true));

expectType<TypeEqual<never, keyof PA & 'onInit'>>(true);
expectType<TypeEqual<never, keyof PA & 'onDestroy'>>(true);

// override 时漏写 protected（变成 public）仍不得暴露
class PublicHooks extends Service {
  override async onInit() {}
  override async onDestroy() {}
  work() {
    return 1;
  }
}
type PH = PromisifiedService<PublicHooks>;
expectType<TypeEqual<() => Promise<number>, PH['work']>>(true);
expectType<TypeEqual<never, keyof PH & 'onInit'>>(true);
expectType<TypeEqual<never, keyof PH & 'onDestroy'>>(true);
declare const publicHooks: PH;
// @ts-expect-error public onInit 仍不可见
publicHooks.onInit;
// @ts-expect-error public onDestroy 仍不可见
publicHooks.onDestroy;

class Only extends Service {}
class Extra extends Service {}

expectType<TypeEqual<typeof Only, UniqueServiceCtor<{ Only: typeof Only; n: number }>>>(
  true,
);
expectType<
  TypeEqual<never, UniqueServiceCtor<{ Only: typeof Only; Extra: typeof Extra }>>
>(true);
expectType<TypeEqual<never, UniqueServiceCtor<{ n: number }>>>(true);

expectType<TypeEqual<typeof Only, CtorFromResolved<typeof Only>>>(true);
expectType<
  TypeEqual<typeof Only, CtorFromResolved<{ default: typeof Only; Extra: typeof Extra }>>
>(true);
expectType<TypeEqual<typeof Only, CtorFromResolved<{ Only: typeof Only; n: 1 }>>>(true);

// 直接 Class / 同步工厂不再是合法 loader
expectType<TypeEqual<never, InferLoaderCtor<typeof A>>>(true);
expectType<TypeEqual<never, InferLoaderCtor<() => typeof A>>>(true);
expectType<
  TypeEqual<typeof Only, InferLoaderCtor<() => Promise<{ default: typeof Only }>>>
>(true);
expectType<TypeEqual<A, InferLoaderInstance<() => Promise<typeof A>>>>(true);
