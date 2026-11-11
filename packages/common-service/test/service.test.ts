import { expect, test } from 'vitest';
import { Service } from '../src';

class MyService extends Service {
  action1() {
    return 'ok';
  }

  internal() {
    return this.action1();
  }
}

test('无参构造后可直接使用', () => {
  const service = new MyService();
  expect(service.action1()).toBe('ok');
});

test('类内部 this 调用保持同步', () => {
  const service = new MyService();
  expect(service.internal()).toBe('ok');
});

test('displayName去掉service后缀', () => {
  class FooBarService extends Service {}
  expect(new FooBarService()['displayName']).toBe('FooBar');

  class FooBar extends Service {}
  expect(new FooBar()['displayName']).toBe('FooBar');
});

test('默认 onInit / onDestroy 可调用', async () => {
  class Plain extends Service {}
  const plain = new Plain();
  await expect(plain['onInit']()).resolves.toBeUndefined();
  await expect(plain['onDestroy']()).resolves.toBeUndefined();
});
