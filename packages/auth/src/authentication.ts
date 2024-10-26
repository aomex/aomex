import type { WebMiddleware } from '@aomex/web';
import { Strategy } from './strategy';
import { middleware } from '@aomex/common';

export namespace Authentication {
  export interface Options<S extends { [K: string]: Strategy<object | string> }> {
    strategies: S;
  }
}

export class Authentication<S extends { [K: string]: Strategy<object | string> }> {
  constructor(protected readonly options: Authentication.Options<S>) {}

  /**
   * 获取策略实例
   */
  public strategy<StrategyName extends keyof S>(name: StrategyName) {
    return this.options.strategies[name]! as S[StrategyName];
  }

  /**
   * 身份认证中间件
   */
  public authenticate<StrategyName extends keyof S>(
    name: StrategyName,
  ): WebMiddleware<{
    readonly [K in StrategyName]: S[StrategyName] extends Strategy<infer P> ? P : never;
  }> {
    const strategy = this.strategy(name);

    return middleware.web({
      fn: async (ctx, next) => {
        let payload: object | string | false = false;
        try {
          payload = (await strategy['authenticate'](ctx)) as any;
        } catch (e) {
          return void ctx.throw(401, e as Error);
        }

        if (payload === false) return ctx.throw(401);

        Object.defineProperty(ctx, name, {
          get: () => payload,
        });
        return next();
      },
      openapi: strategy['openapi'](),
    });
  }
}
