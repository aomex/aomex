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

describe('query', async () => {
  test('缓存', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get(`/test/api?a=b&c=${encodeURIComponent('=')}`),
    );
    expect(req.query).toBe(req.query);
    res.end();
  });

  test('普通字符串', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get(`/test/api?a=b&c=${encodeURIComponent('=')}`),
    );
    expect(req.query).toMatchInlineSnapshot(`
      {
        "a": "b",
        "c": "=",
      }
    `);
    expect(req.query).toBe(req.query);
    res.end();
  });

  test('逗号字符串', async () => {
    const { req, res } = await mockServer((agent) => agent.get(`/test/api?a=i,j,k`));
    expect(req.query).toMatchInlineSnapshot(`
      {
        "a": "i,j,k",
      }
    `);
    expect(req.query).toBe(req.query);
    res.end();
  });

  test('数组', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get(`/test/api?token[]=foo&token[]=bar&meme[0]=x&meme[1]=y&pepe[]=z`),
    );
    expect(req.query).toMatchInlineSnapshot(`
      {
        "meme": [
          "x",
          "y",
        ],
        "pepe": [
          "z",
        ],
        "token": [
          "foo",
          "bar",
        ],
      }
    `);
    res.end();
  });
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
  test('是同步的', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').send({ foo: 'bar' }),
    );
    expect(req.body).toMatchInlineSnapshot(`
      {
        "foo": "bar",
      }
    `);
    res.end();
  });

  test('获取json格式', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').send({ test: 'abc', test1: ['a', 1] }),
    );
    expect(req.body).toStrictEqual({
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
    expect(req.body).toStrictEqual({
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

    const data = req.body as {
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

  test('rawBody', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').send({ test: 'abc', test1: ['a', 1] }),
    );
    expect(req.rawBody).toMatchInlineSnapshot(`"{"test":"abc","test1":["a",1]}"`);
    res.end();
  });

  test('不解析无效的content-type', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.post('/test/api').set('Content-Type', 'image/jpg').send('abc'),
    );
    expect(req.body).toMatchInlineSnapshot(`{}`);
    res.end();
  });
});

