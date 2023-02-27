import EventEmitter from 'node:events';
import { EOL } from 'node:os';
import { hideBin } from 'yargs/helpers';
import { Chain, compose } from '@aomex/core';
import { ConsoleRequest } from './request';
import { ConsoleResponse } from './response';
import { ConsoleContext } from './context';
import type { ConsoleMiddlewareToken } from '../override/chain';
import { showHelp } from '../middleware/showHelp';
import { HelpMiddleware } from '../override';
import { chalk } from '@aomex/helper';

export interface ConsoleAppOption {
  silent?: boolean;
}

export class ConsoleApp extends EventEmitter {
  public readonly chainPoints: string[] = [];
  protected level: number = 0;
  protected readonly tokenList: ConsoleMiddlewareToken[] = [];

  constructor(protected readonly options: ConsoleAppOption = {}) {
    super();
  }

  /**
   * Run command. Builtin `process.argv` will be used by default until you input one or more arguments.
   * @see process.argv
   */
  public async run(...commands: string[]): Promise<void> {
    const currentLevel = this.level++;
    const request = new ConsoleRequest(
      this,
      commands.length ? commands : hideBin(process.argv),
    );
    const response = new ConsoleResponse(this);
    const ctx = new ConsoleContext(this, request, response);

    // At least one listener is required before emit.
    if (!this.listenerCount('error')) {
      this.on('error', this.log.bind(this));
    }

    try {
      const middlewareList = Chain.flatten(this.tokenList);
      const helps = middlewareList.filter(
        (item) => item instanceof HelpMiddleware,
      );
      const normals = middlewareList.filter(
        (item) => !(item instanceof HelpMiddleware),
      );

      await compose([showHelp(helps), ...normals])(ctx);
      if (!response.commandMatched) {
        throw new Error(`Command "${request.command}" is not found`);
      }
    } catch (e) {
      currentLevel === 0 && this.emit('error', e);
      throw e;
    } finally {
      --this.level;
    }
  }

  public log(err: Error) {
    if (this.options.silent) return;
    const stack = (err.stack || err.toString())
      .split(EOL)
      .map((item) => '  ' + item);
    console.error(
      ['', chalk.red(stack.shift()), stack.join(EOL), ''].join(EOL),
    );
  }

  public mount(middleware: ConsoleMiddlewareToken | null): void {
    if (middleware === null) return;
    if (middleware instanceof Chain) {
      this.chainPoints.push(Chain.createSplitPoint(middleware));
    }
    this.tokenList.push(middleware);
  }
}
