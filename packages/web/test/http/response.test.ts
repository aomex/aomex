import { describe, expect, test, vitest } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { createReadStream } from 'fs';
import { dirname } from 'node:path';
import { join } from 'path';
import stream, { Stream } from 'stream';
import createHttpError from 'http-errors';

const dir = dirname(import.meta.dirname);

describe('flush', () => {
  test('未设置body时默认为null', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    expect(res.body).toBeNull();
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith('Not Found');
    expect(res.statusCode).toBe(404);
  });

  test('主动设置null', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = null;
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith('');
    expect(res.statusCode).toBe(200);
  });

  test('null + json类型', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = null;
    res.contentType = 'application/json';
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith('null');
  });

  test('字符串', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = 'foo';
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith('foo');
  });

  test('对象', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = { test: 'foo' };
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith(JSON.stringify({ test: 'foo' }));
  });

  test('数组', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = [{ test: 'foo' }, { test1: 'bar' }];
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith(JSON.stringify([{ test: 'foo' }, { test1: 'bar' }]));
  });

  test('缓冲区', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    const buffer = Buffer.from([1, 2, 3]);
    res.body = buffer;
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith(buffer);
  });

  test('数据流', async () => {
    const reader = createReadStream(join(dir, 'fixture', 'upload-1.txt'));
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = reader;
    const pipeSpy = vitest.spyOn(reader, 'pipe');
    const resSpy = vitest.spyOn(res, 'end');
    res.flush();
    expect(pipeSpy).toHaveBeenCalledWith(res);
    expect(resSpy).toHaveBeenCalledTimes(0);
    stream.finished(reader, () => {
      expect(resSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('HEAD方法不返回内容', async () => {
    const { res } = await mockServer((agent) => agent.head('/'));
    res.body = 'foo';
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith();
  });

  test('204状态码不返回内容', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = 'foo';
    res.statusCode = 204;
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith();
  });

  test('未识别的状态码', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.statusCode = 277;
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    expect(spy).toHaveBeenCalledWith('277');
  });

  test('重复冲刷不生效', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    const spy = vitest.spyOn(res, 'end');
    res.flush();
    spy.mockReset();
    res.flush();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe('content-length', () => {
  test('字符串', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = 'foo';
    expect(res.contentLength).toBe(3);
    res.body = 'test';
    expect(res.contentLength).toBe(4);
    res.flush();
  });

  test('对象', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = { hello: 'world' };
    expect(res.contentLength).toBe(JSON.stringify({ hello: 'world' }).length);
    res.flush();
  });

  test('数据流', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = createReadStream(join(dir, 'fixture', 'upload-1.txt'));
    expect(res.contentLength).toBe(0);
    res.flush();
  });
});

test('isJSON', async () => {
  const { res } = await mockServer((agent) => agent.get('/'));

  expect(res.isJSON(null)).toBeFalsy();
  expect(res.isJSON('foo')).toBeFalsy();
  expect(res.isJSON(createReadStream(join(dir, 'fixture', 'upload-1.txt')))).toBeFalsy();
  expect(res.isJSON(Buffer.from([1]))).toBeFalsy();

  expect(res.isJSON({})).toBeTruthy();
  expect(res.isJSON([])).toBeTruthy();
  res.flush();
});

describe('重定向', () => {
  test('html', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.redirect('http://example.com');
    expect(res.body).toBe(
      '正在重定向到 <a href="http://example.com/">http://example.com</a>',
    );
    expect(res.statusCode).toBe(302);
    res.flush();
  });

  test('text', async () => {
    const { res } = await mockServer((agent) => agent.get('/').set('Accept', 'text'));
    res.redirect('http://example.com');
    expect(res.body).toBe('正在重定向到 http://example.com');
    res.flush();
  });

  test('字符转义', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.redirect(`http://example.com?"'&<>你好`);
    expect(res.body).toBe(
      '正在重定向到 <a href="http://example.com/?%22%27&%3C%3E%E4%BD%A0%E5%A5%BD">http://example.com?&quot;&#39;&amp;&lt;&gt;你好</a>',
    );
    res.flush();
  });

  test('其他重定向状态码', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.redirect(301, 'http://example.com');
    expect(res.statusCode).toBe(301);
    res.flush();
  });

  test('报文Location', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.redirect('http://example.com?"<>');
    expect(res.getHeader('Location')).toBe('http://example.com/?%22%3C%3E');
    res.flush();
  });
});

