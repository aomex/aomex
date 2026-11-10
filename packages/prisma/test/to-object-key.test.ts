import { expect, test } from 'vitest';
import { toObjectKey } from '../src/lib/to-object-key';

test('合法标识符原样返回', () => {
  expect(toObjectKey('user')).toBe('user');
  expect(toObjectKey('AliasTableName')).toBe('AliasTableName');
  expect(toObjectKey('snake_case')).toBe('snake_case');
  expect(toObjectKey('UPPERCASE')).toBe('UPPERCASE');
  expect(toObjectKey('_private')).toBe('_private');
  expect(toObjectKey('$')).toBe('$');
});

test('非法标识符用 JSON 字符串报价', () => {
  expect(toObjectKey('foo-bar')).toBe('"foo-bar"');
  expect(toObjectKey('123abc')).toBe('"123abc"');
  expect(toObjectKey('a b')).toBe('"a b"');
  expect(toObjectKey('你好')).toBe('"你好"');
});