describe('ip', () => {
  test('detect 模式：XFF 取第一个合法 IP', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('x-forwarded-for', 'unknown, 5.6.7.8:1234, 9.9.9.9'),
    );
    expect(req.ip).toBe('5.6.7.8');
    res.end();
  });

  test('detect 模式：x-real-ip', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('x-real-ip', '10.0.0.2'),
    );
    expect(req.ip).toBe('10.0.0.2');
    res.end();
  });

  test('detect 模式：cf-connecting-ip', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('cf-connecting-ip', '8.8.8.8'),
    );
    expect(req.ip).toBe('8.8.8.8');
    res.end();
  });

  test('detect 模式：XFF 优先于 x-real-ip', async () => {
    const { req, res } = await mockServer((agent) =>
      agent
        .get('/test/api')
        .set('x-real-ip', '172.31.41.116')
        .set('x-forwarded-for', '107.77.213.113, 172.31.41.116'),
    );
    expect(req.ip).toBe('107.77.213.113');
    res.end();
  });

  test('detect 模式：不信任弱头，回退 socket', async () => {
    const { req, res } = await mockServer((agent) =>
      agent
        .get('/test/api')
        .set('x-client-ip', '1.2.3.4')
        .set('x-forwarded', '5.6.7.8')
        .set('forwarded-for', '9.9.9.9')
        .set('cf-pseudo-ipv4', '8.8.8.8'),
    );
    expect(req.ip).toBe('::ffff:127.0.0.1');
    res.end();
  });

  test('detect 模式：非法头回退 socket', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('x-real-ip', 'not-an-ip'),
    );
    expect(req.ip).toBe('::ffff:127.0.0.1');
    res.end();
  });

  test('detect 模式：支持 IPv6', async () => {
    const { req, res } = await mockServer((agent) =>
      agent
        .get('/test/api')
        .set('x-forwarded-for', 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329'),
    );
    expect(req.ip).toBe('FE80:0000:0000:0000:0202:B3FF:FE1E:8329');
    res.end();
  });

  test('hops:1 取 XFF 最右合法 IP', async () => {
    const { req, res } = await mockServer(
      (agent) =>
        agent
          .get('/test/api')
          .set('x-forwarded-for', '1.1.1.1, 129.78.138.66, 129.78.64.103'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 } },
    );
    expect(req.ip).toBe('129.78.64.103');
    res.end();
  });

  test('hops:1 丢弃左侧伪造段', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-forwarded-for', '8.8.8.8, 93.186.30.120'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 } },
    );
    expect(req.ip).toBe('93.186.30.120');
    res.end();
  });

  test('hops:2 保留右侧两段再取最左合法 IP', async () => {
    const { req, res } = await mockServer(
      (agent) =>
        agent
          .get('/test/api')
          .set('x-forwarded-for', 'forged, 107.77.213.113, 172.31.41.116'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 2 } },
    );
    expect(req.ip).toBe('107.77.213.113');
    res.end();
  });

  test('specify 模式：XFF 支持 ipv4:port', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-forwarded-for', '93.186.30.120:12345'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 } },
    );
    expect(req.ip).toBe('93.186.30.120');
    res.end();
  });

  test('specify 模式：窗口内全非法则回退 socket', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-forwarded-for', 'unknown, not-an-ip'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 2 } },
    );
    expect(req.ip).toBe('::ffff:127.0.0.1');
    res.end();
  });

  test('自定义 header: x-real-ip', async () => {
    const { req, res } = await mockServer(
      (agent) =>
        agent
          .get('/test/api')
          .set('x-forwarded-for', '1.2.3.4')
          .set('x-real-ip', '129.78.138.66'),
      { proxyIP: { mode: 'specify', hops: 1, header: 'x-real-ip' } },
    );
    expect(req.ip).toBe('129.78.138.66');
    res.end();
  });

  test('自定义 header: cf-connecting-ip', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('cf-connecting-ip', '8.8.8.8'),
      { proxyIP: { mode: 'specify', hops: 1, header: 'cf-connecting-ip' } },
    );
    expect(req.ip).toBe('8.8.8.8');
    res.end();
  });

  test('允许已知列表外的自定义 header 名', async () => {
    const { req, res } = await mockServer(
      (agent) =>
        agent
          .get('/test/api')
          .set('x-forwarded-for', '1.2.3.4')
          .set('x-custom-client-ip', '203.0.113.50'),
      { proxyIP: { mode: 'specify', header: 'x-custom-client-ip', hops: 1 } },
    );
    expect(req.ip).toBe('203.0.113.50');
    res.end();
  });

  test('非法自定义头回退 socket', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-real-ip', 'not-an-ip'),
      { proxyIP: { mode: 'specify', hops: 1, header: 'x-real-ip' } },
    );
    expect(req.ip).toBe('::ffff:127.0.0.1');
    res.end();
  });

  test('结果会缓存，后续改头不影响', async () => {
    const { req, res } = await mockServer((agent) =>
      agent.get('/test/api').set('x-real-ip', '10.0.0.2'),
    );
    expect(req.ip).toBe('10.0.0.2');
    req.headers['x-real-ip'] = '1.2.3.4';
    expect(req.ip).toBe('10.0.0.2');
    res.end();
  });

  test('hops:0 强制只用 socket', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-forwarded-for', '1.2.3.4'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 0 } },
    );
    expect(req.ip).toBe('::ffff:127.0.0.1');
    res.end();
  });

  test('hops 大于列表长度时使用全部段', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-forwarded-for', '10.0.0.1, 10.0.0.2'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 5 } },
    );
    expect(req.ip).toBe('10.0.0.1');
    res.end();
  });

  test('窗口内最右非法则取更左的合法 IP', async () => {
    const { req, res } = await mockServer(
      (agent) =>
        agent.get('/test/api').set('x-forwarded-for', '9.9.9.9, 1.2.3.4, unknown'),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 2 } },
    );
    expect(req.ip).toBe('1.2.3.4');
    res.end();
  });

  test('header 配置大小写不敏感', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-real-ip', '203.0.113.10'),
      { proxyIP: { mode: 'specify', hops: 1, header: 'X-Real-IP' } },
    );
    expect(req.ip).toBe('203.0.113.10');
    res.end();
  });

  test('重复代理头以数组形式出现时可解析', async () => {
    const { req, res } = await mockServer((agent) => agent.get('/test/api'), {
      proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 },
    });
    // @ts-expect-error Node 重复头运行时可为 string[]
    req.headers['x-forwarded-for'] = ['1.1.1.1', '2.2.2.2'];
    expect(req.ip).toBe('2.2.2.2');
    res.end();
  });

  test('空代理头回退 socket', async () => {
    const { req, res } = await mockServer(
      (agent) => agent.get('/test/api').set('x-forwarded-for', ''),
      { proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 } },
    );
    expect(req.ip).toBe('::ffff:127.0.0.1');
    res.end();
  });
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
    expect(req.cookies).toStrictEqual(Object.create(null));
    res.end();
  }

  {
    const { req, res } = await mockServer((agent) =>
      agent
        .get('/test/api')
        .set('Cookie', ['test1=foo', 'test2=bar', `test3=${encodeURIComponent('#')}`]),
    );
    expect(req.cookies).toMatchInlineSnapshot(`
      {
        "test1": "foo",
        "test2": "bar",
        "test3": "#",
      }
    `);
    res.end();
  }
});
