import { describe, expect, test, vitest } from 'vitest';
import { WebApp } from '../../src';
import { combineServices, middleware, Service } from '@aomex/common';
import supertest from 'supertest';
import { Server } from 'http';
import fs from 'node:fs';
import { join } from 'path';
import { i18n } from '../../src/i18n';

describe('debug', () => {
  test('通过配置开启', () => {
    const app = new WebApp({ debug: true });
    expect(app.debug).toBeTruthy();
  });

  test('通过配置关闭', () => {
    const app = new WebApp({ debug: false });
    expect(app.debug).toBeFalsy();
  });

  test('通过NODE_ENV判断', () => {
    const app = new WebApp();
    expect(app.debug).toBeTruthy();
    process.env['NODE_ENV'] = 'production';
    expect(app.debug).toBeFalsy();
  });

  test('开启后500响应真实错误', async () => {
    const app = new WebApp({
      debug: true,
      mount: [
        middleware.web((ctx) => {
          ctx.throw(500, '数据库配置有问题');
        }),
      ],
    });
    await supertest(app.listen()).get('/').expect(500, '数据库配置有问题');
    app['options'].debug = false;
    await supertest(app.listen()).get('/').expect(500, 'Internal Server Error');
  });
});

test('挂载中间件', () => {
  const md1 = middleware.mixin(() => {});
  const md2 = middleware.web(() => {});
  const md3 = middleware.web(() => {});

  const app = new WebApp({ mount: [md3, md1, md2] });
  expect(app['middlewareList']).toStrictEqual([md3, md1, md2]);
});

describe('listen', () => {
  test('返回server', () => {
    const app = new WebApp();
    expect(app.listen()).toBeInstanceOf(Server);
  });

  test('监听指定端口', async () => {
    const app = new WebApp();
    const spy = vitest.fn();
    const server = app.listen(3456, spy);
    await new Promise((resolve, reject): void => {
      server.on('listening', resolve);
      server.on('error', reject);
    });
    expect(spy).toHaveBeenCalledOnce();
    expect(server.address()).toHaveProperty('port', 3456);
    expect(server.listening).toBeTruthy();
    server.close();
  });

  test('监听异常事件', async () => {
    const app = new WebApp();
    expect(app.listenerCount('error')).toBe(0);
    const server = app.listen(3457);
    await new Promise((resolve, reject): void => {
      server.on('listening', resolve);
      server.on('error', reject);
    });
    expect(app.listenerCount('error')).toBe(1);
  });

  test('请求时遍历中间件', async () => {
    let str = '';
    const app = new WebApp({
      mount: [
        middleware.mixin(async (_, next) => {
          str += 1;
          await next();
          str += 4;
        }),
        middleware.web(async (ctx, next) => {
          str += 2;
          await next();
          ctx.send('foo,bar');
          str += 3;
        }),
      ],
    });

    await supertest(app.listen()).get('/').expect(200, 'foo,bar');
    expect(str).toBe('1234');
  });
});

describe('日志', () => {
  test('打印日志', async () => {
    let errStr: string = '';
    const spy = vitest.spyOn(console, 'error').mockImplementationOnce((msg) => {
      errStr = msg;
    });
    const app = new WebApp({
      mount: [
        middleware.mixin(() => {
          throw new Error('foo bar');
        }),
      ],
    });

    await supertest(app.listen()).get('/');
    expect(spy).toHaveBeenCalledOnce();
    expect(errStr).toContain('foo bar');
    spy.mockRestore();
  });

  test('404状态下不打印日志', async () => {
    const spy = vitest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const app = new WebApp({
      mount: [
        middleware.web((ctx) => {
          ctx.throw(404, 'foo bar');
        }),
      ],
    });

    await supertest(app.listen()).get('/');
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  test('expose时不打印日志', async () => {
    const spy = vitest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const app = new WebApp({
      mount: [
        middleware.web((ctx) => {
          ctx.throw(500, 'foo bar', {
            expose: true,
          });
        }),
      ],
    });
    await supertest(app.listen()).get('/');
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });
});

test('设置语言', async () => {
  const app1 = new WebApp({
    language: 'zh_CN',
    mount: [
      middleware.mixin(() => {
        expect(i18n.language).toBe('zh_CN');
      }),
    ],
  });
  await supertest(app1.listen()).get('/');

  const app2 = new WebApp({
    language: 'en_US',
    mount: [
      middleware.mixin(() => {
        expect(i18n.language).toBe('en_US');
      }),
    ],
  });
  await supertest(app2.listen()).get('/');
});

test('https', async () => {
  const dir = join(import.meta.dirname, '..', 'fixture', 'ca');
  const app = new WebApp({
    mount: [
      middleware.web((ctx) => {
        ctx.send('protocol-' + ctx.request.protocol);
      }),
    ],
  });
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const server = app
    .https({
      key: fs.readFileSync(join(dir, 'priv-key.pem')),
      cert: fs.readFileSync(join(dir, 'pub-key.pem')),
    })
    .listen();

  await supertest(server).get('/').expect(200, 'protocol-https');
});

test('services：server close 时自动等 onDestroy 跑完', async () => {
  let destroyed = 0;
  class Demo extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      await new Promise((r) => setTimeout(r, 40));
      destroyed += 1;
    }
  }
  const services = await combineServices({ demo: async () => Demo });
  await services.demo.ping();

  const app = new WebApp({ services });
  const server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.on('listening', () => resolve());
    server.on('error', reject);
  });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  // close 回调返回时 destroy 可能仍在飞，需等到完成
  await vitest.waitFor(() => expect(destroyed).toBe(1));
});

test('services：支持数组', async () => {
  let destroyed = 0;
  class Demo extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      destroyed += 1;
    }
  }
  const s1 = await combineServices({ a: async () => Demo });
  const s2 = await combineServices({ b: async () => Demo });
  await s1.a.ping();
  await s2.b.ping();

  const app = new WebApp({ services: [s1, s2] });
  const server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.on('listening', () => resolve());
    server.on('error', reject);
  });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await vitest.waitFor(() => expect(destroyed).toBe(2));
});

test('services：SIGTERM 先关 server 再等 onDestroy 后 exit', async () => {
  let destroyed = 0;
  const handlers = new Map<string | symbol, (...args: any[]) => void>();
  const once = vitest.spyOn(process, 'once').mockImplementation((event, fn) => {
    handlers.set(event, fn as (...args: any[]) => void);
    return process;
  });
  const exit = vitest.spyOn(process, 'exit').mockImplementation((() => {}) as never);

  class Demo extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      await new Promise((r) => setTimeout(r, 40));
      destroyed += 1;
    }
  }

  const services = await combineServices({ demo: async () => Demo });
  await services.demo.ping();
  const app = new WebApp({ services });
  const server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.on('listening', () => resolve());
    server.on('error', reject);
  });

  expect(handlers.has('SIGTERM')).toBe(true);
  handlers.get('SIGTERM')!();
  expect(destroyed).toBe(0);
  await vitest.waitFor(() => expect(destroyed).toBe(1));
  expect(exit).toHaveBeenCalledWith(0);
  expect(server.listening).toBeFalsy();

  once.mockRestore();
  exit.mockRestore();
});
