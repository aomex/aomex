import sleep from 'sleep-promise';
import { destroyServices, Service } from '../src';
import { expect, test } from 'vitest';

class MyService1 extends Service {
  public data = '123';

  protected override async destroy() {
    await sleep(100);
    this.data = 'destroyed-service1';
  }
}
class MyService2 extends Service {
  public data = '456';

  protected override async destroy() {
    this.data = 'destroyed-service2';
  }
}

test('销毁服务层', async () => {
  const services = {
    a: new MyService1({}),
    b: new MyService2({}),
  };

  expect(services.a.data).toBe('123');
  expect(services.b.data).toBe('456');
  await destroyServices(services);
  expect(services.a.data).toBe('destroyed-service1');
  expect(services.b.data).toBe('destroyed-service2');
});
