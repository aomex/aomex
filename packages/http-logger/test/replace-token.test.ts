import { describe, expect, test, vitest } from 'vitest';
import { replaceToken } from '../src/replace-token';
import { HttpLoggerToken } from '../src';
import { stripVTControlCharacters, styleText } from 'node:util';

test('request', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.request,
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"<--"`);
});

test('response + 200', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.response,
    response: { statusCode: 200 },
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"-->"`);
});

test('response + 403', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.response,
    response: { statusCode: 403 },
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"xxx"`);
});

test('response + 请求未完成', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.response,
    request: { method: 'GET', ip: '::', url: '/' },
    response: { statusCode: 200 },
    startTime: process.hrtime(),
    finished: false,
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"-x-"`);
});

test('method', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.method,
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"GET"`);
});

test('url', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.url,
    request: { method: 'GET', ip: '::', url: '/foo/bar' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"/foo/bar"`);
});

describe('状态码', () => {
  test.each([200, 201, 202, 204])('绿色 %s', async (statusCode) => {
    const msg = await replaceToken({
      message: HttpLoggerToken.statusCode,
      response: { statusCode },
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });

    expect(msg).toBe(styleText('green', statusCode.toString()));
  });

  test.each([300, 301, 302, 308])('蓝绿色 %s', async (statusCode) => {
    const msg = await replaceToken({
      message: HttpLoggerToken.statusCode,
      response: { statusCode },
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });

    expect(msg).toBe(styleText('cyan', statusCode.toString()));
  });

  test.each([400, 401, 403, 404, 405, 406])('黄色 %s', async (statusCode) => {
    const msg = await replaceToken({
      message: HttpLoggerToken.statusCode,
      response: { statusCode },
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });

    expect(msg).toBe(styleText('yellow', statusCode.toString()));
  });

  test.each([500, 501, 502, 503, 504])('红色 %s', async (statusCode) => {
    const msg = await replaceToken({
      message: HttpLoggerToken.statusCode,
      response: { statusCode },
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });

    expect(msg).toBe(styleText('red', statusCode.toString()));
  });
});

describe('响应内容长度', async () => {
  test('0', async () => {
    const msg = await replaceToken({
      message: HttpLoggerToken.contentLength,
      response: { contentLength: 0 },
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });
    expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"0"`);
  });

  test('有值', async () => {
    const msg = await replaceToken({
      message: HttpLoggerToken.contentLength,
      response: { contentLength: 1520 },
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });
    expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"1.48kb"`);
  });

  test('未提供', async () => {
    const msg = await replaceToken({
      message: HttpLoggerToken.contentLength,
      request: { method: 'GET', ip: '::', url: '/' },
      startTime: process.hrtime(),
    });
    expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"-"`);
  });

  test('与空状态码一起', async () => {
    const msg = await replaceToken({
      message: HttpLoggerToken.contentLength,
      request: { method: 'GET', ip: '::', url: '/' },
      response: { statusCode: 204, contentLength: 123 },
      startTime: process.hrtime(),
    });
    expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"0"`);
  });
});

test('响应类型', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.contentType,
    request: { method: 'GET', ip: '::', url: '/' },
    response: { contentType: 'application/json' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"application/json"`);
});

test('时间', async () => {
  const spy = vitest.spyOn(Date, 'now').mockImplementationOnce(() => 1717471392000);
  const msg = await replaceToken({
    message: HttpLoggerToken.time,
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"2024-06-04 11:23:12"`);
  spy.mockRestore();
});

test('响应时间差', async () => {
  const start = process.hrtime();
  const spy = vitest.spyOn(process, 'hrtime').mockImplementationOnce(() => [0, 10000]);

  const msg = await replaceToken({
    message: HttpLoggerToken.duration,
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: start,
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"10μs"`);
  spy.mockRestore();
});

test('IP', async () => {
  const msg = await replaceToken({
    message: HttpLoggerToken.ip,
    request: { method: 'GET', ip: '::127.0.0.1', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"::127.0.0.1"`);
});

test('组合', async () => {
  const msg = await replaceToken({
    message: `  ${HttpLoggerToken.ip} ${HttpLoggerToken.method} ${HttpLoggerToken.url} ${HttpLoggerToken.method} ${HttpLoggerToken.statusCode} xx `,
    request: { method: 'GET', ip: '::127.0.0.1', url: '/foo/bar/baz' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(
    `"  ::127.0.0.1 GET /foo/bar/baz GET 404 xx "`,
  );
});

test('未知令牌', async () => {
  const msg = await replaceToken({
    message: `${HttpLoggerToken.statusCode} [status] [code]`,
    request: { method: 'GET', ip: '::127.0.0.1', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"404 [status] [code]"`);
});

test('自定义令牌', async () => {
  const msg = await replaceToken({
    message: `${HttpLoggerToken.statusCode} [status] [code] [custom]`,
    request: { method: 'GET', ip: '::127.0.0.1', url: '/' },
    tokens: {
      status: () => '706',
      custom: async () => 'foo-bar',
    },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"404 706 [code] foo-bar"`);
});

test('双括号', async () => {
  const msg = await replaceToken({
    message: `[${HttpLoggerToken.method}]`,
    request: { method: 'GET', ip: '::', url: '/' },
    startTime: process.hrtime(),
  });
  expect(stripVTControlCharacters(msg)).toMatchInlineSnapshot(`"[GET]"`);
});
