import { expectType, type TypeEqual } from 'ts-expect';
import { toArray } from '../src';

// 字符串
expectType<string[]>(toArray('a'));

// 数字
expectType<number[]>(toArray(2));

// 数组
expectType<(number | string)[]>(toArray([2, '3']));

// readonly类型
const result = toArray(<const>[2, '3']);
expectType<TypeEqual<(2 | '3')[], typeof result>>(true);
expectType<TypeEqual<(number | string)[], typeof result>>(false);
