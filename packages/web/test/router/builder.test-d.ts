import { type TypeEqual, expectType } from 'ts-expect';
import { Builder } from '../../src';

const action = { action: () => {} };
const builder = new Builder('', '/users/:id', ['GET'], action);

expectType<string>(builder.uri);
expectType<TypeEqual<Record<string, unknown> | false, ReturnType<typeof builder.match>>>(
  true,
);

const hit = builder.match('/users/1');
if (hit !== false) {
  expectType<Record<string, unknown>>(hit);
} else {
  expectType<false>(hit);
}
