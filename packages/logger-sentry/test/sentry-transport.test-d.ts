import { expectType, type TypeEqual } from 'ts-expect';
import {
  Sentry,
  SentryTransport,
  toSentrySeverity,
  type SentrySeverityLevel,
  type SentryTransportOptions,
} from '../src';
import type { LoggerLevel } from '@aomex/logger';

{
  expectType<TypeEqual<typeof import('@sentry/node').init, typeof Sentry.init>>(true);
}

expectType<TypeEqual<SentrySeverityLevel, ReturnType<typeof toSentrySeverity>>>(true);
expectType<
  TypeEqual<(level: LoggerLevel) => SentrySeverityLevel, typeof toSentrySeverity>
>(true);

{
  const opts: SentryTransportOptions = { dsn: 'https://x@o0.ingest.sentry.io/0' };
  void opts;
  const withFlush: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    flushTimeout: 1000,
  };
  void withFlush;
  // @ts-expect-error 必须传 dsn
  const missingDsn: SentryTransportOptions = {};
  void missingDsn;
  const bad: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    // @ts-expect-error
    flushTimeout: 'x',
  };
  void bad;
  new SentryTransport({
    dsn: 'https://x@o0.ingest.sentry.io/0',
    // @ts-expect-error client 注入已移除
    client: {},
  });
}

{
  const t = new SentryTransport({ dsn: 'https://x@o0.ingest.sentry.io/0' });
  expectType<TypeEqual<SentryTransport, typeof t>>(true);
  // @ts-expect-error
  t.flushTimeout;
}

{
  // @ts-expect-error
  toSentrySeverity('http');
}
