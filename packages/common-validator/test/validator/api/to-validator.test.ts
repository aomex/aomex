import { expect, test } from 'vitest';
import { ObjectValidator, toValidator } from '../../../src';
import { MockValidator } from '../../mock/mock-validator';

test('传入验证器则不变', () => {
  const validator = new MockValidator();
  expect(toValidator(validator)).toBe(validator);
});

test('传入对象则返回对象验证器', () => {
  const validator = toValidator({
    x: new MockValidator(),
  });
  expect(validator).toBeInstanceOf(ObjectValidator);
});

test('传入空值则返回空值', () => {
  expect(toValidator(undefined)).toBeUndefined();
});
