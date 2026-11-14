import type { LogRecord } from '../types';

export type TransportFormat = 'text' | 'json';

export abstract class Transport {
  abstract consume(log: LogRecord): Promise<any>;

  /**
   * 异步初始化。`BaseLoggerService` 在首次投递 / 服务 `onInit` 时会等待全部 transport 完成。
   * 默认无操作。
   */
  async onInit(): Promise<void> {}

  /**
   * 刷出 transport 内部缓冲（若有）。默认无操作。
   */
  async flush(): Promise<void> {}

  /**
   * 异步销毁。服务 `onDestroy` 在 `flush` 之后会等待全部 transport 完成。
   * 默认无操作。
   */
  async onDestroy(): Promise<void> {}

  /**
   * 解析日期。返回 年、月、日、时、分、秒
   */
  protected dateToJSON(date: Date) {
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
      hour: date.getHours().toString().padStart(2, '0'),
      minute: date.getMinutes().toString().padStart(2, '0'),
      second: date.getSeconds().toString().padStart(2, '0'),
    };
  }

  /**
   * 时间字符串：`年-月-日 时:分:秒`
   */
  protected dateToString(date: Date) {
    const parsed = this.dateToJSON(date);
    return `${parsed.year}-${parsed.month}-${parsed.day} ${parsed.hour}:${parsed.minute}:${parsed.second}`;
  }

  /**
   * 格式化单条日志。
   * - `text`：`[level] time message`，有 `bindings` / `exception` 时追加
   * - `json`：NDJSON（`time` / `level` / `message`，可选 `exception` / `bindings`）
   */
  protected formatLog(log: LogRecord, format: TransportFormat = 'text'): string {
    if (format === 'json') {
      return JSON.stringify({
        time: log.timestamp.toISOString(),
        level: log.level,
        message: log.message,
        ...(log.exception ? { exception: log.exception } : {}),
        ...(log.bindings ? { bindings: log.bindings } : {}),
      });
    }

    let line = `[${log.level}] ${this.dateToString(log.timestamp)} ${log.message}`;
    if (log.bindings) {
      line += ` ${JSON.stringify(log.bindings)}`;
    }
    if (log.exception?.stack) {
      line += `\n${log.exception.stack}`;
    } else if (log.exception) {
      line += `\n${log.exception.type}: ${log.exception.message}`;
    }
    return line;
  }
}
