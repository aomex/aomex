import * as Sentry from '@sentry/node';
import type { NodeOptions } from '@sentry/node';
import {
  Transport,
  type LogRecord,
  type LoggerLevel,
  type SerializedError,
} from '@aomex/logger';

/** 与 Sentry `SeverityLevel` 对齐 */
export type SentrySeverityLevel =
  'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

/** Sentry `dataCollection` 配置（来自 `@sentry/node` 的 `NodeOptions`） */
export type SentryDataCollection = NonNullable<NodeOptions['dataCollection']>;

/**
 * 默认数据采集策略：对齐 mongoose/SDK 升级前的保守行为（相当于 v10 未开 `sendDefaultPii`）。
 * `@sentry/node` v11 若未传 `dataCollection` 会默认采集 cookie / 用户信息 / 请求体等。
 */
export const DEFAULT_SENTRY_DATA_COLLECTION: SentryDataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  genAI: { inputs: false, outputs: false },
  mcp: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  graphQL: { document: false, variables: false },
};

export interface SentryTransportOptions {
  /** Sentry DSN；构造时会调用 `Sentry.init` */
  dsn: string;
  /**
   * `flush()` 等待上报的超时（毫秒）。默认 `2000`。
   */
  flushTimeout?: number;
  /**
   * 控制 SDK 自动采集的数据类别。
   * - 省略 / `false`：使用 {@link DEFAULT_SENTRY_DATA_COLLECTION}（关闭）
   * - `true`：沿用 `@sentry/node` v11 默认（开放采集）
   * - 对象：在关闭默认上浅合并覆盖（如 `{ cookies: true }`）
   */
  dataCollection?: boolean | SentryDataCollection;
}

const LEVEL_TO_SENTRY: Record<LoggerLevel, SentrySeverityLevel> = {
  trace: 'debug',
  debug: 'debug',
  info: 'info',
  warn: 'warning',
  error: 'error',
  fatal: 'fatal',
};

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
 * new SentryTransport({ dsn, dataCollection: true })
 * new SentryTransport({ dsn, dataCollection: { cookies: true } })
 * ```
 */
export class SentryTransport extends Transport {
  protected readonly flushTimeout: number;

  constructor(opts: SentryTransportOptions) {
    super();
    const dataCollection = SentryTransport.resolveDataCollection(opts.dataCollection);
    Sentry.init({
      dsn: opts.dsn,
      ...(dataCollection ? { dataCollection } : {}),
    });
    this.flushTimeout = opts.flushTimeout ?? 2000;
  }

  /** `true` → `undefined`（不传给 init，走 SDK 默认）；否则关闭默认 + 浅合并 */
  protected static resolveDataCollection(
    value: boolean | SentryDataCollection | undefined,
  ): SentryDataCollection | undefined {
    if (value === true) {
      return undefined;
    }
    if (value === false || value === undefined) {
      return DEFAULT_SENTRY_DATA_COLLECTION;
    }
    return {
      ...DEFAULT_SENTRY_DATA_COLLECTION,
      ...value,
    };
  }

  protected toSentrySeverity(level: LoggerLevel): SentrySeverityLevel {
    return LEVEL_TO_SENTRY[level];
  }

  override async consume(log: LogRecord): Promise<void> {
    const level = this.toSentrySeverity(log.level);

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
