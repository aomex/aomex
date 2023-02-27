import { test, expect } from 'vitest';
import { BooleanValidator, rule } from '../../../core/src';
import { testOK, testFail, testOpenapi } from '../helper';

test('In rule props', async () => {
  expect(rule.boolean()).toBeInstanceOf(BooleanValidator);
});

test('Default true values', async () => {
  await testOK(rule.boolean(), [true, 'true', 1, '1'], () => true);
});

test('Default false values', async () => {
  await testOK(rule.boolean(), [false, 'false', 0, '0'], () => false);
});

test('Customize true values', async () => {
  const values = ['ok', 'yes'];
  const validator = rule.boolean().trueValues(values);
  await testOK(validator, values, () => true);
  await testFail(validator, [true, 1], 'must be boolean');
});

test('Customize false values', async () => {
  const values = ['wrong', 'no'];
  const validator = rule.boolean().falseValues(values);
  await testOK(validator, values, () => false);
  await testFail(validator, [false, 0], 'must be boolean');
});

testOpenapi({
  required: rule.boolean(),
  optional: rule.boolean().optional(),
  withDefault: rule.boolean().optional().default(true),
  withDocs: rule.boolean(),
});
