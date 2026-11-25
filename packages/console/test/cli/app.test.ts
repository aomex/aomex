import { afterAll, expect, test, vitest } from 'vitest';
import { ConsoleApp, ConsoleError } from '../../src';
import { TestConsoleApp, createTestConsoleLogger } from '../../src/testing';
import { combineServices, middleware, Service } from '@aomex/common';
import { Logger } from '@aomex/logger';
import { i18n } from '../../src/i18n';

let consoleSpy = vitest.spyOn(console, 'error').mockImplementation(() => {});

afterAll(() => {
  consoleSpy.mockReset();
});

test('挂载全局中间件', () => {
  const m1 = middleware.mixin(() => {});
  const m2 = middleware.mixin(() => {});

  const app = new TestConsoleApp({ mount: [m1, m2, m2] });
  expect(app['middlewareList']).toStrictEqual([m1, m2, m2]);
});

test('执行指令', async () => {
  const app = new TestConsoleApp();
  const code = await app.run('foo');
  expect(code).toBe(1);
});

test('找到指令', async () => {
  const app = new TestConsoleApp({
    mount: [
      middleware.console((ctx) => {
        ctx.commandMatched = true;
      }),
    ],
  });
  await expect(app.run('any')).resolves.toBe(0);
});

test('传递参数', async () => {
  const originArgv = process.argv;
  process.argv = ['node', 'cli', 'foo', '--bar', 'baz', '-f', 'k'];
  const spy = vitest.fn();
  const app = new TestConsoleApp({
    mount: [
      middleware.console((ctx) => {
        ctx.commandMatched = true;
        spy(...ctx.input.argv);
      }),
    ],
  });
  await app.run();
  expect(spy).toHaveBeenCalledWith('foo', '--bar', 'baz', '-f', 'k');
  process.argv = originArgv;
});

test('深层指令', async () => {
  const app = new TestConsoleApp();
  expect(app.level).toBe(0);
  const p1 = app.run('foo');
  expect(app.level).toBe(1);
  app.run('bar');
  expect(app.level).toBe(2);
  app.run('baz');
  expect(app.level).toBe(3);
  await p1;
  expect(app.level).toBe(0);
});

test('报错日志', async () => {
  let msg = '';
  class CaptureLogger extends Logger {
    constructor() {
      super({ transports: [] });
    }
    override error(messageOrError: unknown, message?: string): void {
      msg = Error.isError(messageOrError)
        ? messageOrError.message
        : String(messageOrError);
      if (message === undefined) super.error(messageOrError);
      else super.error(messageOrError, message);
    }
  }
  const logger = new CaptureLogger();
  const app = new ConsoleApp({ services: [], logger, language: 'zh-CN' });
  await app.run('foo');
  expect(msg).toMatchInlineSnapshot(`"命令「foo」不存在"`);
});

test('自定义报错回调', async () => {
  const app = new TestConsoleApp();
  let msg = '';
  app.on('error', (err) => {
    msg = err.message;
  });
  await app.run('foo');
  expect(msg).toMatchInlineSnapshot(`"命令「foo」不存在"`);
});

test('on(error) 收到 ConsoleError，含业务 code', async () => {
  const app = new TestConsoleApp();
  let received: unknown;
  app.on('error', (err) => {
    received = err;
  });
  const code = await app.run('foo');
  expect(code).toBe(1);
  expect(received).toBeInstanceOf(ConsoleError);
  expect((received as ConsoleError).code).toBe('COMMAND_NOT_FOUND');
});

test('普通 Error 经 from 归一化后 emit', async () => {
  const app = new TestConsoleApp({
    mount: [
      middleware.console(() => {
        throw new Error('plain');
      }),
    ],
  });
  let received: unknown;
  app.on('error', (err) => {
    received = err;
  });
  await app.run('any');
  expect(received).toBeInstanceOf(ConsoleError);
  expect((received as ConsoleError).message).toBe('plain');
});

test('设置语言', async () => {
  const app1 = new TestConsoleApp({
    language: 'zh-CN',
    mount: [
      middleware.mixin(() => {
        expect(i18n.language).toBe('zh-CN');
      }),
    ],
  });
  await app1.run('foo:bar');

  const app2 = new TestConsoleApp({
    language: 'en-US',
    mount: [
      middleware.mixin(() => {
        expect(i18n.language).toBe('en-US');
      }),
    ],
  });
  await app2.run('foo:bar');
});

test('services：信号路径会等 onDestroy 完成再 exit', async () => {
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

  const logger = createTestConsoleLogger();
  const services = await combineServices({
    demo: async () => Demo,
  });
  await services.demo.ping();
  new ConsoleApp({ services, logger, language: 'zh-CN' });

  expect(handlers.has('SIGTERM')).toBe(true);
  handlers.get('SIGTERM')!();
  expect(destroyed).toBe(0);
  // services 与 registerLifecycle（含 Logger）并行销毁；须等全部完成才会 exit
  await vitest.waitFor(() => {
    expect(destroyed).toBe(1);
    expect(exit).toHaveBeenCalledWith(0);
  });

  once.mockRestore();
  exit.mockRestore();
});

test('services：beforeExit 调度销毁且不 exit', async () => {
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
      destroyed += 1;
    }
  }

  const logger = createTestConsoleLogger();
  const services = await combineServices({
    demo: async () => Demo,
  });
  await services.demo.ping();
  new ConsoleApp({ services, logger, language: 'zh-CN' });

  handlers.get('beforeExit')!();
  await vitest.waitFor(() => expect(destroyed).toBe(1));
  expect(exit).not.toHaveBeenCalled();

  once.mockRestore();
  exit.mockRestore();
});

test('services：支持数组', async () => {
  let destroyed = 0;
  const handlers = new Map<string | symbol, (...args: any[]) => void>();
  const once = vitest.spyOn(process, 'once').mockImplementation((event, fn) => {
    handlers.set(event, fn as (...args: any[]) => void);
    return process;
  });

  class Demo extends Service {
    ping() {
      return 1;
    }
    protected override async onDestroy() {
      destroyed += 1;
    }
  }

  const logger = createTestConsoleLogger();
  const s1 = await combineServices({
    a: async () => Demo,
  });
  const s2 = await combineServices({
    b: async () => Demo,
  });
  await s1.a.ping();
  await s2.b.ping();
  new ConsoleApp({ services: [s1, s2], logger, language: 'zh-CN' });

  handlers.get('beforeExit')!();
  await vitest.waitFor(() => expect(destroyed).toBe(2));

  once.mockRestore();
});
