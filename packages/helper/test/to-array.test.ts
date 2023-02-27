import { test } from 'vitest';
import { toArray } from '../src';

test('non array', () => {
  expect(toArray('a')).toStrictEqual(['a']);
  expect(toArray(2)).toStrictEqual([2]);
  expect(toArray({ hello: 'test' })).toStrictEqual([{ hello: 'test' }]);
});

test('array', () => {
  expect(toArray(['a', 'a', 'b'])).toStrictEqual(['a', 'a', 'b']);
});

test('unique array', () => {
  expect(toArray(['a', 'a', 'b'], true)).toStrictEqual(['a', 'b']);
});
