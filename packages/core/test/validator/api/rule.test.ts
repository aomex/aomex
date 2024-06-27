import { expect, test } from 'vitest';
import {
  AnyValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateTimeValidator,
  EmailValidator,
  EnumValidator,
  HashValidator,
  IntValidator,
  IpValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StringValidator,
  UlidValidator,
  UrlValidator,
  UuidValidator,
  rule,
} from '../../../src';

test('any', () => {
  expect(rule.any()).toBeInstanceOf(AnyValidator);
});

test('array', () => {
  expect(rule.array()).toBeInstanceOf(ArrayValidator);
});

test('bigint', () => {
  expect(rule.bigint()).toBeInstanceOf(BigIntValidator);
});

test('boolean', () => {
  expect(rule.boolean()).toBeInstanceOf(BooleanValidator);
});

test('buffer', () => {
  expect(rule.buffer()).toBeInstanceOf(BufferValidator);
});

test('dateTime', () => {
  expect(rule.dateTime()).toBeInstanceOf(DateTimeValidator);
});

test('email', () => {
  expect(rule.email()).toBeInstanceOf(EmailValidator);
});

test('enum', () => {
  expect(rule.enum(['a', 'b', 1])).toBeInstanceOf(EnumValidator);
});

test('hash', () => {
  expect(rule.hash('md5')).toBeInstanceOf(HashValidator);
});

test('int', () => {
  expect(rule.int()).toBeInstanceOf(IntValidator);
});

test('ip', () => {
  expect(rule.ip('v4')).toBeInstanceOf(IpValidator);
});

test('number', () => {
  expect(rule.number()).toBeInstanceOf(NumberValidator);
});

test('object', () => {
  expect(rule.object()).toBeInstanceOf(ObjectValidator);
});

test('oneOf', () => {
  expect(rule.oneOf([rule.string(), rule.number()])).toBeInstanceOf(OneOfValidator);
});

test('string', () => {
  expect(rule.string()).toBeInstanceOf(StringValidator);
});

test('ulid', () => {
  expect(rule.ulid()).toBeInstanceOf(UlidValidator);
});

test('url', () => {
  expect(rule.url()).toBeInstanceOf(UrlValidator);
});

test('uuid', () => {
  expect(rule.uuid('v4')).toBeInstanceOf(UuidValidator);
});
