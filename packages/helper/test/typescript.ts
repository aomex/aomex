import { expectType, TypeEqual } from 'ts-expect';
import { chalk, toArray } from '../src';

{
  chalk.red('abc');
  chalk.green();
  chalk.bgRed();
}

{
  expectType<string[]>(toArray('a'));
  expectType<number[]>(toArray(2));
  expectType<(number | string)[]>(toArray([2, '3']));

  const result = toArray(<const>[2, '3']);
  expectType<TypeEqual<(2 | '3')[], typeof result>>(true);
  expectType<TypeEqual<(number | string)[], typeof result>>(false);
}
