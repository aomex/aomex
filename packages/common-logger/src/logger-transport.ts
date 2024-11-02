import path from 'node:path';
import type { Logger } from './logger';

export abstract class LoggerTransport {
  abstract consume(log: Logger.Log): Promise<any>;

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

  protected prettifyError(
    error: string | Error,
    opts: {
      /**
       * 删除错误栈包含node:internal路径的文件。默认：`true`
       */
      removeNodeInternal?: boolean;
      /**
       * 删除错误栈包含node_module路径的文件。默认：`true`
       */
      removeNodeModule?: boolean;
      /**
       * 错误栈完整路径转化为相对路径。默认：`true`
       */
      toRelativePath?: boolean;
      /**
       * 删除错误栈前缀`  at`。默认：`false`
       */
      removeAt?: boolean;
    } = {},
  ) {
    const {
      removeNodeModule = true,
      removeNodeInternal = true,
      removeAt = false,
      toRelativePath = true,
    } = opts;
    const cwd = process.cwd();
    const errorMsgAndStacks = (
      typeof error === 'string' ? error : error.stack || ''
    ).split('\n');
    const stackIndex = Math.max(
      1,
      errorMsgAndStacks.findIndex((item) => /^\s+at\s+/.test(item)),
    );

    const message = errorMsgAndStacks.slice(0, stackIndex).join('\n');
    const stack = errorMsgAndStacks
      .slice(stackIndex)
      .filter((item) => {
        return (
          (!removeNodeInternal || !item.includes('node:internal')) &&
          (!removeNodeModule || !item.includes('node_modules/'))
        );
      })
      .map((item) => {
        if (toRelativePath) {
          item = item.replaceAll('file://', '').replaceAll(cwd + path.sep, '');
        }
        if (removeAt) {
          item = item.replaceAll(/^\s+at\s+(?:async\s+)?/gi, ' '.repeat(4));
        }
        return item;
      })
      .join('\n');

    return { message, stack };
  }
}
