import { dirname, normalize } from 'node:path';
import type { Mode } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';
import { appendFile, mkdir } from 'node:fs/promises';
import { Transport, type TransportFormat } from './transport';
import type { LogRecord } from '../types';
import { i18n } from '../i18n';

/**
 * 追加写入本地日志文件；目录不存在时自动创建。
 *
 * ```typescript
 * // 使用默认路径：./logs/{year}-{month}-{day}/{level}.log
 * new FileTransport();
 *
 * new FileTransport({
 *   file: './logs/app.log',
 *   format: 'json',
 * });
 *
 * new FileTransport({
 *   file: (log) => `./logs/${log.level}.log`,
 * });
 * ```
 */
export class FileTransport extends Transport {
  protected readonly file: string | ((log: LogRecord) => string);
  protected readonly fileMode?: Mode;
  protected readonly dirMode?: Mode;
  protected readonly format: TransportFormat;
  protected readonly ensuredDirs = new Set<string>();

  constructor(
    opts: {
      /**
       * 日志文件路径，支持占位符。默认 `./logs/{year}-{month}-{day}/{level}.log`。
       * - `{year}` 年
       * - `{month}` 月
       * - `{day}` 日
       * - `{hour}` 时
       * - `{minute}` 分
       * - `{second}` 秒
       * - `{level}` 日志等级
       */
      file?: string | ((log: LogRecord) => string);
      /**
       * 输出格式。默认 `text`；采集管道建议 `json`（每行一条 NDJSON）。
       */
      format?: TransportFormat;
      /**
       * 文件权限，默认使用系统权限
       */
      fileMode?: Mode;
      /**
       * 文件夹权限，默认使用系统权限
       */
      dirMode?: Mode;
    } = {},
  ) {
    super();
    this.file = opts.file ?? './logs/{year}-{month}-{day}/{level}.log';
    this.format = opts.format ?? 'text';
    this.fileMode = opts.fileMode;
    this.dirMode = opts.dirMode;
  }

  override async consume(log: LogRecord): Promise<any> {
    const file = this.resolveFilePath(log);
    const dir = dirname(file);
    if (!this.ensuredDirs.has(dir)) {
      await mkdir(dir, { recursive: true, mode: this.dirMode });
      this.ensuredDirs.add(dir);
    }
    await appendFile(file, this.getContent(log), { mode: this.fileMode });
  }

  protected resolveFilePath(log: LogRecord): string {
    let file: string;
    if (typeof this.file === 'function') {
      file = this.file(log);
    } else {
      file = this.file;
      for (const [key, value] of Object.entries(this.dateToJSON(log.timestamp))) {
        file = file.replaceAll(`{${key}}`, value);
      }
      file = file.replaceAll('{level}', log.level);
    }

    if (!file || file.includes('\0')) {
      throw new Error(i18n.t('invalid_log_file_path'));
    }

    return normalize(file);
  }

  protected getContent(log: LogRecord) {
    if (this.format === 'json') {
      return `${this.formatLog(log, 'json')}\n`;
    }
    const plain: LogRecord = {
      ...log,
      message: stripVTControlCharacters(log.message),
    };
    return `${this.formatLog(plain, 'text')}\n`;
  }
}
