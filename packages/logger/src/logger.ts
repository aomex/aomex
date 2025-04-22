import type { Transport } from './transports/transport';
import { transports } from './transports';
import timers from 'node:timers/promises';

export namespace Logger {
  export type Level<T extends string> =
    | 'all'
    | 'none'
    | T[]
    | { from: T; to?: T }
    | { from?: T; to: T }
    | { from: T; to: T };

  export interface Options<T extends string> {
    levels: T[];
    transports?: {
      /**
       * 接收日志。内置方案汇聚在 `Logger.transports` 属性中。用户也可以自己实现
       */
      transport: Transport;
      /**
       * 日志输出等级，有以下几种传值方式：
       * - `all` 输出全部等级的日志
       * - `none` 关闭日志输出
       * - `[ ]` 输出指定的等级的日志，空数组则代表关闭日志输出
       * - `{ min?, max? }` 输出等级区间内的日志，min的分数必须<=max的分数，否则关闭日志输出
       */
      level: Level<NoInfer<T>>;
    }[];
  }

  export interface Log<T extends string = string> {
    timestamp: Date;
    level: T;
    content: string;
  }
}

export abstract class Logger<T extends string> {
  static transports = transports;

  static create = <L extends string>(
    opts: Logger.Options<L>,
  ): Logger<L> & { [K in L]: (content: string) => void } => {
    // @ts-expect-error
    return new Logger(opts);
  };

  protected readonly levels: T[];
  protected readonly logs: Logger.Log<T>[] = [];
  protected transportAndLevels: { transport: Transport; levels: T[] }[];
  protected timer?: NodeJS.Timeout;

  readonly transports: {
    add(opts: { transport: Transport; level: Logger.Level<T> }): void;
    remove(strip: (transport: Transport, levels: T[]) => boolean): void;
    /**
     * 统计某个级别有几个消费实例
     */
    count: (level: T) => number;
  };

  constructor(opts: Logger.Options<T>) {
    this.levels = opts.levels;
    this.transportAndLevels = (opts.transports || []).map(({ transport, level }) => {
      return {
        transport,
        levels: this.transformLevel(level),
      };
    });
    this.levels.forEach((level) => {
      Object.defineProperty(this, level, {
        value: this.log.bind(this, level),
      });
    });

    this.transports = {
      add: (opts) => {
        this.transportAndLevels.push({
          transport: opts.transport,
          levels: this.transformLevel(opts.level),
        });
      },
      remove: (strip) => {
        this.transportAndLevels = this.transportAndLevels.filter(
          ({ transport, levels }) => {
            return !strip(transport, levels);
          },
        );
      },
      count: (level) => {
        let counter = 0;
        for (const { levels } of this.transportAndLevels) {
          if (levels.includes(level)) ++counter;
        }
        return counter;
      },
    };
  }

  /**
   * 保证日志（异步）输送完毕
   */
  async complete() {
    while (true) {
      if (!this.timer) return;
      if (!this.logs.length) return;
      await timers.setTimeout(50);
    }
  }

  protected log(level: T, content: string) {
    this.logs.push({
      timestamp: new Date(),
      content,
      level,
    });
    this.timer ||= setTimeout(async () => {
      await this.consume();
      this.timer = undefined;
    });
  }

  protected async consume() {
    let log = this.logs.shift();
    while (log) {
      const targetLevel = log.level;
      await Promise.all(
        this.transportAndLevels.map(async ({ transport, levels }) => {
          if (levels.includes(targetLevel)) {
            await transport.consume(log!);
          }
        }),
      );
      log = this.logs.shift();
    }
  }

  protected transformLevel(level: Logger.Level<T>): T[] {
    if (typeof level !== 'object') {
      return level === 'all' ? [...this.levels] : [];
    }
    if (Array.isArray(level)) return [...new Set(level)];

    const min = level.from ? this.levels.findIndex((l) => l === level.from) : 0;
    const max = level.to
      ? this.levels.findIndex((l) => l === level.to) + 1
      : this.levels.length;
    return this.levels.slice(min, max);
  }
}
