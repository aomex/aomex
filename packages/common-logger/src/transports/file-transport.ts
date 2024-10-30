import { dirname } from 'node:path';
import type { Mode } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';
import { appendFile, mkdir } from 'node:fs/promises';
import { LoggerTransport } from '../logger-transport';
import type { Logger } from '../logger';

export class FileTransport extends LoggerTransport {
  protected readonly file: string | ((message: Logger.Message) => string);
  protected readonly fileMode?: Mode;
  protected readonly dirMode?: Mode;

  constructor(opts: {
    /**
     * 日志文件路径，支持引入时间占位符。
     * - `%year%` 年
     * - `%month%` 月
     * - `%day%` 日
     * - `%hour%` 时
     * - `%minute%` 分
     * - `%second%` 秒
     *
     * ```typescript
     * new FileTransport({
     *   file: `./logs/%year%-%month%-%day%/%hour%.log`,
     * })
     * ```
     */
    file: string | ((message: Logger.Message) => string);
    /**
     * 文件权限，默认使用系统权限
     */
    fileMode?: Mode;
    /**
     * 文件夹权限，默认使用系统权限
     */
    dirMode?: Mode;
  }) {
    super();
    this.file = opts.file;
    this.fileMode = opts.fileMode;
    this.dirMode = opts.dirMode;
  }

  override async consume(message: Logger.Message): Promise<any> {
    const date = new Date(message.timestamp);
    let file: string;
    if (typeof this.file === 'function') {
      file = this.file(message);
    } else {
      file = this.file;
      for (const [key, value] of Object.entries(this.dateToJSON(date))) {
        file = file.replaceAll(`%${key}%`, value);
      }
    }

    await mkdir(dirname(file), { recursive: true, mode: this.dirMode });
    await appendFile(file, this.getContent(message), { mode: this.fileMode });
  }

  protected getContent(message: Logger.Message) {
    return `[${message.level}] ${this.dateToString(new Date(message.timestamp))} ${stripVTControlCharacters(message.text)}\n`;
  }
}
