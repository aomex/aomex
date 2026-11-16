import { expectType, type TypeEqual } from 'ts-expect';
import {
  Sentry,
  SentryTransport,
  DEFAULT_SENTRY_DATA_COLLECTION,
  type SentrySeverityLevel,
  type SentryTransportOptions,
  type SentryDataCollection,
} from '../src';
import type { LoggerLevel } from '@aomex/logger';

{
  expectType<TypeEqual<typeof import('@sentry/node').init, typeof Sentry.init>>(true);
}

{
  const opts: SentryTransportOptions = { dsn: 'https://x@o0.ingest.sentry.io/0' };
  void opts;
  const withFlush: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    flushTimeout: 1000,
  };
  void withFlush;
  const withDataCollectionOff: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    dataCollection: false,
  };
  void withDataCollectionOff;
  const withDataCollectionOn: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    dataCollection: true,
  };
  void withDataCollectionOn;
  const withDataCollection: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    dataCollection: { cookies: true },
  };
  void withDataCollection;
  const fullDataCollection: SentryDataCollection = {
    ...DEFAULT_SENTRY_DATA_COLLECTION,
    cookies: true,
    httpBodies: ['incomingRequest'],
  };
  void fullDataCollection;
  // @ts-expect-error 必须传 dsn
  const missingDsn: SentryTransportOptions = {};
  void missingDsn;
  const bad: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    // @ts-expect-error
    flushTimeout: 'x',
  };
  void bad;
  const badCollection: SentryTransportOptions = {
    dsn: 'https://x@o0.ingest.sentry.io/0',
    // @ts-expect-error
    dataCollection: { cookies: 'yes' },
  };
  void badCollection;
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
  // @ts-expect-error protected，外部不可直接调用
  t.toSentrySeverity('info');
  expectType<
    TypeEqual<(level: LoggerLevel) => SentrySeverityLevel, (typeof t)['toSentrySeverity']>
  >(true);
  // @ts-expect-error
  t['toSentrySeverity']('http');
}
