import { test, expect } from 'vitest';
import { EnumValidator, rule } from '../../../core/src';
import { testOK, testFail, testOpenapi } from '../helper';

test('In rule props', async () => {
  expect(rule.enum(['x'])).toBeInstanceOf(EnumValidator);
});

test('Accept number', async () => {
  await testOK(rule.enum([123, 456, 789]), [123, 456]);
  await testFail(
    rule.enum([123, 456, 789]),
    [12, 34, 'a'],
    'not in enum range',
  );
});

test('Accept string', async () => {
  await testOK(rule.enum(['a', 'b', 'cdef g']), ['cdef g']);
  await testFail(
    rule.enum(['a', 'b', 'cdef g']),
    [1, 'aa', 'B', 'cdefg'],
    'not in enum range',
  );
});

test('Accept boolean', async () => {
  await testOK(rule.enum([true]), [true]);
  await testOK(rule.enum([false]), [false]);
  await testOK(rule.enum([false, true]), [true, false]);
  await testFail(rule.enum([false, true]), [1, 'a', 'b'], 'not in enum range');
});

test('Accept mixin', async () => {
  const validator = rule.enum([true, false, 1, 2, 15, 'abcd']);
  await testOK(validator, [false, 15, 'abcd']);
  await testFail(validator, ['a', 'b', {}], 'not in enum range');
});

test('Do not input empty value', async () => {
  expect(() => rule.enum([''])).toThrowError('empty value');
});

testOpenapi({
  required: rule.enum(['a', 'b']),
  optional: rule.enum([1, 2, 3]).optional(),
  withDefault: rule.enum(['hello', 34, true]).optional().default('hello'),
  withDocs: rule.enum(['test me']),
});
