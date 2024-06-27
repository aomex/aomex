import { describe, expect, test } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { dirname, join } from 'path';
import { PersistentFile } from 'formidable';
import accepts from 'accepts';

test('method', async () => {
  const { req, res } = await mockServer((agent) => agent.get('/test/api'));
  expect(req.method).toBe('GET');
  res.end();
});

test('url', async () => {
  const { req, res } = await mockServer((agent) => agent.get('/test/api?a=b'));
  expect(req.url).toBe('/test/api?a=b');
  res.end();
});

test('host', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get('/test/api').set('Host', '128.0.0.1:5001'),
  );
  expect(req.host).toBe('128.0.0.1:5001');
  res.end();
});

test('href', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get('/test/api').set('Host', '128.0.0.1:5001'),
  );
  expect(req.href).toBe('http://128.0.0.1:5001/test/api');
  res.end();
});

test('origin', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get('/test/api').set('Host', '128.0.0.1:5001'),
  );
  expect(req.origin).toBe('http://128.0.0.1:5001');
  res.end();
});

test('pathname', async () => {
  const { req, res } = await mockServer((agent) => agent.get('/test/api?a=b'));
  expect(req.pathname).toBe('/test/api');
  res.end();
});

describe('protocol', () => {
  test('protocol:http', async () => {
    const { req, res } = await mockServer((agent) => agent.get('/test/api'));
    expect(req.protocol).toBe('http');
    expect(req.secure).toBeFalsy();
    res.end();
  });

  test('protocol:https', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('X-Forwarded-Proto', 'https'),
    );
    expect(req.protocol).toBe('https');
    expect(req.secure).toBeTruthy();
    res.end();
  });
});

test('querystring', async () => {
  const { req, res } = await mockServer((agent) => agent.get('/test/api?a=b'));
  expect(req.querystring).toBe('a=b');
  res.end();
});

test('查询字符串不会自动转义字符串', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get(`/test/api?a=b&c=${encodeURIComponent('=')}`),
  );
  expect(req.querystring).toBe('a=b&c=%3D');
  res.end();
});

test('query', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get(`/test/api?a=b&c=${encodeURIComponent('=')}`),
  );
  expect(req.query).toStrictEqual({ a: 'b', c: '=' });
  expect(req.query).toBe(req.query);
  res.end();
});

test('search', async () => {
  const { req, res } = await mockServer((agent) => agent.get('/test/api?a=b'));
  expect(req.search).toBe('?a=b');
  res.end();
});

describe('matchContentType', () => {
  test('GET请求', async () => {
    const { req, res } = await mockServer((agent) => agent.get('/test/api?a=b'));
    expect(req.matchContentType('*/*')).toBe(null);
    res.end();
  });

  test('POST请求', async () => {
    const { req: req1, res: res1 } = await mockServer((agent) =>
      agent.post('/test/api').send({}),
    );
    expect(req1.matchContentType('*/*')).toBe('application/json');
    expect(req1.matchContentType('application/*')).toBe('application/json');
    expect(req1.matchContentType('multipart/*')).toBeNull();

    const { req: req2, res: res2 } = await mockServer((agent) =>
      agent.post('/test/api').send('abc'),
    );
    expect(req2.matchContentType('*/*')).toBe('application/x-www-form-urlencoded');

    res1.end();
    res2.end();
  });

  test('传入多个匹配规则', async () => {
    const { req, res } = await mockServer((agent) => agent.post('/test/api').send({}));
    expect(req.matchContentType('multipart/*', 'text/*', 'application/*')).toBe(
      'application/json',
    );
    res.end();
  });
});

describe('body', () => {
  test('是异步的', async () => {
    const { req, res } = await mockServer((agent) => agent.post('/test/api').send({}));
    expect(req.body).toBeInstanceOf(Promise);
    res.end();
  });

  test('临时缓存', async () => {
    const { req, res } = await mockServer((agent) => agent.post('/test/api').send({}));
    await expect(req.body).resolves.toBe(await req.body);
    res.end();
  });

  test('获取json格式', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').send({ test: 'abc', test1: ['a', 1] }),
    );
    await expect(req.body).resolves.toStrictEqual({
      test: 'abc',
      test1: ['a', 1],
    });
    res.end();
  });

  test('获取FormData', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').field('test1', 'a').field('test2', 'b'),
    );
    expect(req.matchContentType('*/*')).toBe('multipart/form-data');
    await expect(req.body).resolves.toStrictEqual({
      test1: 'a',
      test2: 'b',
    });
    res.end();
  });

  test('接收文件', async () => {
    const dir = dirname(import.meta.dirname);
    const { req, res } = await mockServer((agent) =>
      agent
        .post('/test/api')
        .attach('file1', join(dir, 'fixture/upload-1.txt'))
        .attach('file2', join(dir, 'fixture/upload-2.txt'))
        .field('test1', 'a'),
    );

    const data = (await req.body) as {
      file1: [typeof PersistentFile];
      file2: [typeof PersistentFile];
      test1: string;
    };
    expect(data.test1).toBe('a');
    expect(data.file1[0]).toBeInstanceOf(PersistentFile);
    expect(data.file1[0]).toHaveProperty('size', 5);
    expect(data.file1[0]).toHaveProperty('originalFilename', 'upload-1.txt');
    expect(data.file2[0]).toBeInstanceOf(PersistentFile);
    expect(data.file2[0]).toHaveProperty('size', 7);
    expect(data.file2[0]).toHaveProperty('originalFilename', 'upload-2.txt');

    res.end();
  });
});

