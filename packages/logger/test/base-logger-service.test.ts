import { combineServices, internalDestroyServices } from '@aomex/common';
import { afterEach, describe, expect, test, vitest } from 'vitest';
import {
  BaseLoggerService,
  LOGGER_LEVELS,
  ConsoleTransport,
  type LogRecord,
} from '../src';
import { MockTransport } from './mocks/mock-transport';

afterEach(() => {
  vitest.restoreAllMocks();
});

class ProbeLoggerService extends BaseLoggerService {
  constructor(private readonly entries: BaseLoggerService.TransportEntry[] = []) {
    super();
  }

  protected createTransports() {
    return this.entries;
  }
}

const levelProbe = new ProbeLoggerService();

test('标准六级与 LOGGER_LEVELS 一致', () => {
  expect(LOGGER_LEVELS).toStrictEqual([
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
  ]);
});

describe('resolveLevelGate / isLevelEnabled', () => {
  test('undefined 全开', () => {
    expect(levelProbe['resolveLevelGate'](undefined)).toStrictEqual({
      minIndex: 0,
      maxIndex: 5,
    });
    expect(levelProbe['isLevelEnabled']('trace', undefined)).toBe(true);
    expect(levelProbe['isLevelEnabled']('fatal', undefined)).toBe(true);
  });

  test('单个 level 视为最低门槛', () => {
    expect(levelProbe['resolveLevelGate']('warn')).toStrictEqual({
      minIndex: 3,
      maxIndex: 5,
    });
    expect(levelProbe['isLevelEnabled']('info', 'warn')).toBe(false);
    expect(levelProbe['isLevelEnabled']('warn', 'warn')).toBe(true);
    expect(levelProbe['isLevelEnabled']('fatal', 'warn')).toBe(true);
  });

  test('{ min, max } 闭区间', () => {
    expect(levelProbe['resolveLevelGate']({ min: 'info', max: 'error' })).toStrictEqual({
      minIndex: 2,
      maxIndex: 4,
    });
    expect(levelProbe['isLevelEnabled']('debug', { min: 'info', max: 'error' })).toBe(
      false,
    );
    expect(levelProbe['isLevelEnabled']('info', { min: 'info', max: 'error' })).toBe(
      true,
    );
    expect(levelProbe['isLevelEnabled']('error', { min: 'info', max: 'error' })).toBe(
      true,
    );
    expect(levelProbe['isLevelEnabled']('fatal', { min: 'info', max: 'error' })).toBe(
      false,
    );
  });

  test('只写 min 或 max', () => {
    expect(levelProbe['resolveLevelGate']({ min: 'error' })).toStrictEqual({
      minIndex: 4,
      maxIndex: 5,
    });
    expect(levelProbe['resolveLevelGate']({ max: 'debug' })).toStrictEqual({
      minIndex: 0,
      maxIndex: 1,
    });
  });

  test('min > max 全部拒绝', () => {
    expect(levelProbe['isLevelEnabled']('warn', { min: 'error', max: 'info' })).toBe(
      false,
    );
  });
});

test('onInit 后六级方法可写日志', async () => {
  const transport = new MockTransport();
  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport }];
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });

  await services.logger.trace('t');
  await services.logger.debug('d');
  await services.logger.info('i');
  await services.logger.warn('w');
  await services.logger.error('e');
  await services.logger.fatal('f');
  await services.logger.flush();

  expect(transport.messages.map((m) => [m.level, m.message])).toStrictEqual([
    ['trace', 't'],
    ['debug', 'd'],
    ['info', 'i'],
    ['warn', 'w'],
    ['error', 'e'],
    ['fatal', 'f'],
  ]);
});

test('transport 按最低 level 过滤', async () => {
  const transport = new MockTransport();
  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport, level: 'warn' as const }];
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });

  await services.logger.info('skip');
  await services.logger.warn('w');
  await services.logger.error('e');
  await services.logger.fatal('f');
  await services.logger.flush();

  expect(transport.messages.map((m) => m.message)).toStrictEqual(['w', 'e', 'f']);
});

test('transport 按 { min, max } 过滤', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([
    { transport, level: { min: 'warn', max: 'error' } },
  ]);

  logger.info('skip');
  logger.warn('w');
  logger.error('e');
  logger.fatal('skip');
  await logger.flush();

  expect(transport.messages.map((m) => m.message)).toStrictEqual(['w', 'e']);
});

test('无 transport 时写日志不抛错', async () => {
  class SilentLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [];
    }
  }

  const services = await combineServices({
    logger: async () => SilentLoggerService,
  });
  await expect(services.logger.info('x')).resolves.toBeUndefined();
  await expect(services.logger.flush()).resolves.toBeUndefined();
});

