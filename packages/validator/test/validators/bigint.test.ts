import { test, expect } from 'vitest';
import { BigIntValidator, rule } from '../../../core/src';
import { testOK, testFail, testOpenapi } from '../helper';
import { invalidBigint, looseBigint } from '../mocks/bigint';

test('In rule props', async () => {
  expect(rule.bigint()).toBeInstanceOf(BigIntValidator);
});

test('Valid bigint', async () => {
  await testOK(rule.bigint(), [123n, 0n]);
});

test('Loose bigint', async () => {
  await testOK(rule.bigint(), looseBigint, BigInt);
});

test('Invalid bigint', async () => {
  await testFail(rule.bigint(), invalidBigint, 'must be bigint');
});

testOpenapi({
  required: rule.bigint(),
  optional: rule.bigint().optional(),
  withDefault: rule.bigint().optional().default(12345n),
  withDocs: rule.bigint(),
});
