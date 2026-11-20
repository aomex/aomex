import { describe, expect, test } from 'vitest';
import { HttpError } from '../../src';
import { mockServer } from '../fixture/mock-server';

/** 模拟第三方（如 http-errors）抛出的形态 */
const foreignHttpError = (
  statusCode: number,
  message: string,
  extra?: { headers?: Record<string, string>; code?: string; expose?: boolean },
) => {
  const err = new Error(message);
  err.name = 'ForbiddenError';
  Object.assign(err, {
    status: statusCode,
    statusCode,
    expose: extra?.expose ?? statusCode < 500,
    headers: extra?.headers,
    code: extra?.code,
  });
  return err;
};

describe('HttpError', () => {
  test('new 可直接构造', () => {
    const err = new HttpError(404, 'missing');
    expect(err).toBeInstanceOf(HttpError);
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('missing');
    expect(err.expose).toBe(true);
    expect(err.name).toBe('HttpError');
    expect(err).not.toHaveProperty('status');
  });

  test('无 message 时用 statuses 默认文案', () => {
    const err = new HttpError(403);
    expect(err.message).toBe('Forbidden');
  });

  test('5xx 默认 expose=false，可被 properties 覆盖', () => {
    expect(new HttpError(500).expose).toBe(false);
    expect(new HttpError(500, 'x', { expose: true }).expose).toBe(true);
  });

  test('properties 可带 code / headers / cause', () => {
    const cause = new Error('root');
    const err = new HttpError(400, 'bad', {
      code: 'BAD',
      headers: { 'x-a': '1' },
      cause,
    });
    expect(err.code).toBe('BAD');
    expect(err.headers).toEqual({ 'x-a': '1' });
    expect(err.cause).toBe(cause);
  });
});