test('onDestroy 会 flush 刷完队列并调用 transport.onDestroy', async () => {
  const transport = new MockTransport();
  const consume = vitest.spyOn(transport, 'consume');
  const onDestroy = vitest.spyOn(transport, 'onDestroy');

  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport }];
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });
  await services.logger.info('before-destroy');
  await internalDestroyServices([services]);

  expect(consume).toHaveBeenCalled();
  expect(onDestroy).toHaveBeenCalledOnce();
  expect(transport.messages).toHaveLength(1);
  expect(transport.messages[0]!.message).toBe('before-destroy');
});

test('disabled transport 不调用 onDestroy', async () => {
  const active = new MockTransport();
  const disabled = new MockTransport();
  const onDestroy = vitest.spyOn(disabled, 'onDestroy');

  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport: active }, { transport: disabled, disabled: true }];
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });
  await services.logger.info('x');
  await internalDestroyServices([services]);

  expect(onDestroy).not.toHaveBeenCalled();
  expect(active.messages).toHaveLength(1);
});

test('子类可 override 标准 level 方法', async () => {
  const transport = new MockTransport();
  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport }];
    }
    override info(message: string): void;
    override info(err: unknown): void;
    override info(err: unknown, message: string): void;
    override info(messageOrError: unknown, message?: string): void {
      if (typeof messageOrError === 'string' && message === undefined) {
        this.write('info', `[app] ${messageOrError}`);
      } else {
        this.write(
          'info',
          messageOrError,
          message !== undefined ? `[app] ${message}` : undefined,
        );
      }
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });
  await services.logger.info('hi');
  await services.logger.flush();
  expect(transport.messages[0]!.message).toBe('[app] hi');
});

test('子类可新增业务 level 方法（落到标准 write）', async () => {
  const transport = new MockTransport();
  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport }];
    }
    audit(message: string) {
      this.write('info', message);
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });
  await services.logger.audit('paid');
  await services.logger.flush();
  expect(transport.messages[0]).toMatchObject({ level: 'info', message: 'paid' });
});

test('createTransports 可使用内置 Console transport', async () => {
  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [
        {
          transport: new ConsoleTransport({
            output: process.stdout,
          }),
          level: 'fatal' as const,
        },
      ];
    }
  }

  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });
  await expect(services.logger.info('x')).resolves.toBeUndefined();
});

test('不经 combineServices 也可懒加载写日志', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  logger.info('direct');
  await logger.flush();
  expect(transport.messages).toHaveLength(1);
  expect(transport.messages[0]!.message).toBe('direct');
});

test('withBindings 写入带 bindings，可嵌套合并', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);

  await logger.withBindings({ requestId: 'r1' }, async () => {
    expect(logger.bindings()).toStrictEqual({ requestId: 'r1' });
    logger.info('outer');
    await logger.withBindings({ userId: 2, requestId: 'r2' }, async () => {
      expect(logger.bindings()).toStrictEqual({ requestId: 'r2', userId: 2 });
      logger.info('inner');
      logger.warn(new Error('soft'), 'handled');
    });
    logger.info('after-inner');
  });
  await logger.flush();

  expect(transport.messages[0]).toMatchObject({
    message: 'outer',
    bindings: { requestId: 'r1' },
  });
  expect(transport.messages[1]).toMatchObject({
    message: 'inner',
    bindings: { requestId: 'r2', userId: 2 },
  });
  expect(transport.messages[2]).toMatchObject({
    message: 'handled',
    bindings: { requestId: 'r2', userId: 2 },
    exception: { type: 'Error', message: 'soft' },
  });
  expect(transport.messages[3]).toMatchObject({
    message: 'after-inner',
    bindings: { requestId: 'r1' },
  });
  expect(logger.bindings()).toStrictEqual({});
});

test('空 bindings 不写入 LogRecord.bindings', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  await logger.withBindings({}, async () => {
    logger.info('plain');
  });
  await logger.flush();
  expect(transport.messages[0]!.bindings).toBeUndefined();
});

test('withBindings 回调必须返回 Promise', async () => {
  const logger = new ProbeLoggerService();
  const pending = logger.withBindings({ a: 1 }, async () => {
    expect(logger.bindings()).toStrictEqual({ a: 1 });
    return 42;
  });
  expect(pending).toBeInstanceOf(Promise);
  await expect(pending).resolves.toBe(42);
  expect(logger.bindings()).toStrictEqual({});
});

