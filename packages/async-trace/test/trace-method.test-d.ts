import { type TypeEqual, expectType } from 'ts-expect';
import { type AsyncTraceRecord, traceMethod } from '../src';

// @ts-expect-error
@traceMethod('label')
class MyService {
  // @ts-expect-error
  @traceMethod('label')
  property: number = 2;

  @traceMethod('label')
  async method1() {}

  @traceMethod('label')
  static async method1() {}

  @traceMethod('label')
  async method2(_id: number, _visible: boolean) {
    return '';
  }

  @traceMethod('label', (record) => {
    expectType<TypeEqual<AsyncTraceRecord, typeof record>>(true);
  })
  async method3(_id: number, _visible: boolean) {
    return '';
  }

  @traceMethod((id, visible) => {
    expectType<number>(id);
    expectType<boolean>(visible);
    return '';
  })
  async method4(_id: number, _visible: boolean) {
    return {};
  }

  @traceMethod((id) => {
    expectType<number>(id);
    return '';
  })
  async method5(_id: number, _visible: boolean) {
    return {};
  }

  @traceMethod(() => '')
  async method6(_id: number, _visible: boolean) {
    return {};
  }

  @traceMethod(
    () => '',
    (record) => {
      expectType<TypeEqual<AsyncTraceRecord, typeof record>>(true);
    },
  )
  async method7() {
    return {};
  }

  @traceMethod('label')
  async method8<T>(): Promise<T> {
    return '' as T;
  }

  @traceMethod('label')
  async method9<T extends string>(): Promise<T> {
    return '' as T;
  }

  @traceMethod('label')
  method_with_generic<T extends string>(): Promise<T> {
    return new Promise((resolve) => {
      resolve('' as T);
    });
  }

  // @ts-expect-error
  @traceMethod()
  async method100(_id: number, _visible: boolean) {
    return {};
  }

  // @ts-expect-error
  @traceMethod((a, b, c) => {
    return '';
  })
  async method101(_id: number, _visible: boolean) {
    return {};
  }

  // @ts-expect-error
  @traceMethod('label')
  sync_method102() {}
}

const service = new MyService();

expectType<'abc'>(await service.method_with_generic<'abc'>());
// @ts-expect-error
expectType<'abcd'>(await service.method_with_generic<'abc'>());
