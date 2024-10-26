import { expectType, type TypeEqual } from 'ts-expect';
import { Service, combineServices } from '../src';

class MyService1 extends Service {}
class MyService2 extends Service {}

const services = await combineServices({
  s1: MyService1,
  s2: MyService2,
});

// 所有属性变成只读
expectType<
  TypeEqual<
    {
      readonly s1: MyService1;
      readonly s2: MyService2;
    },
    typeof services
  >
>(true);

expectType<
  TypeEqual<
    {
      s1: MyService1;
      s2: MyService2;
    },
    typeof services
  >
>(false);
