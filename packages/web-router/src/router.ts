import { Chain, chain, compose, middleware, Middleware } from '@aomex/core';
import { toArray } from '@aomex/helper';
import type { WebChain, WebMiddlewareToken } from '@aomex/web';
import { Builder, type BuilderOptions } from './builder';

export interface RouterOptions<Props extends object = object> {
  prefix?: string;
  methodNotAllowed?: boolean;
  mount?: WebChain<Props>;
}

export class Router<Props extends object = object> {
  public static getBuilders(router: Router): Builder[] {
    return router.builders;
  }

  public static getChain(router: Router): WebChain {
    return router.chain;
  }

  public static toMiddleware(router: Router) {
    return router.toMiddleware();
  }

  protected readonly chain: WebChain;
  protected readonly prefix: string;
  protected readonly throwIfMethodMismatch: boolean;
  protected readonly builders: Builder[] = [];

  constructor(protected readonly opts: RouterOptions<Props> = {}) {
    this.prefix = opts.prefix || '';
    this.chain = opts.mount || chain.web;
    this.throwIfMethodMismatch = opts.methodNotAllowed || false;
  }

  public get<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['GET', 'HEAD'], options);
  }

  public post<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['POST'], options);
  }

  public put<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['PUT'], options);
  }

  public patch<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['PATCH'], options);
  }

  public delete<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['DELETE'], options);
  }

  public head<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['HEAD'], options);
  }

  public options<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, ['OPTIONS'], options);
  }

  public all<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, Builder['METHODS'].slice(), options);
  }

  public customize<T extends WebMiddlewareToken<object>[] | []>(
    methods: (typeof Builder)['METHODS'][number][],
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, methods, options);
  }

  protected create(
    uri: string | string[],
    methods: (typeof Builder)['METHODS'][number][],
    options: BuilderOptions<Props, any[]>,
  ): void {
    this.builders.push(
      new Builder(this.prefix, toArray(uri), methods, options),
    );
  }

  protected toMiddleware(): Middleware {
    const builders = this.builders;
    const throwIfMethodMismatch = this.throwIfMethodMismatch;
    let groupChain: Chain | null = null;

    return middleware.web((ctx, next) => {
      const { request } = ctx;
      const { path: pathname } = request;
      const method = request.method.toUpperCase();
      let matched = false;
      let routerChain: WebChain | null = null;

      for (let i = 0; i < builders.length; ++i) {
        const builder = builders[i]!;
        const params = builder.match(pathname, method);
        if (params) {
          matched = true;
          params !== true && (request.params = params);
          routerChain = builder.chain;
          break;
        }
      }

      if (matched) {
        groupChain ||= Chain.split(this.chain, ctx.app.chainPoints);
        return compose([groupChain, routerChain!])(ctx, next);
      }

      if (throwIfMethodMismatch) {
        for (let i = 0; i < builders.length; ++i) {
          if (builders[i]!.isMethodMismatch(pathname, method)) {
            ctx.throw(405);
          }
        }
      }

      return next();
    });
  }
}
