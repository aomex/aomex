import EventEmitter from 'node:events';
import { hideBin } from 'yargs/helpers';
import {
  I18n,
  Middleware,
  compose,
  ensureI18nLanguage,
  internalDestroyServices,
  middleware,
  type CombinedServices,
  type I18nLanguage,
  type PromisifiedService,
} from '@aomex/common';
import type { BaseLoggerService } from '@aomex/logger';
import { ConsoleInput } from './input';
import { ConsoleContext } from './context';
import { helpLogger } from '../middleware/help-logger';
import type { ConsoleMiddlewareToken } from '../override';
import { toArray, type Union2Intersection } from '@aomex/internal-tools';
import { ConsoleError } from '../utils/console-error';

export namespace ConsoleApp {
  export type Logger = PromisifiedService<BaseLoggerService>;

  export interface Option<T extends ConsoleMiddlewareToken[] | []> {
    /**
     * 全局中间件
     * ```typescript
     *
     * const app = new ConsoleApp({
     *   services,
     *   logger: services.logger,
     *   language: 'zh-CN',
     *   mount: [md1, md2],
     * });
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
     * `combineServices` 的返回值（单个或数组）。
     * 关停：进程 beforeExit / SIGINT / SIGTERM 时自动销毁。
     */
    services: CombinedServices | readonly CombinedServices[];
    /**
     * 经 `combineServices` 处理后的 logger（通常为 `services.logger`）。
     * 默认 `error` 监听 / `ctx.logger` 均走此实例。
     *
     * ```ts
     * const services = await combineServices(
     *   { logger: () => import('./logger.service.js') },
     *   { eager: ['logger'] },
     * );
     * new ConsoleApp({
     *   services,
     *   logger: services.logger,
     *   language: 'zh-CN',
     * });
     * ```
     */
    logger: Logger;
    /**
     * 全局语言，只能是内置规范码（如 `zh-CN` / `en-US`）。
     * 异步语言包会在执行指令前按需加载。
     */
    language: I18nLanguage;
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
  error: [err: ConsoleError, ctx: ConsoleContext & ConsoleApp.Props, level: number];
}> {
  level: number = 0;
  protected readonly middlewareList: Middleware[];
  protected readonly logger: ConsoleApp.Logger;

  constructor(protected readonly options: ConsoleApp.Option<T>) {
    super();
    this.middlewareList = options.mount || [];
    this.logger = options.logger;
    this.bindServicesShutdown(toArray(options.services));
  }

  protected bindServicesShutdown(services: CombinedServices[]) {
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
      this.on('error', (err) => {
        void this.logger.error(err);
      });
    }

    try {
      await compose([
        middleware.mixin(async (_, next) => {
          const language = this.options.language;
          await ensureI18nLanguage(language);
          return I18n.provider(language, next);
        }),
        helpLogger(this.middlewareList),
        ...this.middlewareList,
      ])(ctx);
      return 0;
    } catch (e) {
      const err = ConsoleError.from(e);
      this.emit('error', err, ctx as ConsoleContext & ConsoleApp.Props, currentLevel);
      return 1;
    } finally {
      --this.level;
    }
  }
}
