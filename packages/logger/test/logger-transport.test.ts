const err = mockError(); // 为了保证stack的行号正确，必须在第一行

import { expect, test } from 'vitest';
import { MockTransport } from './mocks/mock-transport';
import { mockError } from './mocks/mock-error';
import { describe } from 'node:test';

const t = new MockTransport();

test('时间对象', () => {
  expect(t['dateToJSON'](new Date('2024-10-24T10:24:00+08:00'))).toMatchInlineSnapshot(`
    {
      "day": "24",
      "hour": "10",
      "minute": "24",
      "month": "10",
      "second": "00",
      "year": "2024",
    }
  `);
});

test('时间字符串', () => {
  expect(t['dateToString'](new Date('2024-10-24T10:24:00+08:00'))).toMatchInlineSnapshot(
    `"2024-10-24 10:24:00"`,
  );
});

describe('错误日志', () => {
  test('默认配置', () => {
    const { message, stack } = t['prettifyError'](err);

    expect(message).toMatchInlineSnapshot(`
    "Error: foo

    bar"
  `);
    expect(stack.split('\n').map((item) => item.replaceAll('\\', '/')))
      .toMatchInlineSnapshot(`
    [
      "    at Module.mockError (packages/common-logger/test/mocks/mock-error.ts:2:10)",
      "    at packages/common-logger/test/logger-transport.test.ts:1:13",
    ]
  `);
  });

  test('不删除node_modules', () => {
    expect(t['prettifyError'](err, { removeNodeModule: true }).stack).not.toContain(
      '/node_modules/',
    );
    expect(t['prettifyError'](err, { removeNodeModule: false }).stack).toContain(
      '/node_modules/',
    );
  });

  test('不删除node:internal', () => {
    expect(t['prettifyError'](err, { removeNodeInternal: true }).stack).not.toContain(
      'node:internal/',
    );
    expect(t['prettifyError'](err, { removeNodeInternal: false }).stack).toContain(
      'node:internal/',
    );
  });

  test('删除 at 前缀', () => {
    expect(t['prettifyError'](err, { removeAt: false }).stack).toContain(' at ');
    expect(t['prettifyError'](err, { removeAt: true }).stack).not.toContain(' at ');
  });
});
