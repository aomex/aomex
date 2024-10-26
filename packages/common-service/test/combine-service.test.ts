import { expect, test } from 'vitest';
import { Service, combineServices } from '../src';
import sleep from 'sleep-promise';

class MyService1 extends Service {
  public data = '';

  protected override async init() {
    await sleep(100);
    this.data = '123';
  }

  action1() {
    return 'action1';
  }
}
class MyService2 extends Service {
  action2() {
    return 'action2';
  }
}

test('组合服务', async () => {
  const promise = combineServices({
    s1: MyService1,
    s2: MyService2,
  });
  expect(promise).toBeInstanceOf(Promise);

  const services = await promise;
  expect(services.s1).toBeInstanceOf(MyService1);
  expect(services.s2).toBeInstanceOf(MyService2);
});

test('单例模式', async () => {
  const services = await combineServices({
    s1: MyService1,
    s2: MyService2,
  });
  expect(services.s1).toBe(services.s1);
});

test('自动执行init方法', async () => {
  const services = await combineServices({
    s1: MyService1,
    s2: MyService2,
  });
  expect(services.s1.data).toBe('123');
});

test('组合不能再次修改', async () => {
  const services = await combineServices({
    s1: MyService1,
    s2: MyService2,
  });

  expect(() => {
    // @ts-expect-error
    services['a'] = 1;
  }).toThrowError('object is not extensible');
  expect(() => {
    // @ts-expect-error
    delete services.s1;
  }).toThrowError('Cannot delete property');
  expect(() => {
    // @ts-expect-error
    services.s1 = 'x';
  }).toThrowError('Cannot assign to read only property');
});
