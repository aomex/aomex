import { type TypeEqual, expectType } from 'ts-expect';
import {
  Logger,
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
type MessageOnlyLogMethod = (message: string) => void;

/** warn / error / fatal：可挂 exception */
type ErrLogMethod = {
  (message: string): void;
  (err: unknown): void;
  (err: unknown, message: string): void;
};

class DemoLogger extends Logger {
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
  expectType<TypeEqual<LoggerLevelGate, Logger.LevelGate>>(true);
}

{
  const logger = new DemoLogger({
    transports: [{ transport: new MockTransport(), level: 'warn' }],
  });

  expectType<
    TypeEqual<true, typeof logger.trace extends MessageOnlyLogMethod ? true : false>
  >(true);
  expectType<
    TypeEqual<true, typeof logger.debug extends MessageOnlyLogMethod ? true : false>
  >(true);
  expectType<
    TypeEqual<true, typeof logger.info extends MessageOnlyLogMethod ? true : false>
  >(true);
  expectType<TypeEqual<true, typeof logger.warn extends ErrLogMethod ? true : false>>(
    true,
  );
  expectType<TypeEqual<true, typeof logger.error extends ErrLogMethod ? true : false>>(
    true,
  );
  expectType<TypeEqual<true, typeof logger.fatal extends ErrLogMethod ? true : false>>(
    true,
  );
  expectType<TypeEqual<(message: string) => void, typeof logger.audit>>(true);
  expectType<TypeEqual<() => Promise<void>, typeof logger.flush>>(true);
  // @ts-expect-error connect 已不暴露
  logger.connect;
  // @ts-expect-error disconnect 已不暴露
  logger.disconnect;

  logger.info('ok');
  logger.warn(new Error('soft'));
  logger.warn(new Error('soft'), 'handled');
  logger.error(new Error('boom'));
  logger.error(new Error('boom'), 'checkout failed');
  const caught = null as unknown;
  logger.error(caught);
  logger.error(caught, 'checkout failed');
  logger.error(123);

  expectType<TypeEqual<LoggerBindings, ReturnType<typeof logger.bindings>>>(true);
  const asyncRet = logger.withBindings({ a: 1 }, async () => 'x' as const);
  expectType<TypeEqual<Promise<'x'>, typeof asyncRet>>(true);
  void logger.withBindings({ requestId: 'r1' }, async () => {
    logger.info('ok');
  });
  // @ts-expect-error withBindings 第一参须为对象
  void logger.withBindings('x', async () => undefined);
  // @ts-expect-error 回调必须返回 Promise
  void logger.withBindings({ a: 1 }, () => 1);
  // @ts-expect-error LoggerChild 已移除
  type _RemovedChild = import('../src').LoggerChild;
  // @ts-expect-error info 不再接受非 string
  logger.info({ foo: 1 });
  // @ts-expect-error info 不再接受 err
  logger.info(caught, 'handled');
  // @ts-expect-error debug 不再接受 err
  logger.debug(caught);
  // @ts-expect-error 第二参必须是 string
  logger.error(caught, 1);
  // @ts-expect-error
  logger.error();

  // @ts-expect-error protected
  logger.write;
  // @ts-expect-error
  logger.initTransports;
  // @ts-expect-error
  logger.destroyTransports;
  // @ts-expect-error BaseLoggerService 已移除
  type _RemovedService = import('../src').BaseLoggerService;
}

{
  const opts: Logger.Options = {
    transports: [
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
    ],
  };
  void new Logger(opts);
  void new Logger();
  void new Logger({});

  const entries: Logger.TransportEntry[] = [
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
  // @ts-expect-error 已收进 Logger protected 方法
  type _RemovedIsLevelEnabled = import('../src').isLevelEnabled;
  // @ts-expect-error 已收进 Logger protected 方法
  type _RemovedResolveLevelGate = import('../src').resolveLevelGate;
  // @ts-expect-error 已收进 Logger protected 方法
  type _RemovedSerializeUnknown = import('../src').serializeUnknown;
  // @ts-expect-error serializeError 已移除
  type _RemovedSerializeError = import('../src').serializeError;
  // @ts-expect-error 已收进 Logger protected 方法
  type _RemovedNormalizeLogArgs = import('../src').normalizeLogArgs;
}