describe('content-type', () => {
  test('字符串', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = 'foo';
    expect(res.contentType).toBe('text/plain');
    res.flush();
  });

  test('带标签的字符串', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = '<div>bar</div>';
    expect(res.contentType).toBe('text/html');
    res.flush();
  });

  test('null', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = null;
    expect(res.contentType).toBe('');
    res.flush();
  });

  test('对象', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = { foo: 'bar' };
    expect(res.contentType).toBe('application/json');
    res.flush();
  });

  test('数据流', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = createReadStream(join(dir, 'fixture', 'upload-1.txt'));
    expect(res.contentType).toBe('application/octet-stream');
    res.flush();
  });

  test('类型自动补全', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.contentType = 'json';
    expect(res.contentType).toBe('application/json');
    res.contentType = 'html';
    expect(res.contentType).toBe('text/html');
    res.flush();
  });

  test('手动设置类型后，再设置内容则不会自动判断类型', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.contentType = 'json';
    res.body = '"[]"';
    expect(res.contentType).toBe('application/json');
    res.flush();
  });

  test('无法识别的类型则报错', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    expect(() => (res.contentType = 'apppp')).toThrowError();
    res.flush();
  });
});

test('matchContentType', async () => {
  const { res } = await mockServer((agent) => agent.get('/'));
  expect(res.matchContentType('*/*')).toBeNull();
  res.body = {};
  expect(res.matchContentType('*/*')).toBe('application/json');
  res.flush();
});

describe('状态码', async () => {
  test('设置空状态码时，内容会被清除', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.body = 'foo';
    expect(res.body).toBe('foo');
    res.statusCode = 201;
    expect(res.body).toBe('foo');
    res.statusCode = 204;
    expect(res.body).toBeNull();
    res.flush();
  });

  test('状态码必须在100-999之间', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    expect(() => (res.statusCode = 10)).toThrowError();
    expect(() => (res.statusCode = 6000)).toThrowError();
    res.flush();
  });

  test('设置内容时，状态码也会被自动设置', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    expect(res.statusCode).toBe(404);
    res.body = 'foo';
    expect(res.statusCode).toBe(200);
    res.flush();
  });

  test('手动设置状态码时，设置内容不影响状态码', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.statusCode = 201;
    res.body = 'foo';
    expect(res.statusCode).toBe(201);
    res.flush();
  });
});

test('下载', async () => {
  const { res } = await mockServer((agent) => agent.get('/'));
  res.download(join(dir, 'fixture', 'upload-1.txt'));
  expect(res.body).toBeInstanceOf(Stream);
  expect(res.getHeader('Content-Disposition')).toBe(
    'attachment; filename="upload-1.txt"',
  );
  expect(res.contentType).toBe('text/plain');
  res.flush();
});

test('vary', async () => {
  const { res } = await mockServer((agent) => agent.get('/'));

  expect(res.vary('Origin')).toBe('Origin');
  expect(res.vary('Accept')).toBe('Origin, Accept');
  expect(res.getHeader('Vary')).toBe('Origin, Accept');
  res.flush();
});

test('批量设置报头', async () => {
  const { res } = await mockServer((agent) => agent.get('/'));
  expect(res.getHeaders()).toMatchInlineSnapshot(`{}`);
  res.setHeaders({
    'Vary': 'Origin',
    'Content-Type': 'application/json',
    'Content-Encoding': 'br',
  });
  expect(res.getHeaders()).toMatchInlineSnapshot(`
    {
      "content-encoding": "br",
      "content-type": "application/json",
      "vary": "Origin",
    }
  `);
  res.flush();
});

