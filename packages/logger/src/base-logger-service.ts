import { Service } from '@aomex/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import timers from 'node:timers/promises';
import type { Transport } from './transports/transport';
import {
  LOGGER_LEVELS,
  type LogRecord,
  type LoggerBindings,
  type LoggerLevel,
  type LoggerLevelGate,
  type SerializedError,
} from './types';

export namespace BaseLoggerService {
  export type Level = LoggerLevel;
  export type LevelGate = LoggerLevelGate;

  export interface TransportEntry {
    transport: Transport;
    /**
     * 该 transport 的等级门槛。默认全开。
     * - `'warn'`：warn 及以上
     * - `{ min: 'info', max: 'error' }`：闭区间
     */
    level?: LevelGate;
    /**
     * 为 `true` 时跳过该 transport（不 `onInit` / 不投递 / 不 `flush` / 不 `onDestroy`）。
     */
    disabled?: boolean;
  }
}

/**
 * 日志领域服务基类：子类实现 `createTransports`，对外通过标准 level 方法写日志。
 *
 * ```typescript
 * import { BaseLoggerService, ConsoleTransport, FileTransport } from '@aomex/logger';
 *
 * class LoggerService extends BaseLoggerService {
 *   protected createTransports() {
 *     return [
 *       { transport: new ConsoleTransport(), level: 'debug' },
 *       {
 *         transport: new FileTransport({ file: './app.log' }),
 *         level: { min: 'warn', max: 'error' },
 *       },
 *     ];
 *   }
 * }
 *
 * // combineServices 后
 * await services.logger.info('hello');
 * await services.logger.error(err);
 * await services.logger.error(err, 'checkout failed');
 *
 * await services.logger.withBindings({ requestId: '…' }, async () => {
 *   await services.logger.info('ok');
 * });
 * ```
 */
type TransportGate = {
  transport: Transport;
  level?: LoggerLevelGate;
  disabled: boolean;
};

export abstract class BaseLoggerService extends Service {
  private readonly logs: LogRecord[] = [];
  private transportGates: TransportGate[] = [];
  private timer?: NodeJS.Timeout;
  private readyPromise?: Promise<void>;
  private readonly bindingsStorage = new AsyncLocalStorage<LoggerBindings>();

  protected abstract createTransports(): BaseLoggerService.TransportEntry[];

  protected override async onInit(): Promise<void> {
    await this.ensureReady();
  }

  protected override async onDestroy(): Promise<void> {
    await this.flush();
    await Promise.all(
      this.transportGates
        .filter((gate) => !gate.disabled)
        .map(({ transport }) => transport.onDestroy()),
    );
  }

  /** 等待内存队列输送完毕，并 flush 各 transport 内部缓冲 */
  async flush(): Promise<void> {
    await this.ensureReady();
    while (this.timer || this.logs.length) {
      await timers.setTimeout(50);
    }
    await Promise.all(
      this.transportGates
        .filter((gate) => !gate.disabled)
        .map(({ transport }) => transport.flush()),
    );
  }

  /**
   * 极细诊断（逐步追踪、协议细节等）。仅文案；异常请用 `warn` / `error` / `fatal`。
   * 生产是否输出取决于 transport 的 `level` 门禁（框架不按 `NODE_ENV` 自动关）。
   */
  trace(message: string): void {
    this.write('trace', message);
  }

  /**
   * 开发调试（关键变量、分支走向）。仅文案；异常请用 `warn` / `error` / `fatal`。
   * 生产是否输出取决于 transport 的 `level` 门禁（框架不按 `NODE_ENV` 自动关）。
   */
  debug(message: string): void {
    this.write('debug', message);
  }

  /**
   * 正常业务事件（启动就绪、请求/任务成功等）。仅文案；异常请用 `warn` / `error` / `fatal`。
   */
  info(message: string): void {
    this.write('info', message);
  }

  /**
   * 可恢复异常或需关注的降级（重试、兜底、配置不当）。可带 `err`。
   */
  warn(message: string): void;
  warn(err: unknown): void;
  warn(err: unknown, message: string): void;
  warn(messageOrError: unknown, message?: string): void {
    this.write('warn', messageOrError, message);
  }

  /**
   * 请求/任务失败，进程通常仍可继续（未处理异常、下游失败）。可带 `err`。
   */
  error(message: string): void;
  error(err: unknown): void;
  error(err: unknown, message: string): void;
  error(messageOrError: unknown, message?: string): void {
    this.write('error', messageOrError, message);
  }

  /**
   * 进程级致命错误（启动失败、数据损坏等），打完后通常应退出。可带 `err`。
   */
  fatal(message: string): void;
  fatal(err: unknown): void;
  fatal(err: unknown, message: string): void;
  fatal(messageOrError: unknown, message?: string): void {
    this.write('fatal', messageOrError, message);
  }

  /**
   * 在异步上下文中挂上 `bindings`，回调内（含 `await`）写出的日志都会带上这些字段。
   * 嵌套 `withBindings` 时与外层合并，同名键由内层覆盖。始终返回 `Promise`。
   *
   * ```typescript
   * await logger.withBindings({ requestId: 'req-1' }, async () => {
   *   logger.info('ok');
   * });
   * ```
   */
  async withBindings<T>(
    bindings: LoggerBindings,
    callback: () => Promise<T>,
  ): Promise<T> {
    const parent = this.bindingsStorage.getStore();
    const merged = parent ? { ...parent, ...bindings } : { ...bindings };
    return this.bindingsStorage.run(merged, callback);
  }

  /** 当前异步上下文中的 bindings（浅拷贝）；无上下文时为空对象 */
  bindings(): LoggerBindings {
    return { ...(this.bindingsStorage.getStore() ?? {}) };
  }

