import { expect, test } from 'vitest';
import { traceMethod, type AsyncTraceRecord } from '../src';

test('装饰异步方法', async () => {
  class Service {
    @traceMethod('label')
    async plus(a: number, b: number) {
      return a + b;
    }
  }
  await expect(new Service().plus(1, 2)).resolves.toBe(3);
});

test('装饰方法返回promise', async () => {
  class Service {
    @traceMethod('label')
    plus(a: number, b: number) {
      return new Promise<number>((resolve) => {
        resolve(a + b);
      });
    }
  }
  await expect(new Service().plus(1, 2)).resolves.toBe(3);
});

test('获得记录', async () => {
  let snapshot!: AsyncTraceRecord;
  class Service {
    @traceMethod('label-foo', (record) => {
      snapshot = record;
    })
    async plus(a: number, b: number) {
      return a + b;
    }
  }
  await new Service().plus(1, 2);
  expect(snapshot).toMatchObject({
    label: 'label-foo',
  });
});

test('动态标签', async () => {
  let snapshot!: AsyncTraceRecord;
  class Service {
    @traceMethod(
      (a, b) => 'label-' + a + '-' + b,
      (record) => {
        snapshot = record;
      },
    )
    async plus(a: number, b: number) {
      return a + b;
    }
  }
  await new Service().plus(1, 2);
  expect(snapshot).toMatchObject({
    label: 'label-1-2',
  });
});