describe('error', () => {
  test('未知异常，使用500状态码', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    const spy = vitest.fn();
    app.addListener('error', spy);
    res.onError(new Error('foo bar'));
    expect(res.body).toBe('foo bar');
    expect(res.statusCode).toBe(500);
    expect(spy).toHaveBeenCalledOnce();
  });

  test('手动设置状态码', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    app.addListener('error', () => {});
    res.onError(createHttpError(403, 'foo bar'));
    expect(res.body).toBe('foo bar');
    expect(res.statusCode).toBe(403);
  });

  test('禁止导出报错内容', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    app.addListener('error', () => {});
    res.onError(
      createHttpError(403, 'foo bar', {
        expose: false,
      }),
    );
    expect(res.body).toBe('foo bar');
    expect(res.statusCode).toBe(403);
  });

  test('报头会被全部清空', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    app.addListener('error', () => {});
    res.setHeaders({ Origin: 'x', Accept: 'y' });
    expect(res.getHeaders()).toMatchInlineSnapshot(`
      {
        "accept": "y",
        "origin": "x",
      }
    `);
    res.onError(new Error('foo bar'));
    expect(res.getHeaders()).toMatchInlineSnapshot(`
      {
        "content-length": 7,
        "content-type": "text/plain; charset=utf-8",
      }
    `);
  });

  test('设置新的报文', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    app.addListener('error', () => {});
    res.setHeaders({ Origin: 'x', Accept: 'y' });
    const err = createHttpError('foo bar', {
      headers: { origin: 'xx', accept: 'yy' },
    });
    res.onError(err);
    expect(res.getHeaders()).toMatchInlineSnapshot(`
      {
        "accept": "yy",
        "content-length": 7,
        "content-type": "text/plain; charset=utf-8",
        "origin": "xx",
      }
    `);
  });

  test('ENOENT异常', async () => {
    const { res, app } = await mockServer((agent) => agent.get('/'));
    app.addListener('error', () => {});
    res.onError(createHttpError({ code: 'ENOENT' }));
    expect(res.statusCode).toBe(404);
  });
});

describe('cookie', () => {
  test('常规设置', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.setCookie('test1', 'foo');
    expect(res.getHeader('Set-Cookie')).toMatchInlineSnapshot(`
      [
        "test1=foo; Path=/; HttpOnly; SameSite=Strict",
      ]
    `);

    res.setCookie('test1', 'foo1');
    res.setCookie('test2', 'bar');
    expect(res.getHeader('Set-Cookie')).toMatchInlineSnapshot(`
      [
        "test1=foo; Path=/; HttpOnly; SameSite=Strict",
        "test1=foo1; Path=/; HttpOnly; SameSite=Strict",
        "test2=bar; Path=/; HttpOnly; SameSite=Strict",
      ]
    `);
    res.flush();
  });

  test('定制参数', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.setCookie('test1', 'foo', {
      sameSite: false,
      httpOnly: false,
      path: '/path/to',
    });
    res.setCookie('test2', 'bar', {
      sameSite: 'lax',
      httpOnly: false,
    });
    expect(res.getHeader('Set-Cookie')).toMatchInlineSnapshot(`
      [
        "test1=foo; Path=/path/to",
        "test2=bar; Path=/; SameSite=Lax",
      ]
    `);
    res.flush();
  });

  test('删除', async () => {
    const { res } = await mockServer((agent) => agent.get('/'));
    res.setCookie('test1', 'foo', {
      sameSite: false,
      httpOnly: false,
      maxAge: 300,
      path: '/path/to',
    });
    res.removeCookie('test1', {
      path: '/path/to',
    });
    expect(res.getHeader('Set-Cookie')).toMatchInlineSnapshot(`
      [
        "test1=foo; Max-Age=300; Path=/path/to",
        "test1=; Path=/path/to; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict",
      ]
    `);
    res.flush();
  });
});
