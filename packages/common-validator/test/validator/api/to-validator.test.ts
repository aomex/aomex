import { expect, test } from 'vitest';
import { ObjectValidator, rule, schema, toValidator } from '../../../src';
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

test('传入 schema 则返回对象验证器', () => {
  const userSchema = schema({
    id: rule.int(),
    name: rule.string(),
  });
  const validator = toValidator(userSchema);
  expect(validator).toBeInstanceOf(ObjectValidator);
  expect(validator).not.toBe(userSchema);
  expect(validator['config'].refName).toBeUndefined();
});

test('schema.asName 经 toValidator 写入 refName', () => {
  const userSchema = schema({
    id: rule.int(),
    name: rule.string(),
  }).asName('User');
  const validator = toValidator(userSchema);
  expect(validator).toBeInstanceOf(ObjectValidator);
  expect(validator['config'].refName).toBe('User');
});

test('链式改动经 copyConfig 清除 refName', () => {
  const validator = toValidator(schema({ id: rule.int() }).asName('User'));
  expect(validator['config'].refName).toBe('User');
  const chained = validator['optional']()['docs']({ title: 'u' });
  expect(chained['config'].refName).toBeUndefined();
  expect(chained).not.toBe(validator);
});

test('传入空值则返回空值', () => {
  expect(toValidator(undefined)).toBeUndefined();
});

test('嵌套裸对象递归转为 ObjectValidator', () => {
  const validator = toValidator({
    profile: {
      bio: rule.string(),
      nested: {
        count: rule.int(),
      },
    },
  }) as ObjectValidator;
  expect(validator).toBeInstanceOf(ObjectValidator);
  const profile = validator['config'].properties!['profile'] as ObjectValidator;
  expect(profile).toBeInstanceOf(ObjectValidator);
  const nested = profile['config'].properties!['nested'];
  expect(nested).toBeInstanceOf(ObjectValidator);
});

test('嵌套 schema 转为 ObjectValidator', () => {
  const profile = schema({ bio: rule.string() });
  const validator = toValidator({
    profile,
  }) as ObjectValidator;
  const profileValidator = validator['config'].properties!['profile'];
  expect(profileValidator).toBeInstanceOf(ObjectValidator);
});
