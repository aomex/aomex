import type { WebContext, WebMiddleware } from '@aomex/web';
import { Strategy } from './strategy';
import { middleware } from '@aomex/common';
import { AuthError } from './auth-error';

export namespace Auth {
  export interface Options<
    S extends { [K: string]: Strategy<object | string | number, any[]> },
  > {
    strategies: S;
  }

  export type DetermineAuthorizeArgs<
    S extends { [K: string]: Strategy<object | string | number, any[]> },
    StrategyName extends keyof S,
  > =
    S[StrategyName] extends Strategy<any, infer Args>
      ? unknown[] extends Args
        ? []
        : Args
      : never;

  export type DetermineMiddlewareProps<
    S extends { [K: string]: Strategy<object | string | number, any[]> },
    StrategyName extends keyof S,
  > = {
    readonly [K in StrategyName]: S[StrategyName] extends Strategy<infer P, any>
      ? P
      : never;
  };
}

export class Auth<S extends { [K: string]: Strategy<object | string | number, any[]> }> {
  constructor(protected readonly options: Auth.Options<S>) {}

  /**
   * 获取策略实例
   */
  public strategy<StrategyName extends keyof S>(name: StrategyName) {
    return this.options.strategies[name]! as S[StrategyName];
  }

  /**
   * 在已经身份认证(authenticate)的基础上进行访问权限认证，不满足时响应`403`状态码
   */
  public authorize<StrategyName extends keyof S>(
    name: StrategyName,
    ...args: Auth.DetermineAuthorizeArgs<S, StrategyName>
  ): WebMiddleware<object /* 身份认证时已经给过类型，仅授权不需要返回类型 */> {
    const strategy = this.strategy(name);

    return middleware.web<Auth.DetermineMiddlewareProps<S, StrategyName>>({
      fn: async (ctx, next) => {
        const payload = ctx[name];
        await this.internalAuthorize(ctx, strategy, payload, args);
        return next();
      },
    });
  }

  /**
   * 对访问凭证（token，cookie，session等）进行身份确认，不满足时响应`401`状态码
   */
  public authenticate<StrategyName extends keyof S>(
    name: StrategyName,
  ): WebMiddleware<Auth.DetermineMiddlewareProps<S, StrategyName>> & {
    authorize: (
      ...args: Auth.DetermineAuthorizeArgs<S, StrategyName>
    ) => WebMiddleware<Auth.DetermineMiddlewareProps<S, StrategyName>>;
  } {
    const strategy = this.strategy(name);
    let withAuthorize = false;
    const authorizeArgs: any[] = [];

    const md = middleware.web({
      fn: async (ctx, next) => {
        let payload: string | number | false | object | AuthError = false;
        try {
          payload = await strategy['authenticate'](ctx);
        } catch (e) {
          if (e instanceof AuthError) {
            return ctx.throw(401, e);
          } else {
            throw e;
          }
        }
        if (payload instanceof AuthError) {
          return ctx.throw(401, payload.message);
        }
        if (payload === false) {
          return ctx.throw(401);
        }
        if (withAuthorize) {
          await this.internalAuthorize(ctx, strategy, payload, authorizeArgs);
        }
        Object.defineProperty(ctx, name, {
          get: () => payload,
        });
        return next();
      },
      openapi: strategy['openapi'](),
    });

    // @ts-expect-error
    md.authorize = (...args: any[]) => {
      withAuthorize = true;
      authorizeArgs.push(...args);
      return md;
    };

    // @ts-expect-error
    return md;
  }

  protected async internalAuthorize(
    ctx: WebContext,
    strategy: Strategy<any>,
    payload: any,
    authorizeArgs: any[],
  ) {
    let authorized: AuthError | boolean = false;
    try {
      authorized = await strategy['authorize'](payload, ...authorizeArgs);
    } catch (e) {
      if (e instanceof AuthError) {
        return ctx.throw(403, e);
      } else {
        throw e;
      }
    }
    if (authorized instanceof AuthError) {
      return ctx.throw(403, authorized.message);
    }
    if (!authorized) {
      return ctx.throw(403);
    }
  }
}
