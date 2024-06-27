import { type TypeEqual, expectType } from 'ts-expect';
import { pathToFiles } from '../src';

// 结果检测
const result = await pathToFiles('/');
expectType<TypeEqual<string[], typeof result>>(true);
