import { Middleware, MixinMiddleware, type Next } from '@aomex/common';

import type { NonReadonly } from '@aomex/internal-tools';
import type { ConsoleApp, ConsoleContext } from '../cli';

export type ConsoleMiddlewareToken<P extends object = object> =
  | ConsoleMiddleware<P>
  | MixinMiddleware<P>;

declare module '@aomex/common' {
  export interface MiddlewarePlatform {
    readonly console: <Props extends object = object>(
      fn: ConsoleMiddlewareArguments<Props>['fn'] | ConsoleMiddlewareArguments<Props>,
    ) => ConsoleMiddleware<Props>;
  }
}

export namespace ConsoleDocument {
  export interface Document {
    [commandName: string]: CommandItem;
  }

  export interface CommandItem {
    /**
     * 是否展示在指令列表。默认值：`true`
     */
    showInHelp?: boolean;
    /**
     * 总结，在指令列表中展示
     */
    summary?: string;
    /**
     * 详细描述，在指令详情中展示
     */
    description?: string;
    /**
     * 参数
     */
    parameters?: ParameterItem[];
  }

  export interface ParameterItem {
    /**
     * 名称
     */
    name: string;
    /**
     * 别名
     */
    alias?: string[];
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否必传
     */
    required?: boolean;
    /**
     * 是否已废弃
     */
    deprecated?: boolean;
    /**
     * 参数类型
     */
    type?: 'array' | 'count' | 'boolean' | 'number' | 'string';
    /**
     * 默认值
     */
    defaultValue?: any;
  }
}

export interface ConsoleHelpInjector {
  onDocument?: (
    doc: ConsoleDocument.Document,
    opts: {
      app: ConsoleApp;
      /**
       * 继续收集（local）中间件的相同事件
       */
      children: (middlewareList: Middleware[]) => Promise<void>;
      /**
       * onDocument周期结束后，立即开始收集具体的指令
       */
      collectCommand: (commandName: string, middlewareList: Middleware[]) => void;
    },
  ) => void | Promise<void>;
  postDocument?: (
    doc: ConsoleDocument.Document,
    opts: {
      app: ConsoleApp;
      /**
       * 继续收集（local）中间件的相同事件
       */
      children: (middlewareList: Middleware[]) => Promise<void>;
    },
  ) => void | Promise<void>;

  onCommandItem?: (
    commandItem: ConsoleDocument.CommandItem,
    opts: {
      doc: ConsoleDocument.Document;
      commandName: string;
      app: ConsoleApp;
      /**
       * 继续收集（local）中间件的相同事件
       */
      children: (middlewareList: Middleware[]) => Promise<void>;
    },
  ) => void | Promise<void>;
  postCommandItem?: ConsoleHelpInjector['onCommandItem'];
}

interface ConsoleMiddlewareArguments<T extends object> {
  fn: (ctx: NonReadonly<T> & ConsoleContext, next: Next) => any;
  help?: ConsoleHelpInjector;
}

export class ConsoleMiddleware<Props extends object = object> extends Middleware<Props> {
  protected declare _console_middleware_: 'console-middleware';
  private readonly helpInjector: ConsoleHelpInjector;

  constructor(
    args: ConsoleMiddlewareArguments<Props>['fn'] | ConsoleMiddlewareArguments<Props>,
  ) {
    const { fn: fn, help = {} } =
      typeof args === 'function'
        ? ({ fn: args } satisfies ConsoleMiddlewareArguments<Props>)
        : args;
    super(fn);
    this.helpInjector = help;
  }

  protected help(): ConsoleHelpInjector {
    return this.helpInjector;
  }
}

Middleware.register('console', ConsoleMiddleware);