  /**
   * 写入一条日志。子类自定义方法时可复用。
   *
   * - `write('info', 'hello')`
   * - `write('warn', err)` / `write('error', err)` — `err` 为 `unknown`（含 `catch` 值）
   * - `write('error', err, 'checkout failed')`
   */
  protected write(level: LoggerLevel, messageOrError: unknown, message?: string): void {
    const normalized = this.normalizeLogArgs(messageOrError, message);
    const store = this.bindingsStorage.getStore();
    const bindings =
      store != null && Object.keys(store).length > 0 ? { ...store } : undefined;
    this.logs.push({
      timestamp: new Date(),
      level,
      message: normalized.message,
      ...(normalized.exception ? { exception: normalized.exception } : {}),
      ...(bindings ? { bindings } : {}),
    });
    this.timer ||= setTimeout(async () => {
      try {
        await this.consume();
      } finally {
        this.timer = undefined;
      }
    });
  }

  /**
   * 将任意抛出值序列化为 `exception` 字段（`Error` 走完整 stack/cause，其它值降级）。
   */
  protected serializeUnknown(
    value: unknown,
    seen: WeakSet<object> = new WeakSet(),
  ): SerializedError {
    if (Error.isError(value)) {
      if (seen.has(value)) {
        return { type: value.name || 'Error', message: '[Circular]' };
      }
      seen.add(value);

      const out: SerializedError = {
        type: value.name || 'Error',
        message: value.message,
      };
      if (value.stack) {
        out.stack = value.stack;
      }
      if (value.cause !== undefined) {
        out.cause = this.serializeUnknown(value.cause, seen);
      }
      return out;
    }

    if (typeof value === 'string') {
      return { type: 'string', message: value };
    }

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return { type: 'Object', message: '[Circular]' };
      }
      seen.add(value);
      const type = value.constructor?.name || 'Object';
      let message: string;
      try {
        message = JSON.stringify(value) ?? String(value);
      } catch {
        message = Object.prototype.toString.call(value);
      }
      return { type, message };
    }

    if (value === undefined) {
      return { type: 'undefined', message: 'undefined' };
    }
    if (value === null) {
      return { type: 'null', message: 'null' };
    }
    return { type: typeof value, message: String(value) };
  }

  /** `Error` 专用入口，等价于 `serializeUnknown(err)` */
  protected serializeError(
    err: Error,
    seen: WeakSet<object> = new WeakSet(),
  ): SerializedError {
    return this.serializeUnknown(err, seen);
  }

  /**
   * - 仅传 `string` → 普通文案，不挂 `exception`
   * - 传 `unknown`（可再跟 message）→ 序列化到 `exception`
   */
  protected normalizeLogArgs(
    messageOrError: unknown,
    message?: string,
  ): { message: string; exception?: SerializedError } {
    if (typeof messageOrError === 'string' && message === undefined) {
      return { message: messageOrError };
    }
    const exception = this.serializeUnknown(messageOrError);
    return {
      message: message ?? exception.message,
      exception,
    };
  }

  /** 将 gate 解析为闭区间下标 */
  protected resolveLevelGate(gate: LoggerLevelGate | undefined): {
    minIndex: number;
    maxIndex: number;
  } {
    if (gate == null) {
      return { minIndex: 0, maxIndex: LOGGER_LEVELS.length - 1 };
    }
    if (typeof gate === 'string') {
      return {
        minIndex: LOGGER_LEVELS.indexOf(gate),
        maxIndex: LOGGER_LEVELS.length - 1,
      };
    }
    return {
      minIndex: gate.min ? LOGGER_LEVELS.indexOf(gate.min) : 0,
      maxIndex: gate.max ? LOGGER_LEVELS.indexOf(gate.max) : LOGGER_LEVELS.length - 1,
    };
  }

  /** 判断某等级是否落在 gate 闭区间内 */
  protected isLevelEnabled(
    level: LoggerLevel,
    gate: LoggerLevelGate | undefined,
  ): boolean {
    const index = LOGGER_LEVELS.indexOf(level);
    const { minIndex, maxIndex } = this.resolveLevelGate(gate);
    return index >= minIndex && index <= maxIndex;
  }

  /**
   * 创建 transports 并等待各自 `onInit`。可重入，只执行一次。
   */
  private ensureReady(): Promise<void> {
    this.readyPromise ??= (async () => {
      this.transportGates = this.createTransports().map(
        ({ transport, level, disabled }) => ({
          transport,
          level,
          disabled: disabled === true,
        }),
      );
      await Promise.all(
        this.transportGates
          .filter((gate) => !gate.disabled)
          .map(({ transport }) => transport.onInit()),
      );
    })();
    return this.readyPromise;
  }

  private async consume(): Promise<void> {
    await this.ensureReady();
    let log = this.logs.shift();
    while (log) {
      // 单 transport 失败不阻断同批其它出口，也不中断后续队列；失败用 console.error 上报，避免再走 logger 递归
      const results = await Promise.allSettled(
        this.transportGates.map(async ({ transport, level, disabled }) => {
          if (disabled) return;
          if (this.isLevelEnabled(log!.level, level)) {
            await transport.consume(log!);
          }
        }),
      );
      for (let i = 0; i < results.length; i++) {
        const result = results[i]!;
        if (result.status !== 'rejected') continue;
        const err = result.reason;
        const detail = Error.isError(err) ? (err.stack ?? err.message) : String(err);
        console.error(
          `[aomex/logger] transport ${this.transportGates[i]!.transport.constructor.name} consume failed: ${detail}`,
        );
      }
      log = this.logs.shift();
    }
  }
}
