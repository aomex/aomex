import { TestConsoleApp } from '../../src/testing';
import { expect, test } from 'vitest';
import { ConsoleInput } from '../../src';
const app = new TestConsoleApp({});

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

test('parse-numbers 关闭时数字形参数保持字符串', () => {
  const input = new ConsoleInput(app, ['cmd', '--port', '3000', '-n', '01']);
  expect(input.parseArgv()).toStrictEqual({
    port: '3000',
    n: '01',
  });
  expect(input.options).toStrictEqual({
    port: '3000',
    n: '01',
  });
});

test('布尔开关与 --no- 取反', () => {
  const input = new ConsoleInput(app, ['cmd', '--verbose', '--no-color']);
  expect(input.parseArgv()).toStrictEqual({
    verbose: true,
    color: false,
  });
});
