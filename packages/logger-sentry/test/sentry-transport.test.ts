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

const { SentryTransport, toSentrySeverity } = await import('../src');

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

test('构造时用 dsn 调用 Sentry.init', () => {
  new SentryTransport({ dsn: DSN });
  expect(sentryMocks.init).toHaveBeenCalledWith({ dsn: DSN });
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
