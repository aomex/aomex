import { destroyServices, Service } from '../src';

class MyService1 extends Service {}
class MyService2 extends Service {}

const services = {
  a: new MyService1({}),
  b: new MyService2({}),
};

await destroyServices(services);
await destroyServices({});
await destroyServices({
  // @ts-expect-error
  a: {},
});
await destroyServices({
  // @ts-expect-error
  a: [],
});
