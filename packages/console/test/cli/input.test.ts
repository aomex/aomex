import { expect, test } from 'vitest';
import { ConsoleApp, ConsoleInput } from '../../src';

const app = new ConsoleApp();

test('识别指令', () => {
  const input = new ConsoleInput(app, ['foo', 'bar']);
  expect(input.command).toBe('foo');
});

test('空指令', () => {
  const input = new ConsoleInput(app, []);
  expect(input.command).toBe('');
});

test('识别参数', () => {
  const input = new ConsoleInput(app, ['foo', 'bar', '--data', 'abc', '-k', 'j']);
  expect(input.parseArgv()).toStrictEqual({
    data: 'abc',
    k: 'j',
  });
});

test('别名', () => {
  const input = new ConsoleInput(app, [
    'foo',
    'bar',
    '--data',
    'abc',
    '-k',
    'j',
    '-m',
    'n',
    '-z',
    '9',
  ]);
  expect(
    input.parseArgv({
      foo: ['k', 'm'],
    }),
  ).toStrictEqual({
    data: 'abc',
    foo: ['j', 'n'],
    k: ['j', 'n'],
    m: ['j', 'n'],
    z: '9',
  });
});
