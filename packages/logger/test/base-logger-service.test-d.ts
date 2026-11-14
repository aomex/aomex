import { combineServices, type PromisifiedService } from '@aomex/common';
import { type TypeEqual, expectType } from 'ts-expect';
import {
  BaseLoggerService,
  ConsoleTransport,
  LOGGER_LEVELS,
  type LogRecord,
  type LoggerBindings,
  type LoggerLevel,
  type LoggerLevelGate,
  type SerializedError,
} from '../src';
import { MockTransport } from './mocks/mock-transport';

/** trace / debug / info：仅文案 */
type MessageOnlyLogMethod = (message: string) => Promise<void>;

/** warn / error / fatal：可挂 exception */
type ErrLogMethod = {
  (message: string): Promise<void>;
  (err: unknown): Promise<void>;
  (err: unknown, message: string): Promise<void>;
};

class DemoLoggerService extends BaseLoggerService {
  protected createTransports() {
    return [{ transport: new MockTransport(), level: 'warn' as const }];
  }

  audit(message: string) {
    this.write('info', message);
  }
}

{
  expectType<
    TypeEqual<
      readonly ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      typeof LOGGER_LEVELS
    >
  >(true);
  expectType<
    TypeEqual<'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', LoggerLevel>
  >(true);
  expectType<TypeEqual<LoggerLevel, LogRecord['level']>>(true);
  expectType<TypeEqual<string, LogRecord['message']>>(true);
  expectType<TypeEqual<SerializedError | undefined, LogRecord['exception']>>(true);
  expectType<TypeEqual<LoggerBindings | undefined, LogRecord['bindings']>>(true);
  expectType<TypeEqual<LoggerLevelGate, BaseLoggerService.LevelGate>>(true);
}

{
  const services = await combineServices({
    logger: async () => DemoLoggerService,
  });

  expectType<
    TypeEqual<
      true,
      typeof services.logger.trace extends MessageOnlyLogMethod ? true : false
    >
  >(true);
  expectType<
    TypeEqual<
      true,
      typeof services.logger.debug extends MessageOnlyLogMethod ? true : false
    >
  >(true);
  expectType<
    TypeEqual<
      true,
      typeof services.logger.info extends MessageOnlyLogMethod ? true : false
    >
  >(true);
  expectType<
    TypeEqual<true, typeof services.logger.warn extends ErrLogMethod ? true : false>
  >(true);
  expectType<
    TypeEqual<true, typeof services.logger.error extends ErrLogMethod ? true : false>
  >(true);
  expectType<
    TypeEqual<true, typeof services.logger.fatal extends ErrLogMethod ? true : false>
  >(true);
  expectType<TypeEqual<(message: string) => Promise<void>, typeof services.logger.audit>>(
    true,
  );
  expectType<TypeEqual<() => Promise<void>, typeof services.logger.flush>>(true);

  void services.logger.info('ok');
  void services.logger.warn(new Error('soft'));
  void services.logger.warn(new Error('soft'), 'handled');
  void services.logger.error(new Error('boom'));
  void services.logger.error(new Error('boom'), 'checkout failed');
  // catch (e) 的 unknown 可直接传
  const caught = null as unknown;
  void services.logger.error(caught);
  void services.logger.error(caught, 'checkout failed');
  void services.logger.error(123);

  expectType<
    TypeEqual<LoggerBindings, Awaited<ReturnType<typeof services.logger.bindings>>>
  >(true);
  // withBindings：经 PromisifiedService 后仍可推断回调返回值
  const asyncRet = services.logger.withBindings({ a: 1 }, async () => 'x' as const);
  expectType<TypeEqual<Promise<'x'>, typeof asyncRet>>(true);
  void services.logger.withBindings({ requestId: 'r1' }, async () => {
    void services.logger.info('ok');
  });
  // @ts-expect-error withBindings 第一参须为对象
  void services.logger.withBindings('x', async () => undefined);
  // @ts-expect-error 回调必须返回 Promise
  void services.logger.withBindings({ a: 1 }, () => 1);
  // @ts-expect-error LoggerChild 已移除
  type _RemovedChild = import('../src').LoggerChild;
  // @ts-expect-error info 不再接受非 string
  void services.logger.info({ foo: 1 });
  // @ts-expect-error info 不再接受 err
  void services.logger.info(caught, 'handled');
  // @ts-expect-error debug 不再接受 err
  void services.logger.debug(caught);
  // @ts-expect-error 第二参必须是 string
  void services.logger.error(caught, 1);
  // @ts-expect-error
  void services.logger.error();

  expectType<
    TypeEqual<
      true,
      PromisifiedService<DemoLoggerService> extends {
        flush: () => Promise<void>;
        trace: MessageOnlyLogMethod;
        debug: MessageOnlyLogMethod;
        info: MessageOnlyLogMethod;
        warn: ErrLogMethod;
        error: ErrLogMethod;
        fatal: ErrLogMethod;
        audit: (message: string) => Promise<void>;
      }
        ? true
        : false
    >
  >(true);

  expectType<TypeEqual<never, keyof typeof services.logger & 'write'>>(true);
  expectType<TypeEqual<never, keyof typeof services.logger & 'createTransports'>>(true);
  expectType<TypeEqual<never, keyof typeof services.logger & 'onInit'>>(true);
  expectType<TypeEqual<never, keyof typeof services.logger & 'onDestroy'>>(true);

  // @ts-expect-error
  services.logger.write;
  // @ts-expect-error
  services.logger.createTransports;
  // @ts-expect-error
  services.logger.onInit;
  // @ts-expect-error
  services.logger.http;
}