test('disabled transport 不 onInit / 不投递', async () => {
  const active = new MockTransport();
  const disabled = new MockTransport();
  const onInit = vitest.spyOn(disabled, 'onInit');
  const consume = vitest.spyOn(disabled, 'consume');

  const logger = new ProbeLoggerService([
    { transport: active },
    { transport: disabled, disabled: true },
  ]);
  logger.info('only-active');
  await logger.flush();

  expect(onInit).not.toHaveBeenCalled();
  expect(consume).not.toHaveBeenCalled();
  expect(disabled.messages).toHaveLength(0);
  expect(active.messages).toHaveLength(1);
  expect(active.messages[0]!.message).toBe('only-active');
});

test('单个 transport consume 失败不影响其它出口与后续日志', async () => {
  const ok = new MockTransport();
  const bad = new MockTransport();
  vitest.spyOn(bad, 'consume').mockRejectedValue(new Error('sink down'));
  const reported = vitest.spyOn(console, 'error').mockImplementation(() => {});

  const logger = new ProbeLoggerService([{ transport: bad }, { transport: ok }]);
  logger.info('first');
  logger.info('second');
  await expect(logger.flush()).resolves.toBeUndefined();

  expect(ok.messages.map((m) => m.message)).toStrictEqual(['first', 'second']);
  expect(reported).toHaveBeenCalled();
  expect(String(reported.mock.calls[0]![0])).toMatch(
    /MockTransport consume failed:[\s\S]*sink down/,
  );
  reported.mockRestore();
});

test('consume 前会 await 全部 transport.onInit', async () => {
  const order: string[] = [];
  class SlowInitTransport extends MockTransport {
    override async onInit(): Promise<void> {
      order.push('onInit:start');
      await new Promise((r) => setTimeout(r, 40));
      order.push('onInit:done');
    }

    override async consume(message: LogRecord): Promise<void> {
      order.push('consume');
      await super.consume(message);
    }
  }

  const transport = new SlowInitTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  logger.info('after-init');
  await logger.flush();

  expect(order).toStrictEqual(['onInit:start', 'onInit:done', 'consume']);
  expect(transport.messages).toHaveLength(1);
});

test('combineServices eager onInit 会等待 transport.onInit', async () => {
  let inited = false;
  class SlowInitTransport extends MockTransport {
    override async onInit(): Promise<void> {
      await new Promise((r) => setTimeout(r, 40));
      inited = true;
    }
  }

  class DemoLoggerService extends BaseLoggerService {
    protected createTransports() {
      return [{ transport: new SlowInitTransport() }];
    }
  }

  await combineServices({ logger: async () => DemoLoggerService }, { eager: ['logger'] });
  expect(inited).toBe(true);
});

test('多 transport 各自门槛', async () => {
  const t1 = new MockTransport();
  const t2 = new MockTransport();
  const logger = new ProbeLoggerService([
    { transport: t1, level: 'info' },
    { transport: t2, level: { min: 'warn', max: 'error' } },
  ]);

  logger.debug('d');
  logger.info('i');
  logger.warn('w');
  logger.error('e');
  logger.fatal('f');
  await logger.flush();

  expect(t1.messages.map((m) => m.message)).toStrictEqual(['i', 'w', 'e', 'f']);
  expect(t2.messages.map((m) => m.message)).toStrictEqual(['w', 'e']);
});

test('error(err) 序列化 stack，message 默认取 err.message', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const err = new Error('boom');
  logger.error(err);
  await logger.flush();

  expect(transport.messages).toHaveLength(1);
  expect(transport.messages[0]).toMatchObject({
    level: 'error',
    message: 'boom',
    exception: {
      type: 'Error',
      message: 'boom',
      stack: err.stack,
    },
  });
});

test('error(err, message) 自定义 message，仍带 exception', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const cause = new TypeError('bad');
  const err = new Error('outer', { cause });
  logger.error(err, 'checkout failed');
  await logger.flush();

  expect(transport.messages[0]).toMatchObject({
    level: 'error',
    message: 'checkout failed',
    exception: {
      type: 'Error',
      message: 'outer',
      stack: err.stack,
      cause: {
        type: 'TypeError',
        message: 'bad',
        stack: cause.stack,
      },
    },
  });
});

test('warn(err) 可带错误栈（可恢复异常）', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const err = new Error('soft');
  logger.warn(err, 'handled');
  await logger.flush();
  expect(transport.messages[0]).toMatchObject({
    level: 'warn',
    message: 'handled',
    exception: { type: 'Error', message: 'soft' },
  });
});

