import { test, expect, describe } from 'vitest';
import { HashValidator, rule } from '../../../core/src';
import { testOK, testFail, testOpenapi } from '../helper';
import * as mocks from '../mocks/hash';

test('In rule props', async () => {
  expect(rule.hash('md5')).toBeInstanceOf(HashValidator);
});

describe('algorithms', () => {
  const testMatrixs: Record<string, HashValidator.Algorithm[]> = {};
  Object.entries(HashValidator.algorithmLength).forEach(
    ([algorithm, length]) => {
      testMatrixs[length] ||= [];
      testMatrixs[length]!.push(algorithm as HashValidator.Algorithm);
    },
  );

  Object.entries(testMatrixs).forEach(([length, matrix]) => {
    test('valid: ' + matrix.join(', '), async () => {
      for (const algorithm of matrix) {
        await testOK(
          rule.hash(algorithm),
          // @ts-expect-error
          mocks[`valid${length}hashes`],
        );
      }
    });

    test('invalid: ' + matrix.join(', '), async () => {
      for (const algorithm of matrix) {
        await testFail(
          rule.hash(algorithm),
          // @ts-expect-error
          mocks[`invalid${length}hashes`],
          `must be ${algorithm} hash`,
        );
      }
    });
  });
});

test('unknown algorithm', async () => {
  // @ts-expect-error
  await testFail(rule.hash('abc'), ['xxx'], 'unknown hash: abc');
});

test('invalid hash types', async () => {
  await testFail(rule.hash('md5'), mocks.invalidHashTypes, 'must be string');
});

testOpenapi({
  required: rule.hash('md5'),
  optional: rule.hash('md5').optional(),
  withDefault: rule.hash('md5').optional().default('some-hash'),
  withDocs: rule.hash('sha1'),
});