describe('HttpError.from', () => {
  test('已是自制实例则原样返回', () => {
    const err = new HttpError(400, 'a');
    expect(HttpError.from(err)).toBe(err);
  });

  test('普通 Error → 自制 HttpError', () => {
    const raw = new Error('boom');
    const err = HttpError.from(raw);
    expect(err).toBeInstanceOf(HttpError);
    expect(err).not.toBe(raw);
    expect(err.message).toBe('boom');
    expect(err.statusCode).toBe(500);
    expect(err.expose).toBe(false);
  });

  test('第三方类 http-errors 形态 → 自制 HttpError', () => {
    const raw = foreignHttpError(403, 'nope', {
      headers: { 'x-a': '1' },
      code: 'FORBIDDEN',
    });
    const err = HttpError.from(raw);
    expect(err).toBeInstanceOf(HttpError);
    expect(err).not.toBe(raw);
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('nope');
    expect(err.expose).toBe(true);
    expect(err.headers).toEqual({ 'x-a': '1' });
    expect(err.code).toBe('FORBIDDEN');
    expect(err.name).toBe('ForbiddenError');
    expect(err).not.toHaveProperty('status');
  });

  test('仅有 status 无 statusCode', () => {
    const raw = Object.assign(new Error('x'), {
      status: 418,
      expose: true,
    });
    const err = HttpError.from(raw);
    expect(err).toBeInstanceOf(HttpError);
    expect(err.statusCode).toBe(418);
  });

  test('字符串 / 属性对象', () => {
    expect(HttpError.from('oops').message).toBe('oops');
    const enoent = HttpError.from({ code: 'ENOENT' });
    expect(enoent.code).toBe('ENOENT');
    expect(enoent.statusCode).toBe(404);
    expect(new HttpError(500, undefined, { code: 'ENOENT' }).statusCode).toBe(404);
  });

  test('非 Error 的 plain object', () => {
    const err = HttpError.from({
      statusCode: 422,
      message: 'invalid',
      code: 'UNPROCESSABLE',
      expose: true,
      headers: { 'x-a': '1' },
    });
    expect(err).toBeInstanceOf(HttpError);
    expect(err.statusCode).toBe(422);
    expect(err.message).toBe('invalid');
    expect(err.code).toBe('UNPROCESSABLE');
    expect(err.expose).toBe(true);
    expect(err.headers).toEqual({ 'x-a': '1' });
  });

  test('foreign error 带 cause', () => {
    const cause = new Error('root');
    const raw = Object.assign(new Error('wrap'), {
      statusCode: 400,
      expose: true,
      cause,
    });
    const err = HttpError.from(raw);
    expect(err.cause).toBe(cause);
  });

  test('null / undefined → 500', () => {
    expect(HttpError.from(null).statusCode).toBe(500);
    expect(HttpError.from(undefined).statusCode).toBe(500);
  });

  test('非 object/Error/string 的原始值 → 500', () => {
    expect(HttpError.from(123).statusCode).toBe(500);
    expect(HttpError.from(true).statusCode).toBe(500);
  });

  test('非 4xx/5xx 规范为 500', () => {
    const raw = Object.assign(new Error('ok'), {
      status: 200,
      statusCode: 200,
      expose: true,
    });
    expect(HttpError.from(raw).statusCode).toBe(500);
  });

  test('忽略无效 headers 值；仅 Set-Cookie 保留 string[]', () => {
    const raw = Object.assign(new Error('x'), {
      statusCode: 400,
      expose: true,
      headers: {
        'a': '1',
        'b': ['ok'],
        'c': { x: 1 },
        'd': 2,
        'e': [],
        'f': [1],
        'g': ['x', 2],
        'Set-Cookie': ['csrf=1; Path=/'],
      },
    });
    expect(HttpError.from(raw).headers).toEqual({
      'a': '1',
      'd': 2,
      'Set-Cookie': ['csrf=1; Path=/'],
    });
  });

  test('构造时可带 Set-Cookie 数组', () => {
    const err = new HttpError(403, 'nope', {
      headers: { 'Set-Cookie': ['csrfToken=abc; Path=/'] },
    });
    expect(err.headers).toEqual({
      'Set-Cookie': ['csrfToken=abc; Path=/'],
    });
  });

  test('构造时丢弃非 Set-Cookie 的数组头', () => {
    const err = new HttpError(400, 'x', {
      headers: {
        'a': '1',
        'Link': ['</a>; rel=preload', '</b>; rel=prefetch'],
        'Set-Cookie': ['a=1'],
      },
    });
    expect(err.headers).toEqual({ 'a': '1', 'Set-Cookie': ['a=1'] });
  });

  test('from 保留 Set-Cookie 数组', () => {
    const raw = Object.assign(new Error('x'), {
      statusCode: 403,
      expose: true,
      headers: {
        'Set-Cookie': ['csrfToken=from; Path=/', 'sid=1; Path=/'],
      },
    });
    expect(HttpError.from(raw).headers).toEqual({
      'Set-Cookie': ['csrfToken=from; Path=/', 'sid=1; Path=/'],
    });
  });

  test('from 对 set-cookie 大小写不敏感', () => {
    const raw = Object.assign(new Error('x'), {
      statusCode: 403,
      expose: true,
      headers: {
        'set-cookie': ['a=1; Path=/', 'b=2; Path=/'],
      },
    });
    expect(HttpError.from(raw).headers).toEqual({
      'set-cookie': ['a=1; Path=/', 'b=2; Path=/'],
    });
  });
});

describe('HttpError.isError', () => {
  test('仅识别自制实例，覆盖 Error.isError', () => {
    const err = new HttpError(404, 'x');
    expect(HttpError.isError(err)).toBe(true);
    expect(Error.isError(err)).toBe(true);
    expect(HttpError.isError(new Error())).toBe(false);
    expect(Error.isError(new Error())).toBe(true);
  });
});

describe('app.on(error) 收到自制 HttpError', () => {
  test('plain Error 经 onError 转换后 emit', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    let received: unknown;
    app.on('error', (err) => {
      received = err;
    });
    await res.onError(new Error('plain'));
    expect(received).toBeInstanceOf(HttpError);
    expect((received as HttpError).statusCode).toBe(500);
  });

  test('第三方形态经 onError 转换后 emit', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    let received: unknown;
    app.on('error', (err) => {
      received = err;
    });
    await res.onError(foreignHttpError(403, 'denied'));
    expect(received).toBeInstanceOf(HttpError);
    expect((received as HttpError).statusCode).toBe(403);
  });

  test('ctx.throw 抛出的已是自制实例', async () => {
    const { ctx, res, app } = await mockServer((agent) => agent.get('/'));
    let received: unknown;
    app.on('error', (err) => {
      received = err;
    });
    try {
      ctx.throw(401, 'auth');
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
      await res.onError(e as Error);
    }
    expect(received).toBeInstanceOf(HttpError);
    expect(received).toBeDefined();
  });
});
