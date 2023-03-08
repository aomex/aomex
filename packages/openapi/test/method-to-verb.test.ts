import { methodToVerb } from '../src/method-to-verb';

test('get', () => {
  expect(methodToVerb('GET', '/abc')).toBe('list');
  expect(methodToVerb('GET', '/abc/:id')).toBe('get');
});

test('post', () => {
  expect(methodToVerb('POST', '/abc')).toBe('create');
  expect(methodToVerb('POST', '/abc/:id')).toBe('create');
});

test('put', () => {
  expect(methodToVerb('PUT', '/abc')).toBe('replace');
  expect(methodToVerb('PUT', '/abc/:id')).toBe('replace');
});

test('patch', () => {
  expect(methodToVerb('PATCH', '/abc')).toBe('update');
  expect(methodToVerb('PATCH', '/abc/:id')).toBe('update');
});

test('delete', () => {
  expect(methodToVerb('DELETE', '/abc')).toBe('delete');
  expect(methodToVerb('DELETE', '/abc/:id')).toBe('delete');
});
