import { Chain, chain, compose, middleware, Middleware } from '@aomex/core';
import { toArray } from '@aomex/utility';
import { METHOD, WebApp, WebChain, WebMiddlewareToken } from '@aomex/web';
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
    return this.create(uri, [METHOD.GET, METHOD.HEAD], options);
  }

  public post<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, [METHOD.POST], options);
  }

  public put<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, [METHOD.PUT], options);
  }

  public patch<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, [METHOD.PATCH], options);
  }

  public delete<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, [METHOD.DELETE], options);
  }

  public head<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, [METHOD.HEAD], options);
  }

  public options<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, [METHOD.OPTIONS], options);
  }

  public all<T extends WebMiddlewareToken<object>[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, Object.values(METHOD).slice(), options);
  }

  public customize<T extends WebMiddlewareToken<object>[] | []>(
    methods: METHOD[],
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): void {
    return this.create(uri, methods, options);
  }

  protected create(
    uri: string | string[],
    methods: METHOD[],
    options: BuilderOptions<Props, any[]>,
  ): void {
    this.builders.push(
      new Builder(this.prefix, toArray(uri), methods, options),
    );
  }

  protected toMiddleware(): Middleware {
    const groupChain = new Map<WebApp, Chain>();

    return middleware.web((ctx, next) => {
      const { app, request } = ctx;
      const { path: pathname } = request;
      const method = request.method.toUpperCase();
      let matched = false;
      let routerChain: WebChain | null = null;

      for (let i = 0; i < this.builders.length; ++i) {
        const builder = this.builders[i]!;
        const params = builder.match(pathname, method);
        if (params) {
          matched = true;
          params !== true && (request.params = params);
          routerChain = builder.chain;
          break;
        }
      }

      if (matched) {
        if (!groupChain.has(app)) {
          groupChain.set(app, Chain.split(this.chain, app.chainPoints));
        }
        return compose([groupChain.get(app)!, routerChain!])(ctx, next);
      }

      if (this.throwIfMethodMismatch) {
        for (let i = 0; i < this.builders.length; ++i) {
          if (this.builders[i]!.isMethodMismatch(pathname, method)) {
            ctx.throw(405);
          }
        }
      }

      return next();
    });
  }
}
