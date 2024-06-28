import EventEmitter from 'node:events';
import { EOL } from 'node:os';
import { styleText } from 'node:util';
import { hideBin } from 'yargs/helpers';
import { I18n, Middleware, compose, i18n } from '@aomex/core';
import { ConsoleInput } from './input';
import { ConsoleTerminal } from './terminal';
import { ConsoleContext } from './context';
import { helpLogger } from '../middleware/help-logger';
import type { ConsoleMiddlewareToken } from '../override';
import type { Union2Intersection } from '@aomex/internal-tools';

export namespace ConsoleApp {
  export interface Option<T extends ConsoleMiddlewareToken[] | []> {
    /**
     * 全局中间件
     * ```typescript
     *
     * const app = new ConsoleApp({ mount: [md1, md2] });
     *
     * declare module '@aomex/console' {
     *   namespace ConsoleApp {
     *     type T = ConsoleApp.Infer<typeof app>;
     *     interface Props extends T {}
     *   }
     * }
     * ```
     */
    mount?: T;
    locale?: I18n.LocaleName;
  }

  export type Infer<T> =
    T extends ConsoleApp<infer U>
      ? U extends any[]
        ? Union2Intersection<Middleware.CollectArrayType<U[number]>>
        : unknown
      : unknown;

  export interface Props {}
}

export class ConsoleApp<
  T extends ConsoleMiddlewareToken[] | [] = any[],
> extends EventEmitter<{
  error: [err: Error, ctx: ConsoleContext & ConsoleApp.Props, level: number];
}> {
  level: number = 0;
  protected readonly point?: string;
  protected readonly middlewareList: Middleware[];

  constructor(protected readonly options: ConsoleApp.Option<T> = {}) {
    super();
    i18n.setLocale(options.locale || 'zh_CN');
    this.middlewareList = options.mount || [];
  }

  /**
   * 执行指令。如果不传参数，则使用内置的`process.argv`
   * ```typescript
   * app.run('schedule:a')
   * app.run('schedule:a', '-f', '--type', 'all')
   * ```
   */
  public async run(...commands: string[]): Promise<0 | 1> {
    const currentLevel = this.level++;
    const input = new ConsoleInput(
      this,
      commands.length ? commands : hideBin(process.argv),
    );
    const terminal = new ConsoleTerminal();
    const ctx = new ConsoleContext(this, input, terminal);

    // 至少需要一个监听者，否则程序会报错
    if (!this.listenerCount('error')) {
      this.on('error', this.log.bind(this));
    }

    try {
      await compose([helpLogger(this.middlewareList), ...this.middlewareList])(ctx);
      return 0;
    } catch (e) {
      // @ts-ignore
      this.emit('error', e as Error, ctx, currentLevel);
      return 1;
    } finally {
      --this.level;
    }
  }

  public log(err: Error) {
    const stack = (err.stack || err.toString()).split(EOL).map((item) => '  ' + item);
    console.error([styleText('red', stack.shift() || ''), stack.join(EOL)].join(EOL));
  }
}
