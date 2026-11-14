import { describe, expect, test } from 'vitest';
import { ConsoleError } from '../../src';

describe('ConsoleError', () => {
  test('new 可直接构造', () => {
    const err = new ConsoleError('oops');
    expect(err).toBeInstanceOf(ConsoleError);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('oops');
    expect(err.name).toBe('ConsoleError');
  });

  test('无 message 时用默认文案', () => {
    expect(new ConsoleError().message).toBe('Error');
  });

  test('properties 可带 code / cause', () => {
    const cause = new Error('root');
    const err = new ConsoleError('bad', { code: 'BAD', cause });
    expect(err.code).toBe('BAD');
    expect(err.cause).toBe(cause);
  });
});

describe('ConsoleError.from', () => {
  test('已是自制实例则原样返回', () => {
    const err = new ConsoleError('a', { code: 'A' });
    expect(ConsoleError.from(err)).toBe(err);
  });

  test('普通 Error → 自制 ConsoleError', () => {
    const raw = new Error('boom');
    const err = ConsoleError.from(raw);
    expect(err).toBeInstanceOf(ConsoleError);
    expect(err).not.toBe(raw);
    expect(err.message).toBe('boom');
  });

  test('迁移 Node ErrnoException 的 code / cause / name', () => {
    const cause = new Error('root');
    const raw = Object.assign(new Error('wrap'), {
      code: 'ENOENT',
      cause,
      name: 'ErrnoException',
    });
    const err = ConsoleError.from(raw);
    expect(err.message).toBe('wrap');
    expect(err.code).toBe('ENOENT');
    expect(err.cause).toBe(cause);
    expect(err.name).toBe('ErrnoException');
  });

  test('字符串 / null / 非 Error 对象', () => {
    expect(ConsoleError.from('oops').message).toBe('oops');
    expect(ConsoleError.from(null).message).toBe('Error');
    expect(ConsoleError.from(undefined).message).toBe('Error');
    // plain object 不猜测字段
    expect(ConsoleError.from({ message: 'x', code: 'OBJ' }).message).toBe('Error');
    expect(ConsoleError.from(123).message).toBe('Error');
  });
});

describe('ConsoleError.isError', () => {
  test('仅识别自制实例，覆盖 Error.isError', () => {
    const err = new ConsoleError('x');
    expect(ConsoleError.isError(err)).toBe(true);
    expect(Error.isError(err)).toBe(true);
    expect(ConsoleError.isError(new Error())).toBe(false);
    expect(Error.isError(new Error())).toBe(true);
  });
});
