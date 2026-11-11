import EventEmitter from 'node:events';
import { EOL } from 'node:os';
import { styleText } from 'node:util';
import { hideBin } from 'yargs/helpers';
import {
  I18n,
  Middleware,
  compose,
  internalDestroyServices,
  middleware,
  type CombinedServices,
} from '@aomex/common';
import { ConsoleInput } from './input';
import { ConsoleContext } from './context';
import { helpLogger } from '../middleware/help-logger';
import type { ConsoleMiddlewareToken } from '../override';
import { toArray, type Union2Intersection } from '@aomex/internal-tools';

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
    /**
     * `combineServices` 的返回值（单个或数组）。传入后在进程 beforeExit/SIGINT/SIGTERM 时自动销毁。
     */
    services?: CombinedServices | readonly CombinedServices[];
    language?: 'zh_CN' | 'en_US' | (string & {});
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
    this.middlewareList = options.mount || [];
    this.bindServicesShutdown(options.services ? toArray(options.services) : []);
  }

  protected bindServicesShutdown(services: CombinedServices[]) {
    if (!services.length) return;
    // beforeExit：异步 onDestroy 会拖住事件循环直至结束
    process.once('beforeExit', () => {
      void internalDestroyServices(services);
    });

    // 信号：必须等销毁完成再 exit，否则默认退出行为已被监听器接管
    const onSignal = () => {
      void internalDestroyServices(services).finally(() => {
        process.exit(0);
      });
    };
    process.once('SIGTERM', onSignal);
    process.once('SIGINT', onSignal);
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
    const ctx = new ConsoleContext(this, input);

    // 至少需要一个监听者，否则程序会报错
    if (!this.listenerCount('error')) {
      this.on('error', this.log.bind(this));
    }

    try {
      await compose([
        middleware.mixin((_, next) => {
          return this.options.language
            ? I18n.provider(this.options.language, next)
            : next();
        }),
        helpLogger(this.middlewareList),
        ...this.middlewareList,
      ])(ctx);
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
