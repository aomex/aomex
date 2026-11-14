import * as Sentry from '@sentry/node';
import {
  Transport,
  type LogRecord,
  type LoggerLevel,
  type SerializedError,
} from '@aomex/logger';

/** 与 Sentry `SeverityLevel` 对齐 */
export type SentrySeverityLevel =
  'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

export interface SentryTransportOptions {
  /** Sentry DSN；构造时会调用 `Sentry.init({ dsn })` */
  dsn: string;
  /**
   * `flush()` 等待上报的超时（毫秒）。默认 `2000`。
   */
  flushTimeout?: number;
}

const LEVEL_TO_SENTRY: Record<LoggerLevel, SentrySeverityLevel> = {
  trace: 'debug',
  debug: 'debug',
  info: 'info',
  warn: 'warning',
  error: 'error',
  fatal: 'fatal',
};

export const toSentrySeverity = (level: LoggerLevel): SentrySeverityLevel =>
  LEVEL_TO_SENTRY[level];

const exceptionToError = (exception: SerializedError): Error => {
  const error = new Error(exception.message);
  error.name = exception.type || 'Error';
  if (exception.stack) {
    error.stack = exception.stack;
  }
  if (exception.cause) {
    (error as Error & { cause: Error }).cause = exceptionToError(exception.cause);
  }
  return error;
};

/**
 * 把日志送到 Sentry。构造时用 `dsn` 完成 `Sentry.init`。
 *
 * ```typescript
 * new SentryTransport({ dsn: process.env.SENTRY_DSN! })
 * ```
 */
export class SentryTransport extends Transport {
  protected readonly flushTimeout: number;

  constructor(opts: SentryTransportOptions) {
    super();
    Sentry.init({ dsn: opts.dsn });
    this.flushTimeout = opts.flushTimeout ?? 2000;
  }

  override async consume(log: LogRecord): Promise<void> {
    const level = toSentrySeverity(log.level);

    Sentry.withScope((scope) => {
      scope.setLevel(level);
      scope.setExtra('logger.level', log.level);
      scope.setExtra('logger.time', log.timestamp.toISOString());
      if (log.bindings) {
        scope.setContext('logger.bindings', log.bindings);
      }

      if (log.exception) {
        scope.setContext('logger.exception', {
          ...log.exception,
          cause: log.exception.cause ?? null,
        });
        Sentry.captureException(exceptionToError(log.exception), {
          level,
          extra: {
            message: log.message,
          },
        });
        return;
      }

      Sentry.captureMessage(log.message, { level });
    });
  }

  override async flush(): Promise<void> {
    await Sentry.flush(this.flushTimeout);
  }
}
