import EventEmitter from 'node:events';
import { EOL } from 'node:os';
import { styleText } from 'node:util';
import { hideBin } from 'yargs/helpers';
import {
  I18n,
  Middleware,
  MixinMiddlewareChain,
  compose,
  flattenMiddlewareToken,
  i18n,
} from '@aomex/core';
import { ConsoleInput } from './input';
import { ConsoleTerminal } from './terminal';
import { ConsoleContext } from './context';
import type { ConsoleMiddlewareChain } from '../override';
import { helpLogger } from '../middleware/help-logger';

export interface ConsoleAppOption {
  /**
   * 全局中间件组，挂载后该组会被打上标记。
   * ```typescript
   * const appChain = mdchain.console.mount(md1).mount(md2);
   * const chain1 = appChain.mount(md3);
   * const chain2 = chain1.mount(md4);
   *
   * const app = new ConsoleApp({ box: appChain });
   * ```
   */
  mount?: ConsoleMiddlewareChain | MixinMiddlewareChain;
  locale?: I18n.LocaleName;
}

export class ConsoleApp extends EventEmitter<{
  error: [err: Error, ctx: ConsoleContext, level: number];
}> {
  level: number = 0;
  protected readonly point?: string;
  protected readonly middlewareList: Middleware[];

  constructor(protected readonly options: ConsoleAppOption = {}) {
    super();
    if (options.locale) {
      i18n.setLocale(options.locale);
    }
    this.middlewareList = [];
    if (options.mount) {
      this.point = options.mount['createPoint']();
      this.middlewareList = flattenMiddlewareToken(options.mount);
    }
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
