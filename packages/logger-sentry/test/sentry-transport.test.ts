import { afterEach, expect, test, vitest } from 'vitest';
import type { LogRecord } from '@aomex/logger';

const sentryMocks = vitest.hoisted(() => {
  const setLevel = vitest.fn();
  const setExtra = vitest.fn();
  const setContext = vitest.fn();
  return {
    setLevel,
    setExtra,
    setContext,
    init: vitest.fn(),
    captureException: vitest.fn(() => 'id'),
    captureMessage: vitest.fn(() => 'id'),
    flush: vitest.fn(async () => true),
    withScope: vitest.fn(
      (
        cb: (scope: {
          setLevel: typeof setLevel;
          setExtra: typeof setExtra;
          setContext: typeof setContext;
        }) => void,
      ) => {
        cb({ setLevel, setExtra, setContext });
      },
    ),
  };
});

vitest.mock('@sentry/node', () => ({
  init: sentryMocks.init,
  captureException: sentryMocks.captureException,
  captureMessage: sentryMocks.captureMessage,
  flush: sentryMocks.flush,
  withScope: sentryMocks.withScope,
}));

const { SentryTransport, DEFAULT_SENTRY_DATA_COLLECTION } = await import('../src');

const DSN = 'https://examplePublicKey@o0.ingest.sentry.io/0';

const baseLog = (
  partial: Partial<LogRecord> & Pick<LogRecord, 'level' | 'message'>,
): LogRecord => ({
  timestamp: new Date('2024-10-30T14:03:03.000Z'),
  ...partial,
});

afterEach(() => {
  vitest.clearAllMocks();
});

test('toSentrySeverity 映射', () => {
  const t = new SentryTransport({ dsn: DSN });
  const toSentrySeverity = t['toSentrySeverity'].bind(t);
  expect(toSentrySeverity('trace')).toBe('debug');
  expect(toSentrySeverity('debug')).toBe('debug');
  expect(toSentrySeverity('info')).toBe('info');
  expect(toSentrySeverity('warn')).toBe('warning');
  expect(toSentrySeverity('error')).toBe('error');
  expect(toSentrySeverity('fatal')).toBe('fatal');
});

test('无 exception 时 captureMessage', async () => {
  const t = new SentryTransport({ dsn: DSN });
  await t.consume(baseLog({ level: 'info', message: 'hello' }));

  expect(sentryMocks.withScope).toHaveBeenCalledOnce();
  expect(sentryMocks.setLevel).toHaveBeenCalledWith('info');
  expect(sentryMocks.setExtra).toHaveBeenCalledWith('logger.level', 'info');
  expect(sentryMocks.captureMessage).toHaveBeenCalledWith('hello', {
    level: 'info',
  });
  expect(sentryMocks.captureException).not.toHaveBeenCalled();
});

test('有 exception 时 captureException，并还原 name/stack/cause', async () => {
  const t = new SentryTransport({ dsn: DSN });
  await t.consume(
    baseLog({
      level: 'error',
      message: 'checkout failed',
      exception: {
        type: 'TypeError',
        message: 'boom',
        stack: 'TypeError: boom\n    at x',
        cause: { type: 'Error', message: 'root' },
      },
    }),
  );

  expect(sentryMocks.captureMessage).not.toHaveBeenCalled();
  expect(sentryMocks.captureException).toHaveBeenCalledOnce();
  const call = sentryMocks.captureException.mock.calls[0] as unknown as [
    Error,
    { level: string; extra: { message: string } },
  ];
  const [err, hint] = call;
  expect(err).toBeInstanceOf(Error);
  expect(err.name).toBe('TypeError');
  expect(err.message).toBe('boom');
  expect(err.stack).toBe('TypeError: boom\n    at x');
  expect((err.cause as Error).message).toBe('root');
  expect(hint).toMatchObject({
    level: 'error',
    extra: { message: 'checkout failed' },
  });
  expect(sentryMocks.setContext).toHaveBeenCalledWith(
    'logger.exception',
    expect.objectContaining({ type: 'TypeError', message: 'boom' }),
  );
});

test('warn 映射为 warning', async () => {
  const t = new SentryTransport({ dsn: DSN });
  await t.consume(baseLog({ level: 'warn', message: 'careful' }));
  expect(sentryMocks.setLevel).toHaveBeenCalledWith('warning');
  expect(sentryMocks.captureMessage).toHaveBeenCalledWith('careful', {
    level: 'warning',
  });
});

test('flush 调用 Sentry.flush', async () => {
  const t = new SentryTransport({ dsn: DSN, flushTimeout: 1234 });
  await t.flush();
  expect(sentryMocks.flush).toHaveBeenCalledWith(1234);
});

test('构造时默认关闭 dataCollection', () => {
  new SentryTransport({ dsn: DSN });
  expect(sentryMocks.init).toHaveBeenCalledWith({
    dsn: DSN,
    dataCollection: DEFAULT_SENTRY_DATA_COLLECTION,
  });
});

test('dataCollection: false 与默认相同', () => {
  new SentryTransport({ dsn: DSN, dataCollection: false });
  expect(sentryMocks.init).toHaveBeenCalledWith({
    dsn: DSN,
    dataCollection: DEFAULT_SENTRY_DATA_COLLECTION,
  });
});

test('dataCollection: true 不传收紧配置，走 SDK 默认', () => {
  new SentryTransport({ dsn: DSN, dataCollection: true });
  expect(sentryMocks.init).toHaveBeenCalledWith({ dsn: DSN });
});

test('dataCollection 对象浅合并覆盖关闭默认', () => {
  new SentryTransport({
    dsn: DSN,
    dataCollection: { cookies: true, userInfo: true },
  });
  expect(sentryMocks.init).toHaveBeenCalledWith({
    dsn: DSN,
    dataCollection: {
      ...DEFAULT_SENTRY_DATA_COLLECTION,
      cookies: true,
      userInfo: true,
    },
  });
});

test('resolveDataCollection', () => {
  const resolve = SentryTransport['resolveDataCollection'];
  expect(resolve(undefined)).toEqual(DEFAULT_SENTRY_DATA_COLLECTION);
  expect(resolve(false)).toEqual(DEFAULT_SENTRY_DATA_COLLECTION);
  expect(resolve(true)).toBeUndefined();
  expect(resolve({ cookies: true })).toEqual({
    ...DEFAULT_SENTRY_DATA_COLLECTION,
    cookies: true,
  });
});

test('exception.type 为空时回退 Error', async () => {
  const t = new SentryTransport({ dsn: DSN });
  await t.consume(
    baseLog({
      level: 'error',
      message: 'x',
      exception: { type: '', message: 'boom' },
    }),
  );
  const [err] = sentryMocks.captureException.mock.calls[0] as unknown as [Error];
  expect(err.name).toBe('Error');
});