test('ip', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get('/test/api').set('x-client-id', '1.2.3.4'),
  );
  expect(req.ip).toBe('::ffff:127.0.0.1');
  res.end();
});

describe('fresh', () => {
  test('仅限GET+HEAD请求', async () => {
    for (const method of <const>['post', 'put', 'patch', 'delete', 'options']) {
      const { req, res } = await mockServer((agent) =>
        agent[method]('/test/api').set('if-none-match', 'foo'),
      );
      res.statusCode = 200;
      res.setHeader('etag', 'foo');
      expect(req.fresh).toBeFalsy();
      res.end();
    }

    for (const method of <const>['get', 'head']) {
      const { req, res } = await mockServer((agent) =>
        agent[method]('/test/api').set('if-none-match', 'foo'),
      );
      res.statusCode = 200;
      res.setHeader('etag', 'foo');
      expect(req.fresh).toBeTruthy();
      res.end();
    }
  });

  test('状态码需要是2xx & 304', async () => {
    for (const statusCode of [101, 301, 302, 307, 400, 404, 500, 503]) {
      const { req, res } = await mockServer((agent) =>
        agent.get('/test/api').set('if-none-match', 'foo'),
      );
      res.statusCode = statusCode;
      res.setHeader('etag', 'foo');
      expect(req.fresh).toBeFalsy();
      res.end();
    }

    for (const statusCode of [200, 201, 202, 204, 304]) {
      const { req, res } = await mockServer((agent) =>
        agent.get('/test/api').set('if-none-match', 'foo'),
      );
      res.statusCode = statusCode;
      res.setHeader('etag', 'foo');
      expect(req.fresh).toBeTruthy();
      res.end();
    }
  });

  test('etag不一致则内容过时', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('if-none-match', 'foo'),
    );
    res.statusCode = 200;
    res.setHeader('etag', 'bar');
    expect(req.fresh).toBeFalsy();
    res.end();
  });

  test('请求报文设置 cache-control: no-cache 则内容过时', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('if-none-match', 'foo').set('cache-control', 'no-cache'),
    );
    res.statusCode = 200;
    res.setHeader('etag', 'foo');
    expect(req.fresh).toBeFalsy();
    res.end();
  });
});

describe('content-type', () => {
  test('text', async () => {
    const { req, res } = await mockServer((agent) => agent.post('/test/api').send('abc'));
    expect(req.contentType).toBe('application/x-www-form-urlencoded');
    res.end();
  });

  test('手动指定', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').send('abc').set('content-type', 'text/javascript'),
    );
    expect(req.contentType).toBe('text/javascript');
    res.end();
  });

  test('json', async () => {
    const { req, res } = await mockServer((agent) => agent.post('/test/api').send({}));
    expect(req.contentType).toBe('application/json');
    res.end();
  });

  test('form-data', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').field('foo', 'bar'),
    );
    expect(req.contentType).toBe('multipart/form-data');
    res.end();
  });
});

test('accept', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.get('/test/api').field('foo', 'bar'),
  );
  expect(req.accept).toBeInstanceOf(accepts);
  expect(req.accept).toBe(req.accept);
  res.end();
});

test('cookies', async () => {
  {
    const { req, res } = await mockServer((agent) => agent.get('/test/api'));
    expect(req.cookies).toStrictEqual({});
    res.end();
  }

  {
    const { req, res } = await mockServer((agent) =>
      agent
        .get('/test/api')
        .set('Cookie', ['test1=foo', 'test2=bar', `test3=${encodeURIComponent('#')}`]),
    );
    expect(req.cookies).toStrictEqual({
      test1: 'foo',
      test2: 'bar',
      test3: '#',
    });
    res.end();
  }
});