{
  // @ts-expect-error 必须实现 createTransports
  class MissingTransports extends BaseLoggerService {}
  void MissingTransports;
}

{
  class Typed extends BaseLoggerService {
    protected createTransports(): BaseLoggerService.TransportEntry[] {
      return [
        {
          transport: new MockTransport(),
          level: 'error',
        },
        {
          transport: new MockTransport(),
          level: { min: 'warn' },
        },
        {
          transport: new MockTransport(),
          level: { max: 'info' },
        },
        {
          transport: new MockTransport(),
          disabled: true,
        },
      ];
    }
  }
  void Typed;

  const entries: BaseLoggerService.TransportEntry[] = [
    {
      transport: new MockTransport(),
      // @ts-expect-error
      level: 'http',
    },
    {
      transport: new MockTransport(),
      // @ts-expect-error
      level: 'all',
    },
    {
      transport: new MockTransport(),
      // @ts-expect-error 旧 from/to 已废弃
      level: { from: 'info' },
    },
    {
      transport: new MockTransport(),
      // @ts-expect-error disabled 须为 boolean
      disabled: 'yes',
    },
  ];
  void entries;

  const gate: LoggerLevelGate = { min: 'info', max: 'warn' };
  void gate;
  const gateMinOnly: LoggerLevelGate = { min: 'warn' };
  void gateMinOnly;
  const gateMaxOnly: LoggerLevelGate = { max: 'debug' };
  void gateMaxOnly;
  // @ts-expect-error 至少要有 min 或 max
  const emptyGate: LoggerLevelGate = {};
  void emptyGate;
  // @ts-expect-error
  const badGate: LoggerLevelGate = { min: 'http' };
  void badGate;

  const record: LogRecord = {
    timestamp: new Date(),
    level: 'info',
    message: 'x',
  };
  void record;
  const withErr: LogRecord = {
    timestamp: new Date(),
    level: 'error',
    message: 'checkout failed',
    exception: {
      type: 'Error',
      message: 'boom',
      stack: 'Error: boom\n    at x',
      cause: { type: 'TypeError', message: 'bad' },
    },
  };
  void withErr;
  const badRecord: LogRecord = {
    timestamp: new Date(),
    // @ts-expect-error
    level: 'http',
    message: 'x',
  };
  void badRecord;
  const badErr: SerializedError = {
    type: 'Error',
    message: 'x',
    // @ts-expect-error
    stack: 1,
  };
  void badErr;
}

{
  expectType<
    TypeEqual<typeof ConsoleTransport, typeof import('../src').ConsoleTransport>
  >(true);
  expectType<
    TypeEqual<
      typeof import('../src').FileTransport,
      typeof import('../src/transports/file-transport').FileTransport
    >
  >(true);
  // @ts-expect-error 已改为直接导出 *Transport，不再提供 transports 命名空间
  type _RemovedTransports = import('../src').transports;
  // @ts-expect-error 已收进 BaseLoggerService protected 方法
  type _RemovedIsLevelEnabled = import('../src').isLevelEnabled;
  // @ts-expect-error 已收进 BaseLoggerService protected 方法
  type _RemovedResolveLevelGate = import('../src').resolveLevelGate;
  // @ts-expect-error 已收进 BaseLoggerService protected 方法
  type _RemovedSerializeUnknown = import('../src').serializeUnknown;
  // @ts-expect-error 已收进 BaseLoggerService protected 方法
  type _RemovedSerializeError = import('../src').serializeError;
  // @ts-expect-error 已收进 BaseLoggerService protected 方法
  type _RemovedNormalizeLogArgs = import('../src').normalizeLogArgs;
}
