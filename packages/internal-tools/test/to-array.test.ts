import { expect, test } from 'vitest';
import { toArray } from '../src';

test('非数组转数组', () => {
  expect(toArray('a')).toStrictEqual(['a']);
  expect(toArray(2)).toStrictEqual([2]);
  expect(toArray({ hello: 'test' })).toStrictEqual([{ hello: 'test' }]);
});

test('数组转数组', () => {
  expect(toArray(['a', 'a', 'b'])).toStrictEqual(['a', 'a', 'b']);
});

test('数组去重', () => {
  expect(toArray(['a', 'a', 'b'], true)).toStrictEqual(['a', 'b']);
});
