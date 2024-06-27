import { type TypeEqual, expectType } from 'ts-expect';
import { sleep } from '../src';

sleep(10);
// @ts-expect-error
sleep();
// @ts-expect-error
sleep('');

const promise = sleep(1);
expectType<TypeEqual<Promise<void>, typeof promise>>(true);
