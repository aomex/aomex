import { expect, test } from 'vitest';
import { Service } from '../../src';

class MyService extends Service {
  action1() {
    return 'ok';
  }
}

test('注入services', () => {
  const services = {};
  const service = new MyService(services);
  expect(service['services']).toBe(services);
});

test('初始化后可直接使用', () => {
  const service = new MyService({});
  expect(service.action1()).toBe('ok');
});