test('循环 cause 不炸栈', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const a = new Error('a');
  const b = new Error('b', { cause: a });
  (a as Error & { cause: Error }).cause = b;
  logger.error(a);
  await logger.flush();
  expect(transport.messages[0]!.exception?.cause?.message).toBe('b');
  expect(transport.messages[0]!.exception?.cause?.cause).toMatchObject({
    type: 'Error',
    message: '[Circular]',
  });
});

test('无 name / 无 stack 的 Error 仍可序列化', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const err = new Error('x');
  err.name = '';
  err.stack = undefined;
  const circular = new Error('c');
  circular.name = '';
  (circular as Error & { cause: Error }).cause = circular;
  logger.error(err);
  logger.error(circular);
  await logger.flush();
  expect(transport.messages[0]!.exception).toMatchObject({
    type: 'Error',
    message: 'x',
  });
  expect(transport.messages[0]!.exception?.stack).toBeUndefined();
  expect(transport.messages[1]!.exception?.cause).toMatchObject({
    type: 'Error',
    message: '[Circular]',
  });
});

test('unknown（非 Error）可直接记入 exception', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const caught: unknown = { code: 42 };
  logger.error(caught, 'from catch');
  logger.error(404);
  logger.error(null);
  logger.error(undefined);
  await logger.flush();

  expect(transport.messages[0]).toMatchObject({
    message: 'from catch',
    exception: { type: 'Object', message: '{"code":42}' },
  });
  expect(transport.messages[1]).toMatchObject({
    message: '404',
    exception: { type: 'number', message: '404' },
  });
  expect(transport.messages[2]).toMatchObject({
    message: 'null',
    exception: { type: 'null', message: 'null' },
  });
  expect(transport.messages[3]).toMatchObject({
    message: 'undefined',
    exception: { type: 'undefined', message: 'undefined' },
  });
});

test('仅传 string 仍是纯 message，不挂 exception', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  logger.error('plain');
  await logger.flush();
  expect(transport.messages[0]).toMatchObject({ message: 'plain' });
  expect(transport.messages[0]!.exception).toBeUndefined();
});

test('非 Error 的 cause 也会降级序列化', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  const err = new Error('outer');
  (err as Error & { cause: unknown }).cause = 'root-cause';
  logger.error(err);
  await logger.flush();
  expect(transport.messages[0]!.exception?.cause).toMatchObject({
    type: 'string',
    message: 'root-cause',
  });
});

test('serializeUnknown：循环对象与 JSON 失败', () => {
  const circular: Record<string, unknown> = {};
  circular['self'] = circular;
  expect(levelProbe['serializeUnknown'](circular)).toMatchObject({
    type: 'Object',
    message: '[object Object]',
  });

  const seen = new WeakSet<object>();
  seen.add(circular);
  expect(levelProbe['serializeUnknown'](circular, seen)).toMatchObject({
    type: 'Object',
    message: '[Circular]',
  });
});

test('serializeError 与 serializeUnknown(Error) 一致', () => {
  const err = new Error('x');
  expect(levelProbe['serializeError'](err)).toMatchObject(
    levelProbe['serializeUnknown'](err),
  );
});

test('Error.isError：仿 Error 对象不当真 Error；跨 realm Error 仍识别', async () => {
  const fake = Object.create(Error.prototype) as { name: string; message: string };
  fake.name = 'TypeError';
  fake.message = 'fake';
  expect(fake instanceof Error).toBe(true);
  expect(Error.isError(fake)).toBe(false);
  // 走普通 object 分支（constructor 仍可能显示 Error）
  expect(levelProbe['serializeUnknown'](fake)).toMatchObject({
    message: expect.stringContaining('fake'),
  });
  expect(levelProbe['serializeUnknown'](fake).stack).toBeUndefined();

  const { runInNewContext } = await import('node:vm');
  const crossRealm = runInNewContext('new TypeError("boom")') as Error;
  expect(crossRealm instanceof Error).toBe(false);
  expect(Error.isError(crossRealm)).toBe(true);
  expect(levelProbe['serializeUnknown'](crossRealm)).toMatchObject({
    type: 'TypeError',
    message: 'boom',
  });
  expect(levelProbe['serializeUnknown'](crossRealm).stack).toBeTruthy();
});

test('flush 会等异步消费结束', async () => {
  const transport = new MockTransport();
  const logger = new ProbeLoggerService([{ transport }]);
  logger.info('hello');
  expect(transport.messages).toHaveLength(0);
  await logger.flush();
  expect(transport.messages).toHaveLength(1);
});
